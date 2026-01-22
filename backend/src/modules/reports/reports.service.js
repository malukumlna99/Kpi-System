const {
  User,
  Devisi,
  Kpi,
  KpiQuestion,
  KpiAssessment,
  KpiAnswer,
  KpiResult,
} = require('../../models');
const { Op } = require('sequelize');
const { sequelize } = require('../../config/database');
const { calculateGrade, parsePeriode } = require('../../utils/response');
const logger = require('../../utils/logger');

class ReportsService {
  async getDashboardSummary(filters = {}) {
    try {
      const where = {};
      if (filters.devisi_id) where.devisi_id = filters.devisi_id;

      // Summary statistics
      const totalKaryawan = await User.count({ where: { ...where, role: 'karyawan', is_active: true } });
      const totalDevisi = await Devisi.count({ where: { is_active: true } });
      const totalKpi = await Kpi.count({ where: { ...where, is_active: true } });

      // Assessment this month
      const currentMonth = new Date();
      const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

      const assessmentBulanIni = await KpiAssessment.count({
        where: {
          status: 'submitted',
          tanggal_pengisian: {
            [Op.between]: [firstDay, lastDay],
          },
        },
      });

      const assessmentPendingReview = await KpiAssessment.count({
        where: { status: 'submitted' },
      });

      // Average score
      const assessments = await KpiAssessment.findAll({
        where: { status: 'reviewed' },
        attributes: ['total_score'],
      });

      const avgScoreKeseluruhan = assessments.length > 0
        ? assessments.reduce((sum, a) => sum + a.total_score, 0) / assessments.length
        : 0;

      // Devisi performance
      const devisiPerformance = await this.getDevisiPerformance();

      // Recent assessments
      const recentAssessments = await KpiAssessment.findAll({
        where: { status: { [Op.in]: ['submitted', 'reviewed'] } },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nama_lengkap'],
            include: [{ model: Devisi, as: 'devisi', attributes: ['nama_devisi'] }],
          },
          {
            model: Kpi,
            as: 'kpi',
            attributes: ['id', 'nama_kpi'],
          },
        ],
        order: [['created_at', 'DESC']],
        limit: 10,
      });

      // Top performers
      const topPerformers = await this.getTopPerformers(5);

      // Monthly trend (last 3 months)
      const monthlyTrend = await this.getMonthlyTrend(3);

