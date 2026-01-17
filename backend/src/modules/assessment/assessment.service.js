const {
  KpiAssessment,
  KpiAnswer,
  Kpi,
  KpiQuestion,
  User,
  Devisi,
  KpiResult,
} = require('../../models');
const { sequelize } = require('../../config/database');
const { calculateGrade, formatPeriode } = require('../../utils/response');
const logger = require('../../utils/logger');
const { Op } = require('sequelize');

class AssessmentService {
  // Calculate total score from answers
  calculateTotalScore(answers, questions) {
    let totalWeightedScore = 0;
    let totalWeight = 0;

    answers.forEach((answer) => {
      const question = questions.find((q) => q.id === answer.question_id);
      if (question && answer.nilai_jawaban !== null) {
        // Normalize score to 0-100 scale
        let normalizedScore;
        if (question.tipe_jawaban === 'numeric_1_5') {
          normalizedScore = (answer.nilai_jawaban / 5) * 100;
        } else if (question.tipe_jawaban === 'numeric_0_100') {
          normalizedScore = answer.nilai_jawaban;
        } else {
          normalizedScore = 0; // Text answers don't contribute to score
        }

        totalWeightedScore += normalizedScore * question.bobot_soal;
        totalWeight += question.bobot_soal;
      }
    });

    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }

