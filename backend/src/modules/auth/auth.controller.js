const authService = require('./auth.service');
const { successResponse, errorResponse } = require('../../utils/response');

class AuthController {
  // Login
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      if (!result.success) {
        return errorResponse(res, result.message, 401);
      }

      return successResponse(res, result.data, 'Login berhasil');
    } catch (error) {
      next(error);
    }
  }

  // Register (Manager only)
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, result.data, 'User berhasil didaftarkan', 201);
    } catch (error) {
      next(error);
    }
  }

  // Get current user
  async getCurrentUser(req, res, next) {
    try {
      const userId = req.user.userId;
      const result = await authService.getUserById(userId);

      if (!result.success) {
        return errorResponse(res, result.message, 404);
      }

      return successResponse(res, result.data);
    } catch (error) {
      next(error);
    }
  }

  // Refresh token
  async refreshToken(req, res, next) {
    try {
      const { refresh_token } = req.body;

      if (!refresh_token) {
        return errorResponse(res, 'Refresh token wajib diisi', 400);
      }

      const result = await authService.refreshToken(refresh_token);

      if (!result.success) {
        return errorResponse(res, result.message, 401);
      }

      return successResponse(res, result.data, 'Token berhasil diperbarui');
    } catch (error) {
      next(error);
    }
  }

  // Logout
  async logout(req, res, next) {
    try {
      // In a real-world scenario, you might want to blacklist the token
      // For now, we'll just return success
      return successResponse(res, null, 'Logout berhasil');
    } catch (error) {
      next(error);
    }
  }

  // Change password
  async changePassword(req, res, next) {
    try {
      const userId = req.user.userId;
      const { old_password, new_password } = req.body;

      const result = await authService.changePassword(userId, old_password, new_password);

      if (!result.success) {
        return errorResponse(res, result.message, 400);
      }

      return successResponse(res, null, 'Password berhasil diubah');
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
