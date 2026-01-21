const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KpiAssessment = sequelize.define('kpi_assessments', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  kpi_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kpi',
      key: 'id',
    },
  },
  tanggal_pengisian: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM('draft', 'submitted', 'reviewed'),
    allowNull: false,
    defaultValue: 'draft',
  },
  total_score: {
    type: DataTypes.FLOAT,
    allowNull: true,
    defaultValue: 0,
  },
  catatan_karyawan: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  catatan_manager: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  submitted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  reviewed_at: {
    type: DataTypes.DATE,
    allowNull: true,
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
  tableName: 'kpi_assessments',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeUpdate: (assessment) => {
      assessment.updated_at = new Date();
    },
  },
  indexes: [
    {
      fields: ['user_id', 'kpi_id', 'tanggal_pengisian'],
    },
    {
      fields: ['status'],
    },
  ],
});

module.exports = KpiAssessment;
