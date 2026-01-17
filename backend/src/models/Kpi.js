const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Kpi = sequelize.define('kpi', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  devisi_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'devisi',
      key: 'id',
    },
  },
  nama_kpi: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [5, 200],
    },
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  periode: {
    type: DataTypes.ENUM('monthly', 'quarterly', 'yearly'),
    allowNull: false,
    defaultValue: 'monthly',
  },
  bobot: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 100,
    validate: {
      min: 1,
      max: 100,
    },
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'kpi',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeUpdate: (kpi) => {
      kpi.updated_at = new Date();
    },
  },
});

module.exports = Kpi;
