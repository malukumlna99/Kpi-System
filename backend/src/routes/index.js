const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('../modules/auth/auth.routes');
const devisiRoutes = require('../modules/devisi/devisi.routes');
const kpiRoutes = require('../modules/kpi/kpi.routes');
const assessmentRoutes = require('../modules/assessment/assessment.routes');
const userRoutes = require('../modules/user/user.routes');
const reportsRoutes = require('../modules/reports/reports.routes');

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Register routes
router.use('/auth', authRoutes);
router.use('/devisi', devisiRoutes);
router.use('/kpi', kpiRoutes);
router.use('/assessments', assessmentRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportsRoutes);

// API documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'KPI Management System API v1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/auth',
      devisi: '/devisi',
      kpi: '/kpi',
      assessments: '/assessments',
      users: '/users',
      reports: '/reports',
    },
    documentation: 'https://github.com/your-repo/docs',
  });
});

module.exports = router;
