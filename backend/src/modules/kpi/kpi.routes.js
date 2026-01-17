// ============= kpi.routes.js =============
const express = require('express');
const router = express.Router();
const kpiController = require('./kpi.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { body } = require('express-validator');
const validate = require('../../middleware/validator');

const kpiValidation = [
  body('devisi_id').isInt({ min: 1 }).withMessage('Devisi ID tidak valid'),
  body('nama_kpi').trim().isLength({ min: 5, max: 200 }).withMessage('Nama KPI harus 5-200 karakter'),
  body('deskripsi').optional().trim(),
  body('periode').isIn(['monthly', 'quarterly', 'yearly']).withMessage('Periode tidak valid'),
  body('bobot').isInt({ min: 1, max: 100 }).withMessage('Bobot harus 1-100'),
  body('questions').optional().isArray().withMessage('Questions harus array'),
  body('questions.*.pertanyaan').notEmpty().withMessage('Pertanyaan wajib diisi'),
  body('questions.*.tipe_jawaban')
    .isIn(['numeric_1_5', 'numeric_0_100', 'text'])
    .withMessage('Tipe jawaban tidak valid'),
  body('questions.*.bobot_soal').isInt({ min: 1, max: 100 }).withMessage('Bobot soal harus 1-100'),
];

// Public authenticated routes
router.use(authenticate);

// Karyawan routes
router.get('/my-kpis', kpiController.getMyKpis);

// Manager only routes
router.get('/', authorize('manager'), kpiController.getAll);
router.get('/:id', authorize('manager'), kpiController.getById);
router.post('/', authorize('manager'), kpiValidation, validate, kpiController.create);
router.put('/:id', authorize('manager'), kpiValidation, validate, kpiController.update);
router.delete('/:id', authorize('manager'), kpiController.delete);

module.exports = router;