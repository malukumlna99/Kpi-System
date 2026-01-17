// KPI Result Model (Aggregated)
const KpiResult = sequelize.define('kpi_results', {
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
  periode: {
    type: DataTypes.STRING(20),
    allowNull: false,
    comment: 'Format: 2024-01, 2024-Q1, 2024',
  },
  avg_score: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  total_score: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  jumlah_assessment: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  grade: {
    type: DataTypes.ENUM('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'E'),
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
  tableName: 'kpi_results',
  timestamps: true,
  underscored: true,
  hooks: {
    beforeUpdate: (result) => {
      result.updated_at = new Date();
    },
  },
});

module.exports = { KpiAnswer, KpiResult };