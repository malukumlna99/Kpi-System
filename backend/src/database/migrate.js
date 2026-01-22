require('dotenv').config();
const { sequelize } = require('../config/database');
const logger = require('../utils/logger');

// Import all models to register them
const models = require('../models');

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    logger.info('Starting database migration');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    logger.info('Database connection established');

    // Sync all models
    // WARNING: { force: true } will DROP all tables! Use with caution!
    // For production, use { alter: true } instead
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (isDevelopment) {
      console.log('⚠️  Running in DEVELOPMENT mode');
      console.log('📋 Tables will be altered to match models');
      
      await sequelize.sync({ alter: true });
      console.log('✅ Database tables synchronized (alter mode)');
      logger.info('Database migrated successfully (alter mode)');
    } else {
      console.log('🔒 Running in PRODUCTION mode');
      console.log('📋 Only creating new tables (no drops)');
      
      await sequelize.sync({ force: false });
      console.log('✅ Database tables synchronized (safe mode)');
      logger.info('Database migrated successfully (safe mode)');
    }

    // Display migrated tables
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('\n📊 Migrated Tables:');
    tables.forEach((table, index) => {
      console.log(`   ${index + 1}. ${table}`);
    });

    console.log('\n🎉 Migration completed successfully!');
    console.log('💡 Next step: Run "npm run seed" to populate initial data\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    logger.error('Migration failed:', error);
    
    if (error.original) {
      console.error('\n📝 Database Error Details:');
      console.error(`   Code: ${error.original.code}`);
      console.error(`   Detail: ${error.original.detail || error.original.message}`);
    }

    console.log('\n💡 Troubleshooting:');
    console.log('   1. Check database connection in .env');
    console.log('   2. Ensure PostgreSQL/MySQL is running');
    console.log('   3. Verify database credentials');
    console.log('   4. Check if database exists\n');

    process.exit(1);
  }
};

// Handle unexpected errors
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  logger.error('Unhandled rejection during migration:', err);
  process.exit(1);
});

// Run migration
migrate();
