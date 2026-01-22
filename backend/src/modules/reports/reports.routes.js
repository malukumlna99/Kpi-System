const express = require('express');
const router = express.Router();
const reportsController = require('./reports.controller');
const { authenticate, authorize } = require('../../middleware/auth');

// All routes require authentication and manager role
router.use(authenticate, authorize('manager'));

// Dashboard summary
router.get('/dashboard', reportsController.getDashboard);

// Employee performance reports
router.get('/employees', reportsController.getEmployees);
router.get('/employees/:id', reportsController.getEmployeeDetail);

// KPI statistics
router.get('/kpi/:id/statistics', reportsController.getKpiStatistics);

module.exports = router;
