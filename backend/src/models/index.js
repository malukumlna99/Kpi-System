const { sequelize } = require('../config/database');
const Devisi = require('./Devisi');
const User = require('./User');
const Kpi = require('./Kpi');
const KpiQuestion = require('./KpiQuestion');
const KpiAssessment = require('./KpiAssessment');
const KpiAnswer = require('./KpiAnswer');
const KpiResult = require('./KpiResult');

// Define Associations
const setupAssociations = () => {
  // Devisi -> Users
  Devisi.hasMany(User, { foreignKey: 'devisi_id', as: 'users' });
  User.belongsTo(Devisi, { foreignKey: 'devisi_id', as: 'devisi' });

  // Devisi -> KPIs
  Devisi.hasMany(Kpi, { foreignKey: 'devisi_id', as: 'kpis' });
  Kpi.belongsTo(Devisi, { foreignKey: 'devisi_id', as: 'devisi' });

  // KPI -> Questions
  Kpi.hasMany(KpiQuestion, { foreignKey: 'kpi_id', as: 'questions' });
  KpiQuestion.belongsTo(Kpi, { foreignKey: 'kpi_id', as: 'kpi' });

  // User -> Assessments
  User.hasMany(KpiAssessment, { foreignKey: 'user_id', as: 'assessments' });
  KpiAssessment.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // KPI -> Assessments
  Kpi.hasMany(KpiAssessment, { foreignKey: 'kpi_id', as: 'assessments' });
  KpiAssessment.belongsTo(Kpi, { foreignKey: 'kpi_id', as: 'kpi' });

  // Assessment -> Answers
  KpiAssessment.hasMany(KpiAnswer, { foreignKey: 'assessment_id', as: 'answers' });
  KpiAnswer.belongsTo(KpiAssessment, { foreignKey: 'assessment_id', as: 'assessment' });

  // Question -> Answers
  KpiQuestion.hasMany(KpiAnswer, { foreignKey: 'question_id', as: 'answers' });
  KpiAnswer.belongsTo(KpiQuestion, { foreignKey: 'question_id', as: 'question' });

  // User -> Results
  User.hasMany(KpiResult, { foreignKey: 'user_id', as: 'results' });
  KpiResult.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

  // KPI -> Results
  Kpi.hasMany(KpiResult, { foreignKey: 'kpi_id', as: 'results' });
  KpiResult.belongsTo(Kpi, { foreignKey: 'kpi_id', as: 'kpi' });
};

setupAssociations();

// Sync database (development only)
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('✅ Database synced successfully');
  } catch (error) {
    console.error('❌ Database sync failed:', error);
  }
};

module.exports = {
  sequelize,
  Devisi,
  User,
  Kpi,
  KpiQuestion,
  KpiAssessment,
  KpiAnswer,
  KpiResult,
  syncDatabase,
};