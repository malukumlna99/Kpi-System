// ============= assessment.routes.js =============
const express = require('express');
const router = express.Router();
const assessmentController = require('./assessment.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { body } = require('express-validator');
const validate = require('../../middleware/validator');

const submitValidation = [
  body('kpi_id').isInt({ min: 1 }).withMessage('KPI ID tidak valid'),
  body('tanggal_pengisian').optional().isDate().withMessage('Format tanggal tidak valid'),
  body('answers').isArray({ min: 1 }).withMessage('Answers wajib diisi'),
  body('answers.*.question_id').isInt({ min: 1 }).withMessage('Question ID tidak valid'),
  body('answers.*.nilai_jawaban').optional().isFloat({ min: 0 }).withMessage('Nilai jawaban harus angka'),
  body('catatan_karyawan').optional().trim(),
];

const reviewValidation = [
  body('catatan_manager').notEmpty().trim().withMessage('Catatan manager wajib diisi'),
];

// All routes require authentication
router.use(authenticate);

// Karyawan routes
router.post('/submit', submitValidation, validate, assessmentController.submit);
router.post('/draft', assessmentController.saveDraft);
router.get('/my-history', assessmentController.getMyHistory);
router.get('/:id', assessmentController.getDetail);

// Manager routes
router.post('/:id/review', authorize('manager'), reviewValidation, validate, assessmentController.review);

module.exports = router;