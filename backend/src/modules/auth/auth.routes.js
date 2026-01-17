const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const { authenticate, authorize } = require('../../middleware/auth');
const validate = require('../../middleware/validator');
const {
  loginValidation,
  registerValidation,
  changePasswordValidation,
} = require('./auth.validation');

// Public routes
router.post('/login', loginValidation, validate, authController.login);
router.post('/refresh', authController.refreshToken);

// Protected routes
router.get('/me', authenticate, authController.getCurrentUser);
router.post('/logout', authenticate, authController.logout);
router.post(
  '/change-password',
  authenticate,
  changePasswordValidation,
  validate,
  authController.changePassword
);

// Manager only
router.post(
  '/register',
  authenticate,
  authorize('manager'),
  registerValidation,
  validate,
  authController.register
);

module.exports = router;