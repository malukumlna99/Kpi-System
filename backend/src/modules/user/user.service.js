const { User, Devisi, KpiAssessment, KpiResult } = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

class UserService {
  async getAll(filters = {}, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const where = {};

      if (filters.devisi_id) {
        where.devisi_id = filters.devisi_id;
      }

      if (filters.role) {
        where.role = filters.role;
      }

      if (filters.is_active !== undefined) {
        where.is_active = filters.is_active;
      }

      if (filters.search) {
        where[Op.or] = [
          { nama_lengkap: { [Op.iLike]: `%${filters.search}%` } },
          { email: { [Op.iLike]: `%${filters.search}%` } },
        ];
      }

      const { count, rows } = await User.findAndCountAll({
        where,
        include: [
          {
            model: Devisi,
            as: 'devisi',
            attributes: ['id', 'nama_devisi'],
          },
        ],
        attributes: { exclude: ['password'] },
        limit: parseInt(limit),
        offset,
        order: [['created_at', 'DESC']],
      });

      return {
        success: true,
        data: rows,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
        },
      };
    } catch (error) {
      logger.error('Get all users error:', error);
      throw error;
    }
  }

  async getById(userId) {
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

      // Get user statistics
      const totalAssessments = await KpiAssessment.count({
        where: { user_id: userId, status: 'reviewed' },
      });

      const results = await KpiResult.findAll({
        where: { user_id: userId },
        attributes: ['avg_score'],
      });

      const avgScore = results.length > 0
        ? results.reduce((sum, r) => sum + r.avg_score, 0) / results.length
        : 0;

      return {
        success: true,
        data: {
          ...user.toJSON(),
          statistics: {
            total_assessments: totalAssessments,
            avg_score: avgScore,
          },
        },
      };
    } catch (error) {
      logger.error('Get user by ID error:', error);
      throw error;
    }
  }

  async create(userData) {
    try {
      // Check if email already exists
      const existingUser = await User.findOne({
        where: { email: userData.email },
      });

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

      logger.info(`User created: ${user.email}`, { userId: user.id });

      // Return without password
      const { password, ...userWithoutPassword } = user.toJSON();

      return {
        success: true,
        data: userWithoutPassword,
      };
    } catch (error) {
      logger.error('Create user error:', error);
      throw error;
    }
  }

  async update(userId, userData) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return { success: false, message: 'User tidak ditemukan' };
      }

      // Check email uniqueness if changed
      if (userData.email && userData.email !== user.email) {
        const existingUser = await User.findOne({
          where: { email: userData.email, id: { [Op.ne]: userId } },
        });
        if (existingUser) {
          return { success: false, message: 'Email sudah digunakan' };
        }
      }

      // Check devisi if changed
      if (userData.devisi_id && userData.devisi_id !== user.devisi_id) {
        const devisi = await Devisi.findByPk(userData.devisi_id);
        if (!devisi) {
          return { success: false, message: 'Devisi tidak ditemukan' };
        }
      }

      // Update user (password will be hashed by model hook if changed)
      await user.update({
        devisi_id: userData.devisi_id || user.devisi_id,
        nama_lengkap: userData.nama_lengkap || user.nama_lengkap,
        email: userData.email || user.email,
        role: userData.role || user.role,
        ...(userData.password && { password: userData.password }),
      });

      logger.info(`User updated: ${user.email}`, { userId });

      const { password, ...userWithoutPassword } = user.toJSON();

      return {
        success: true,
        data: userWithoutPassword,
      };
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  }

  async deactivate(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return { success: false, message: 'User tidak ditemukan' };
      }

      if (!user.is_active) {
        return { success: false, message: 'User sudah nonaktif' };
      }

      await user.update({ is_active: false });

      logger.info(`User deactivated: ${user.email}`, { userId });

      return { success: true, message: 'User berhasil dinonaktifkan' };
    } catch (error) {
      logger.error('Deactivate user error:', error);
      throw error;
    }
  }

  async activate(userId) {
    try {
      const user = await User.findByPk(userId);

      if (!user) {
        return { success: false, message: 'User tidak ditemukan' };
      }

      if (user.is_active) {
        return { success: false, message: 'User sudah aktif' };
      }

      await user.update({ is_active: true });

      logger.info(`User activated: ${user.email}`, { userId });

      return { success: true, message: 'User berhasil diaktifkan' };
    } catch (error) {
      logger.error('Activate user error:', error);
      throw error;
    }
  }

  async getStatistics(devisiId) {
    try {
      const where = devisiId ? { devisi_id: devisiId } : {};

      const totalUsers = await User.count({ where });
      const activeUsers = await User.count({ where: { ...where, is_active: true } });
      const totalManagers = await User.count({ where: { ...where, role: 'manager' } });
      const totalKaryawan = await User.count({ where: { ...where, role: 'karyawan' } });

      // Users by devisi
      const usersByDevisi = await User.findAll({
        attributes: [
          'devisi_id',
          [User.sequelize.fn('COUNT', User.sequelize.col('id')), 'total'],
        ],
        include: [
          {
            model: Devisi,
            as: 'devisi',
            attributes: ['nama_devisi'],
          },
        ],
        group: ['devisi_id', 'devisi.id', 'devisi.nama_devisi'],
        raw: true,
      });

      return {
        success: true,
        data: {
          total_users: totalUsers,
          active_users: activeUsers,
          total_managers: totalManagers,
          total_karyawan: totalKaryawan,
          users_by_devisi: usersByDevisi,
        },
      };
    } catch (error) {
      logger.error('Get user statistics error:', error);
      throw error;
    }
  }
}

module.exports = new UserService();
