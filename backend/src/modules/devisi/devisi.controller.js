
const devisiService = require('./devisi.service');
const { successResponse, errorResponse } = require('../../utils/response');

class DevisiController {
  async getAll(req, res, next) {
    try {
      const { is_active, search } = req.query;
      const filters = {};
      if (is_active !== undefined) filters.is_active = is_active === 'true';
      if (search) filters.search = search;

      const result = await devisiService.getAll(filters);
      return successResponse(res, result.data, 'Data devisi berhasil diambil');
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await devisiService.getById(id);

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
      const result = await devisiService.create(req.body);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, 'Devisi berhasil dibuat', 201);
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await devisiService.update(id, req.body);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, 'Devisi berhasil diupdate');
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const result = await devisiService.delete(id);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DevisiController();

