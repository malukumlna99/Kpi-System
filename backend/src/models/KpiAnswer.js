const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const KpiAnswer = sequelize.define('kpi_answers', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  assessment_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kpi_assessments',
      key: 'id',
    },
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'kpi_questions',
      key: 'id',
    },
  },
  nilai_jawaban: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  jawaban_text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'kpi_answers',
  timestamps: true,
  underscored: true,
  updatedAt: false,
});

module.exports = KpiAnswer;