  // Submit assessment
  async submitAssessment(userId, assessmentData) {
    const transaction = await sequelize.transaction();

    try {
      // Validate KPI
      const kpi = await Kpi.findByPk(assessmentData.kpi_id, {
        include: [
          {
            model: KpiQuestion,
            as: 'questions',
          },
        ],
      });

      if (!kpi) {
        await transaction.rollback();
        return { success: false, message: 'KPI tidak ditemukan' };
      }

      // Validate user devisi matches KPI devisi
      const user = await User.findByPk(userId);
      if (user.devisi_id !== kpi.devisi_id) {
        await transaction.rollback();
        return { success: false, message: 'KPI ini bukan untuk devisi Anda' };
      }

      // Validate all mandatory questions are answered
      const mandatoryQuestions = kpi.questions.filter((q) => q.is_mandatory);
      const answeredQuestionIds = assessmentData.answers.map((a) => a.question_id);
      const missingMandatory = mandatoryQuestions.filter(
        (q) => !answeredQuestionIds.includes(q.id)
      );

      if (missingMandatory.length > 0) {
        await transaction.rollback();
        return {
          success: false,
          message: 'Semua pertanyaan wajib harus dijawab',
          missing_questions: missingMandatory.map((q) => q.pertanyaan),
        };
      }

      // Calculate total score
      const totalScore = this.calculateTotalScore(assessmentData.answers, kpi.questions);

      // Create assessment
      const assessment = await KpiAssessment.create(
        {
          user_id: userId,
          kpi_id: assessmentData.kpi_id,
          tanggal_pengisian: assessmentData.tanggal_pengisian || new Date(),
          status: 'submitted',
          total_score: totalScore,
          catatan_karyawan: assessmentData.catatan_karyawan,
          submitted_at: new Date(),
        },
        { transaction }
      );

      // Create answers
      const answers = assessmentData.answers.map((answer) => ({
        assessment_id: assessment.id,
        question_id: answer.question_id,
        nilai_jawaban: answer.nilai_jawaban,
        jawaban_text: answer.jawaban_text,
      }));

      await KpiAnswer.bulkCreate(answers, { transaction });

      // Update or create KPI Result
      await this.updateKpiResult(userId, assessmentData.kpi_id, kpi.periode, transaction);

      await transaction.commit();

      logger.info(`Assessment submitted`, {
        userId,
        assessmentId: assessment.id,
        kpiId: assessmentData.kpi_id,
        score: totalScore,
      });

      return {
        success: true,
        data: {
          assessment_id: assessment.id,
          total_score: totalScore,
          grade: calculateGrade(totalScore),
          status: 'submitted',
        },
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Submit assessment error:', error);
      throw error;
    }
  }

  // Save as draft
  async saveDraft(userId, assessmentData) {
    const transaction = await sequelize.transaction();

    try {
      const kpi = await Kpi.findByPk(assessmentData.kpi_id);

      if (!kpi) {
        await transaction.rollback();
        return { success: false, message: 'KPI tidak ditemukan' };
      }

      // Check if draft already exists
      let assessment = await KpiAssessment.findOne({
        where: {
          user_id: userId,
          kpi_id: assessmentData.kpi_id,
          status: 'draft',
        },
      });

      if (assessment) {
        // Update existing draft
        await assessment.update(
          {
            catatan_karyawan: assessmentData.catatan_karyawan,
          },
          { transaction }
        );

        // Delete old answers
        await KpiAnswer.destroy({
          where: { assessment_id: assessment.id },
          transaction,
        });
      } else {
        // Create new draft
        assessment = await KpiAssessment.create(
          {
            user_id: userId,
            kpi_id: assessmentData.kpi_id,
            tanggal_pengisian: new Date(),
            status: 'draft',
            catatan_karyawan: assessmentData.catatan_karyawan,
          },
          { transaction }
        );
      }

      // Save answers
      if (assessmentData.answers && assessmentData.answers.length > 0) {
        const answers = assessmentData.answers.map((answer) => ({
          assessment_id: assessment.id,
          question_id: answer.question_id,
          nilai_jawaban: answer.nilai_jawaban,
          jawaban_text: answer.jawaban_text,
        }));

        await KpiAnswer.bulkCreate(answers, { transaction });
      }

      await transaction.commit();

      return {
        success: true,
        data: {
          assessment_id: assessment.id,
          status: 'draft',
        },
      };
    } catch (error) {
      await transaction.rollback();
      logger.error('Save draft error:', error);
      throw error;
    }
  }

  // Update KPI Result (aggregated data)
  async updateKpiResult(userId, kpiId, periode, transaction) {
    try {
      const kpi = await Kpi.findByPk(kpiId);
      const periodeStr = formatPeriode(new Date(), periode);

      // Get all submitted assessments for this user-KPI-periode
      const assessments = await KpiAssessment.findAll({
        where: {
          user_id: userId,
          kpi_id: kpiId,
          status: 'submitted',
          tanggal_pengisian: {
            [Op.gte]: new Date(periodeStr + '-01'),
          },
        },
      });

      if (assessments.length === 0) return;

      // Calculate average
      const totalScore = assessments.reduce((sum, a) => sum + a.total_score, 0);
      const avgScore = totalScore / assessments.length;
      const grade = calculateGrade(avgScore);

      // Upsert result
      const [result, created] = await KpiResult.findOrCreate({
        where: {
          user_id: userId,
          kpi_id: kpiId,
          periode: periodeStr,
        },
        defaults: {
          avg_score: avgScore,
          total_score: totalScore,
          jumlah_assessment: assessments.length,
          grade,
        },
        transaction,
      });

      if (!created) {
        await result.update(
          {
            avg_score: avgScore,
            total_score: totalScore,
            jumlah_assessment: assessments.length,
            grade,
          },
          { transaction }
        );
      }
    } catch (error) {
      logger.error('Update KPI result error:', error);
      throw error;
    }
  }

  // Get user assessment history
  async getMyHistory(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;

      const { count, rows } = await KpiAssessment.findAndCountAll({
        where: { user_id: userId, status: { [Op.ne]: 'draft' } },
        include: [
          {
            model: Kpi,
            as: 'kpi',
            attributes: ['id', 'nama_kpi', 'periode'],
          },
        ],
        attributes: [
          'id',
          'tanggal_pengisian',
          'status',
          'total_score',
          'catatan_karyawan',
          'catatan_manager',
          'submitted_at',
          'reviewed_at',
        ],
        limit,
        offset,
        order: [['tanggal_pengisian', 'DESC']],
      });

      const historyWithGrade = rows.map((h) => ({
        ...h.toJSON(),
        grade: calculateGrade(h.total_score),
      }));

      return {
        success: true,
        data: historyWithGrade,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
        },
      };
    } catch (error) {
      logger.error('Get assessment history error:', error);
      throw error;
    }
  }

  // Get assessment detail
  async getAssessmentDetail(assessmentId, userId, userRole) {
    try {
      const where = { id: assessmentId };
      
      // Karyawan can only see their own
      if (userRole === 'karyawan') {
        where.user_id = userId;
      }

      const assessment = await KpiAssessment.findOne({
        where,
        include: [
          {
            model: Kpi,
            as: 'kpi',
            attributes: ['id', 'nama_kpi', 'deskripsi', 'periode'],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nama_lengkap', 'email'],
            include: [
              {
                model: Devisi,
                as: 'devisi',
                attributes: ['id', 'nama_devisi'],
              },
            ],
          },
          {
            model: KpiAnswer,
            as: 'answers',
            include: [
              {
                model: KpiQuestion,
                as: 'question',
                attributes: ['id', 'pertanyaan', 'tipe_jawaban', 'bobot_soal'],
              },
            ],
          },
        ],
      });

      if (!assessment) {
        return { success: false, message: 'Assessment tidak ditemukan' };
      }

      return {
        success: true,
        data: {
          ...assessment.toJSON(),
          grade: calculateGrade(assessment.total_score),
        },
      };
    } catch (error) {
      logger.error('Get assessment detail error:', error);
      throw error;
    }
  }

  // Manager: Review assessment
  async reviewAssessment(assessmentId, managerId, catatanManager) {
    try {
      const assessment = await KpiAssessment.findByPk(assessmentId);

      if (!assessment) {
        return { success: false, message: 'Assessment tidak ditemukan' };
      }

      if (assessment.status !== 'submitted') {
        return { success: false, message: 'Assessment belum disubmit' };
      }

      await assessment.update({
        status: 'reviewed',
        catatan_manager: catatanManager,
        reviewed_at: new Date(),
      });

      logger.info(`Assessment reviewed`, {
        assessmentId,
        managerId,
      });

      return { success: true, message: 'Assessment berhasil direview' };
    } catch (error) {
      logger.error('Review assessment error:', error);
      throw error;
    }
  }
}

module.exports = new AssessmentService();