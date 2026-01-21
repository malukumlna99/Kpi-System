const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KpiQuestion = sequelize.define('kpi_questions', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  kpi_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kpi',
      key: 'id',
    },
  },
  pertanyaan: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  tipe_jawaban: {
    type: DataTypes.ENUM('numeric_1_5', 'numeric_0_100', 'text'),
    allowNull: false,
    defaultValue: 'numeric_1_5',
  },
  bobot_soal: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10,
    validate: {
      min: 1,
      max: 100,
    },
  },
  urutan: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  is_mandatory: {
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
  tableName: 'kpi_questions',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeUpdate: (question) => {
      question.updated_at = new Date();
    },
  },
});

module.exports = KpiQuestion;
