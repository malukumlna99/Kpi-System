// ============= kpi.controller.js =============
const kpiService = require('./kpi.service');
const { successResponse, errorResponse } = require('../../utils/response');

class KpiController {
  async getAll(req, res, next) {
    try {
      const { devisi_id, is_active, periode, search } = req.query;
      
      const filters = {};
      if (devisi_id) filters.devisi_id = devisi_id;
      if (is_active !== undefined) filters.is_active = is_active === 'true';
      if (periode) filters.periode = periode;
      if (search) filters.search = search;

      const result = await kpiService.getAll(filters);
      return successResponse(res, result.data, 'Data KPI berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await kpiService.getById(id);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data);
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const result = await kpiService.create(req.body);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, 'KPI berhasil dibuat', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await kpiService.update(id, req.body);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, 'KPI berhasil diupdate');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await kpiService.delete(id);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  // For karyawan - get their KPIs
  async getMyKpis(req, res, next) {
    try {
      const userId = req.user.userId;
      const devisiId = req.user.devisiId;

      const result = await kpiService.getKpiForUser(userId, devisiId);
      return successResponse(res, result.data, 'KPI Anda berhasil diambil');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new KpiController();
