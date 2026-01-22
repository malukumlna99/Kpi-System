
const express = require('express');
const router = express.Router();
const devisiController = require('./devisi.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const { body } = require('express-validator');
const validate = require('../../middleware/validator');

const devisiValidation = [
  body('nama_devisi').trim().isLength({ min: 3, max: 100 }).escape(),
  body('deskripsi').optional().trim().escape(),
];

router.use(authenticate, authorize('manager'));

router.get('/', devisiController.getAll);
router.get('/:id', devisiController.getById);
router.post('/', devisiValidation, validate, devisiController.create);
router.put('/:id', devisiValidation, validate, devisiController.update);
router.delete('/:id', devisiController.delete);


module.exports = router;