      return {
        success: true,
        data: {
          summary: {
            total_karyawan: totalKaryawan,
            total_devisi: totalDevisi,
            total_kpi: totalKpi,
            assessment_bulan_ini: assessmentBulanIni,
            assessment_pending_review: assessmentPendingReview,
            avg_score_keseluruhan: avgScoreKeseluruhan,
          },
          devisi_performance: devisiPerformance,
          recent_assessments: recentAssessments,
          top_performers: topPerformers,
          trend_monthly: monthlyTrend,
        },
      };
    } catch (error) {
      logger.error('Get dashboard summary error:', error);
      throw error;
    }
  }

  async getDevisiPerformance() {
    try {
      const devisiList = await Devisi.findAll({
        where: { is_active: true },
        attributes: ['id', 'nama_devisi'],
      });

      const performance = await Promise.all(
        devisiList.map(async (devisi) => {
          const jumlahKaryawan = await User.count({
            where: { devisi_id: devisi.id, role: 'karyawan', is_active: true },
          });

          const results = await KpiResult.findAll({
            include: [
              {
                model: User,
                as: 'user',
                where: { devisi_id: devisi.id },
                attributes: [],
              },
            ],
            attributes: ['avg_score', 'grade'],
          });

          const avgScore = results.length > 0
            ? results.reduce((sum, r) => sum + r.avg_score, 0) / results.length
            : 0;

          const totalAssessment = await KpiAssessment.count({
            include: [
              {
                model: User,
                as: 'user',
                where: { devisi_id: devisi.id },
                attributes: [],
              },
            ],
            where: { status: 'reviewed' },
          });

          // Grade distribution
          const gradeDistribution = {};
          results.forEach((r) => {
            if (r.grade) {
              gradeDistribution[r.grade] = (gradeDistribution[r.grade] || 0) + 1;
            }
          });

          return {
            devisi_id: devisi.id,
            nama_devisi: devisi.nama_devisi,
            jumlah_karyawan: jumlahKaryawan,
            avg_score: avgScore,
            total_assessment: totalAssessment,
            grade_distribution: gradeDistribution,
          };
        })
      );

      return performance;
    } catch (error) {
      logger.error('Get devisi performance error:', error);
      throw error;
    }
  }

  async getTopPerformers(limit = 5) {
    try {
      const results = await KpiResult.findAll({
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'nama_lengkap'],
            include: [{ model: Devisi, as: 'devisi', attributes: ['nama_devisi'] }],
          },
        ],
        attributes: [
          'user_id',
          [sequelize.fn('AVG', sequelize.col('avg_score')), 'overall_avg'],
          [sequelize.fn('COUNT', sequelize.col('KpiResult.id')), 'total_assessments'],
        ],
        group: ['user_id', 'user.id', 'user.nama_lengkap', 'user->devisi.id', 'user->devisi.nama_devisi'],
        order: [[sequelize.fn('AVG', sequelize.col('avg_score')), 'DESC']],
        limit,
        raw: false,
      });

      return results.map((r) => ({
        user_id: r.user.id,
        nama_lengkap: r.user.nama_lengkap,
        devisi: r.user.devisi.nama_devisi,
        avg_score: parseFloat(r.dataValues.overall_avg),
        total_assessment: parseInt(r.dataValues.total_assessments),
        grade: calculateGrade(parseFloat(r.dataValues.overall_avg)),
      }));
    } catch (error) {
      logger.error('Get top performers error:', error);
      throw error;
    }
  }

  async getMonthlyTrend(months = 3) {
    try {
      const trends = [];
      const currentDate = new Date();

      for (let i = 0; i < months; i++) {
        const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
        const periode = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`;

        const assessments = await KpiAssessment.findAll({
          where: {
            status: 'reviewed',
            tanggal_pengisian: {
              [Op.gte]: month,
              [Op.lt]: nextMonth,
            },
          },
          attributes: ['total_score'],
        });

        const avgScore = assessments.length > 0
          ? assessments.reduce((sum, a) => sum + a.total_score, 0) / assessments.length
          : 0;

        trends.unshift({
          periode,
          avg_score: avgScore,
          total_assessment: assessments.length,
        });
      }

      return trends;
    } catch (error) {
      logger.error('Get monthly trend error:', error);
      throw error;
    }
  }

  async getEmployeePerformance(filters = {}, page = 1, limit = 10) {
    try {
      // Implementation for employee performance report
      const offset = (page - 1) * limit;
      const where = {};

      if (filters.devisi_id) where.devisi_id = filters.devisi_id;

      const users = await User.findAll({
        where: { ...where, role: 'karyawan', is_active: true },
        include: [
          {
            model: Devisi,
            as: 'devisi',
            attributes: ['id', 'nama_devisi'],
          },
          {
            model: KpiResult,
            as: 'results',
            attributes: ['avg_score', 'grade', 'periode'],
          },
        ],
        limit,
        offset,
      });

      return {
        success: true,
        data: users,
      };
    } catch (error) {
      logger.error('Get employee performance error:', error);
      throw error;
    }
  }

  async getUserDetailedReport(userId, filters = {}) {
    try {
      const user = await User.findByPk(userId, {
        include: [{ model: Devisi, as: 'devisi' }],
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        return { success: false, message: 'User tidak ditemukan' };
      }

      // Get assessment history
      const assessments = await KpiAssessment.findAll({
        where: { user_id: userId, status: 'reviewed' },
        include: [{ model: Kpi, as: 'kpi' }],
        order: [['tanggal_pengisian', 'DESC']],
      });

      const totalAssessments = assessments.length;
      const avgScore = totalAssessments > 0
        ? assessments.reduce((sum, a) => sum + a.total_score, 0) / totalAssessments
        : 0;

      return {
        success: true,
        data: {
          user,
          overall_stats: {
            total_assessment: totalAssessments,
            avg_score: avgScore,
            grade: calculateGrade(avgScore),
          },
          assessment_history: assessments,
        },
      };
    } catch (error) {
      logger.error('Get user detailed report error:', error);
      throw error;
    }
  }

  async getKpiStatistics(kpiId, filters = {}) {
    try {
      const kpi = await Kpi.findByPk(kpiId, {
        include: [{ model: Devisi, as: 'devisi' }],
      });

      if (!kpi) {
        return { success: false, message: 'KPI tidak ditemukan' };
      }

      const assessments = await KpiAssessment.findAll({
        where: { kpi_id: kpiId, status: 'reviewed' },
      });

      const totalAssessments = assessments.length;
      const avgScore = totalAssessments > 0
        ? assessments.reduce((sum, a) => sum + a.total_score, 0) / totalAssessments
        : 0;

      return {
        success: true,
        data: {
          kpi,
          overall_stats: {
            total_assessment: totalAssessments,
            avg_score: avgScore,
            grade: calculateGrade(avgScore),
          },
        },
      };
    } catch (error) {
      logger.error('Get KPI statistics error:', error);
      throw error;
    }
  }
}

module.exports = new ReportsService();
