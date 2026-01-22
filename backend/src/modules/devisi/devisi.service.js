
const { Devisi, User, Kpi } = require('../../models');
const { Op } = require('sequelize');
const logger = require('../../utils/logger');

class DevisiService {
  async getAll(filters = {}) {
    try {
      const where = {};
      
      if (filters.is_active !== undefined) {
        where.is_active = filters.is_active;
      }

      if (filters.search) {
        where.nama_devisi = { [Op.iLike]: `%${filters.search}%` };
      }

      const devisiList = await Devisi.findAll({
        where,
        attributes: ['id', 'nama_devisi', 'deskripsi', 'is_active', 'created_at', 'updated_at'],
        order: [['nama_devisi', 'ASC']],
      });

      // Get counts for each devisi
      const devisiWithCounts = await Promise.all(
        devisiList.map(async (devisi) => {
          const [jumlah_karyawan, jumlah_kpi] = await Promise.all([
            User.count({ where: { devisi_id: devisi.id, is_active: true } }),
            Kpi.count({ where: { devisi_id: devisi.id, is_active: true } }),
          ]);

          return {
            ...devisi.toJSON(),
            jumlah_karyawan,
            jumlah_kpi,
          };
        })
      );

      return { success: true, data: devisiWithCounts };
    } catch (error) {
      logger.error('Get all devisi error:', error);
      throw error;
    }
  }

  async getById(devisiId) {
    try {
      const devisi = await Devisi.findByPk(devisiId, {
        include: [
          {
            model: User,
            as: 'users',
            attributes: ['id', 'nama_lengkap', 'email', 'role'],
            where: { is_active: true },
            required: false,
          },
          {
            model: Kpi,
            as: 'kpis',
            attributes: ['id', 'nama_kpi', 'periode', 'is_active'],
            where: { is_active: true },
            required: false,
          },
        ],
      });

      if (!devisi) {
        return { success: false, message: 'Devisi tidak ditemukan' };
      }

      return { success: true, data: devisi };
    } catch (error) {
      logger.error('Get devisi by ID error:', error);
      throw error;
    }
  }

  async create(devisiData) {
    try {
      const existing = await Devisi.findOne({
        where: { nama_devisi: devisiData.nama_devisi },
      });

      if (existing) {
        return { success: false, message: 'Nama devisi sudah ada' };
      }

      const devisi = await Devisi.create(devisiData);

      logger.info(`Devisi created: ${devisi.nama_devisi}`, { devisiId: devisi.id });

      return { success: true, data: devisi };
    } catch (error) {
      logger.error('Create devisi error:', error);
      throw error;
    }
  }

  async update(devisiId, devisiData) {
    try {
      const devisi = await Devisi.findByPk(devisiId);

      if (!devisi) {
        return { success: false, message: 'Devisi tidak ditemukan' };
      }

      if (devisiData.nama_devisi && devisiData.nama_devisi !== devisi.nama_devisi) {
        const existing = await Devisi.findOne({
          where: { nama_devisi: devisiData.nama_devisi, id: { [Op.ne]: devisiId } },
        });
        if (existing) {
          return { success: false, message: 'Nama devisi sudah digunakan' };
        }
      }

      await devisi.update(devisiData);

      logger.info(`Devisi updated: ${devisi.nama_devisi}`, { devisiId });

      return { success: true, data: devisi };
    } catch (error) {
      logger.error('Update devisi error:', error);
      throw error;
    }
  }

  async delete(devisiId) {
    try {
      const devisi = await Devisi.findByPk(devisiId);

      if (!devisi) {
        return { success: false, message: 'Devisi tidak ditemukan' };
      }

      // Check if devisi has users
      const userCount = await User.count({ where: { devisi_id: devisiId } });
      if (userCount > 0) {
        return {
          success: false,
          message: `Tidak dapat menghapus devisi. Masih ada ${userCount} karyawan di devisi ini`,
        };
      }

      // Soft delete
      await devisi.update({ is_active: false });

      logger.info(`Devisi deactivated: ${devisi.nama_devisi}`, { devisiId });

      return { success: true, message: 'Devisi berhasil dinonaktifkan' };
    } catch (error) {
      logger.error('Delete devisi error:', error);
      throw error;
    }
  }
}


module.exports = new DevisiService();
