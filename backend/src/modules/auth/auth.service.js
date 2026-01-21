const jwt = require('jsonwebtoken');
const { User, Devisi } = require('../../models');
const authConfig = require('../../config/auth');
const logger = require('../../utils/logger');

class AuthService {
  // Generate JWT tokens
  generateTokens(userId, email, role) {
    const accessToken = jwt.sign(
      { userId, email, role },
      authConfig.jwt.secret,
      { expiresIn: authConfig.jwt.expiresIn }
    );

    const refreshToken = jwt.sign(
      { userId, email, role },
      authConfig.jwt.refreshSecret,
      { expiresIn: authConfig.jwt.refreshExpiresIn }
    );

    return { accessToken, refreshToken };
  }

  // Login
  async login(email, password) {
    try {
      const user = await User.findOne({
        where: { email },
        include: [
          {
            model: Devisi,
            as: 'devisi',
            attributes: ['id', 'nama_devisi'],
          },
        ],
      });

      if (!user) {
        return { success: false, message: 'Email atau password salah' };
      }

      if (!user.is_active) {
        return { success: false, message: 'Akun Anda telah dinonaktifkan' };
      }

      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return { success: false, message: 'Email atau password salah' };
      }

      // Update last login
      await user.update({ last_login: new Date() });

      // Generate tokens
      const { accessToken, refreshToken } = this.generateTokens(
        user.id,
        user.email,
        user.role
      );

      logger.info(`User logged in: ${user.email}`, { userId: user.id });

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            nama_lengkap: user.nama_lengkap,
            email: user.email,
            role: user.role,
            devisi: user.devisi,
            foto_profil: user.foto_profil,
          },
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Register (Manager only)
  async register(userData) {
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        return { success: false, message: 'Email sudah terdaftar' };
      }

      // Check if devisi exists
      const devisi = await Devisi.findByPk(userData.devisi_id);
      if (!devisi) {
        return { success: false, message: 'Devisi tidak ditemukan' };
      }

      // Create user
      const user = await User.create({
        devisi_id: userData.devisi_id,
        nama_lengkap: userData.nama_lengkap,
        email: userData.email,
        password: userData.password,
        role: userData.role || 'karyawan',
        is_active: true,
      });

      logger.info(`User registered: ${user.email}`, { userId: user.id });

      return {
        success: true,
        data: {
          id: user.id,
          nama_lengkap: user.nama_lengkap,
          email: user.email,
          role: user.role,
        },
      };
    } catch (error) {
      logger.error('Register error:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: [
          {
            model: Devisi,
            as: 'devisi',
            attributes: ['id', 'nama_devisi', 'deskripsi'],
          },
        ],
        attributes: { exclude: ['password'] },
      });

      if (!user) {
        return { success: false, message: 'User tidak ditemukan' };
      }

      return { success: true, data: user };
    } catch (error) {
      logger.error('Get user error:', error);
      throw error;
    }
  }

  // Refresh token
  async refreshToken(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, authConfig.jwt.refreshSecret);

      // Check if user still exists and is active
      const user = await User.findByPk(decoded.userId);
      if (!user || !user.is_active) {
        return { success: false, message: 'User tidak valid' };
      }

      // Generate new tokens
      const tokens = this.generateTokens(user.id, user.email, user.role);

      return {
        success: true,
        data: {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        },
      };
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return { success: false, message: 'Refresh token sudah kadaluarsa' };
      }
      if (error.name === 'JsonWebTokenError') {
        return { success: false, message: 'Refresh token tidak valid' };
      }
      logger.error('Refresh token error:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(userId, oldPassword, newPassword) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return { success: false, message: 'User tidak ditemukan' };
      }

      // Verify old password
      const isPasswordValid = await user.comparePassword(oldPassword);
      if (!isPasswordValid) {
        return { success: false, message: 'Password lama salah' };
      }

      // Update password
      await user.update({ password: newPassword });

      logger.info(`Password changed for user: ${user.email}`, { userId });

      return { success: true, message: 'Password berhasil diubah' };
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }
}

module.exports = new AuthService();
