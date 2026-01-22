const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validator');
const { createUserValidation, updateUserValidation } = require('./user.validation');

// All routes require authentication and manager role
router.use(authenticate, authorize('manager'));

// Get statistics
router.get('/statistics', userController.getStatistics);

// CRUD routes
router.get('/', userController.getAll);
router.get('/:id', userController.getById);
router.post('/', createUserValidation, validate, userController.create);
router.put('/:id', updateUserValidation, validate, userController.update);
router.delete('/:id', userController.deactivate);
router.patch('/:id/activate', userController.activate);

module.exports = router;
