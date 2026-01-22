const reportsService = require('./reports.service');
const { successResponse, errorResponse } = require('../../utils/response');

class ReportsController {
  // Dashboard summary (Manager)
  async getDashboard(req, res, next) {
    try {
      const { periode, devisi_id } = req.query;
      const result = await reportsService.getDashboardSummary({ periode, devisi_id });

      return successResponse(res, result.data, 'Dashboard summary berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  // Employee performance report (Manager)
  async getEmployees(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        devisi_id,
        periode,
        min_score,
        max_score,
        grade,
        sort_by = 'score',
        order = 'desc',
      } = req.query;

      const filters = {
        devisi_id,
        periode,
        min_score,
        max_score,
        grade,
        sort_by,
        order,
      };

      const result = await reportsService.getEmployeePerformance(filters, page, limit);

      return successResponse(res, result.data, 'Laporan performa karyawan berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  // User detailed report (Manager)
  async getEmployeeDetail(req, res, next) {
    try {
      const { id } = req.params;
      const { start_date, end_date } = req.query;

      const result = await reportsService.getUserDetailedReport(id, { start_date, end_date });

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data, 'Laporan detail karyawan berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  // KPI statistics (Manager)
  async getKpiStatistics(req, res, next) {
    try {
      const { id } = req.params;
      const { periode } = req.query;

      const result = await reportsService.getKpiStatistics(id, { periode });

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data, 'Statistik KPI berhasil diambil');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportsController();
