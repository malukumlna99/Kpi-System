const { Kpi, KpiQuestion, Devisi, KpiAssessment } = require('../../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');
const logger = require('../../utils/logger');

class KpiService {
  async getAll(filters = {}) {
    try {
      const where = {};

      if (filters.devisi_id) {
        where.devisi_id = filters.devisi_id;
      }

      if (filters.is_active !== undefined) {
        where.is_active = filters.is_active;
      }

      if (filters.periode) {
        where.periode = filters.periode;
      }

      if (filters.search) {
        where.nama_kpi = { [Op.iLike]: `%${filters.search}%` };
      }

      const kpiList = await Kpi.findAll({
        where,
        include: [
          {
            model: Devisi,
            as: 'devisi',
            attributes: ['id', 'nama_devisi'],
          },
          {
            model: KpiQuestion,
            as: 'questions',
            attributes: ['id', 'pertanyaan', 'tipe_jawaban', 'bobot_soal', 'urutan'],
          },
        ],
        order: [
          ['created_at', 'DESC'],
          [{ model: KpiQuestion, as: 'questions' }, 'urutan', 'ASC'],
        ],
      });

      // Add question count
      const kpiWithCounts = kpiList.map((kpi) => ({
        ...kpi.toJSON(),
        jumlah_pertanyaan: kpi.questions?.length || 0,
      }));

      return { success: true, data: kpiWithCounts };
    } catch (error) {
      logger.error('Get all KPI error:', error);
      throw error;
    }
  }

  async getById(kpiId) {
    try {
      const kpi = await Kpi.findByPk(kpiId, {
        include: [
          {
            model: Devisi,
            as: 'devisi',
            attributes: ['id', 'nama_devisi', 'deskripsi'],
          },
          {
            model: KpiQuestion,
            as: 'questions',
            order: [['urutan', 'ASC']],
          },
        ],
      });

      if (!kpi) {
        return { success: false, message: 'KPI tidak ditemukan' };
      }

      return { success: true, data: kpi };
    } catch (error) {
      logger.error('Get KPI by ID error:', error);
      throw error;
    }
  }

  async create(kpiData) {
    const transaction = await sequelize.transaction();

    try {
      // Validate devisi
      const devisi = await Devisi.findByPk(kpiData.devisi_id);
      if (!devisi) {
        await transaction.rollback();
        return { success: false, message: 'Devisi tidak ditemukan' };
      }

      // Create KPI
      const kpi = await Kpi.create(
        {
          devisi_id: kpiData.devisi_id,
          nama_kpi: kpiData.nama_kpi,
          deskripsi: kpiData.deskripsi,
          periode: kpiData.periode,
          bobot: kpiData.bobot,
        },
        { transaction }
      );

      // Create questions if provided
      if (kpiData.questions && kpiData.questions.length > 0) {
        const questions = kpiData.questions.map((q, index) => ({
          kpi_id: kpi.id,
          pertanyaan: q.pertanyaan,
          tipe_jawaban: q.tipe_jawaban,
          bobot_soal: q.bobot_soal,
          urutan: q.urutan || index + 1,
          is_mandatory: q.is_mandatory !== false,
        }));

        await KpiQuestion.bulkCreate(questions, { transaction });
      }

      await transaction.commit();

      logger.info(`KPI created: ${kpi.nama_kpi}`, { kpiId: kpi.id });

      // Fetch complete KPI with questions
      const completeKpi = await this.getById(kpi.id);
      return completeKpi;
    } catch (error) {
      await transaction.rollback();
      logger.error('Create KPI error:', error);
      throw error;
    }
  }

  async update(kpiId, kpiData) {
    const transaction = await sequelize.transaction();

    try {
      const kpi = await Kpi.findByPk(kpiId);

      if (!kpi) {
        await transaction.rollback();
        return { success: false, message: 'KPI tidak ditemukan' };
      }

      // Update KPI
      await kpi.update(
        {
          nama_kpi: kpiData.nama_kpi,
          deskripsi: kpiData.deskripsi,
          periode: kpiData.periode,
          bobot: kpiData.bobot,
          is_active: kpiData.is_active,
        },
        { transaction }
      );

      // Update questions if provided
      if (kpiData.questions) {
        // Delete existing questions
        await KpiQuestion.destroy({ where: { kpi_id: kpiId }, transaction });

        // Create new questions
        if (kpiData.questions.length > 0) {
          const questions = kpiData.questions.map((q, index) => ({
            kpi_id: kpiId,
            pertanyaan: q.pertanyaan,
            tipe_jawaban: q.tipe_jawaban,
            bobot_soal: q.bobot_soal,
            urutan: q.urutan || index + 1,
            is_mandatory: q.is_mandatory !== false,
          }));

          await KpiQuestion.bulkCreate(questions, { transaction });
        }
      }

      await transaction.commit();

      logger.info(`KPI updated: ${kpi.nama_kpi}`, { kpiId });

      const updatedKpi = await this.getById(kpiId);
      return updatedKpi;
    } catch (error) {
      await transaction.rollback();
      logger.error('Update KPI error:', error);
      throw error;
    }
  }

  async delete(kpiId) {
    try {
      const kpi = await Kpi.findByPk(kpiId);

      if (!kpi) {
        return { success: false, message: 'KPI tidak ditemukan' };
      }

      // Check if KPI has assessments
      const assessmentCount = await KpiAssessment.count({ where: { kpi_id: kpiId } });
      if (assessmentCount > 0) {
        return {
          success: false,
          message: `Tidak dapat menghapus KPI. Sudah ada ${assessmentCount} assessment terkait`,
        };
      }

      // Soft delete
      await kpi.update({ is_active: false });

      logger.info(`KPI deactivated: ${kpi.nama_kpi}`, { kpiId });

      return { success: true, message: 'KPI berhasil dinonaktifkan' };
    } catch (error) {
      logger.error('Delete KPI error:', error);
      throw error;
    }
  }

  // Get KPIs for specific user (based on their devisi)
  async getKpiForUser(userId, devisiId) {
    try {
      const kpiList = await Kpi.findAll({
        where: {
          devisi_id: devisiId,
          is_active: true,
        },
        include: [
          {
            model: KpiQuestion,
            as: 'questions',
            order: [['urutan', 'ASC']],
          },
        ],
        order: [['created_at', 'DESC']],
      });

      // Check assessment status for each KPI
      const kpiWithStatus = await Promise.all(
        kpiList.map(async (kpi) => {
          const latestAssessment = await KpiAssessment.findOne({
            where: {
              user_id: userId,
              kpi_id: kpi.id,
            },
            order: [['created_at', 'DESC']],
            attributes: ['id', 'status', 'total_score', 'tanggal_pengisian'],
          });

          return {
            ...kpi.toJSON(),
            latest_assessment: latestAssessment,
            status_pengisian: latestAssessment?.status || 'pending',
          };
        })
      );

      return { success: true, data: kpiWithStatus };
    } catch (error) {
      logger.error('Get KPI for user error:', error);
      throw error;
    }
  }
}

module.exports = new KpiService();