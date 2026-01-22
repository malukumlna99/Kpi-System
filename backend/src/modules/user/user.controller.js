const userService = require('./user.service');
const { successResponse, successResponseWithPagination, errorResponse } = require('../../utils/response');

class UserController {
  // Get all users (Manager only)
  async getAll(req, res, next) {
    try {
      const { page = 1, limit = 10, devisi_id, role, is_active, search } = req.query;

      const filters = {};
      if (devisi_id) filters.devisi_id = devisi_id;
      if (role) filters.role = role;
      if (is_active !== undefined) filters.is_active = is_active === 'true';
      if (search) filters.search = search;

      const result = await userService.getAll(filters, page, limit);

      return successResponseWithPagination(
        res,
        result.data,
        result.pagination,
        'Data users berhasil diambil'
      );
    } catch (error) {
      next(error);
    }
  }

  // Get user by ID (Manager only)
  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.getById(id);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data);
    } catch (error) {
      next(error);
    }
  }

  // Create user (Manager only)
  async create(req, res, next) {
    try {
      const result = await userService.create(req.body);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, 'User berhasil dibuat', 201);
    } catch (error) {
      next(error);
    }
  }

  // Update user (Manager only)
  async update(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.update(id, req.body);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, 'User berhasil diupdate');
    } catch (error) {
      next(error);
    }
  }

  // Deactivate user (Manager only)
  async deactivate(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.deactivate(id);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  // Activate user (Manager only)
  async activate(req, res, next) {
    try {
      const { id } = req.params;
      const result = await userService.activate(id);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, result.message);
    } catch (error) {
      next(error);
    }
  }

  // Get user statistics (Manager only)
  async getStatistics(req, res, next) {
    try {
      const { devisi_id } = req.query;
      const result = await userService.getStatistics(devisi_id);

      return successResponse(res, result.data, 'Statistik user berhasil diambil');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
