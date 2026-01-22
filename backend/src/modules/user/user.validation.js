const { body } = require('express-validator');

const createUserValidation = [
  body('nama_lengkap')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nama lengkap harus 3-100 karakter')
    .escape(),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Format email tidak valid'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password minimal 8 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password harus mengandung huruf besar, kecil, dan angka'),
  body('role')
    .isIn(['manager', 'karyawan'])
    .withMessage('Role harus manager atau karyawan'),
  body('devisi_id')
    .isInt({ min: 1 })
    .withMessage('Devisi ID tidak valid'),
];

const updateUserValidation = [
  body('nama_lengkap')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Nama lengkap harus 3-100 karakter')
    .escape(),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Format email tidak valid'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password minimal 8 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password harus mengandung huruf besar, kecil, dan angka'),
  body('role')
    .optional()
    .isIn(['manager', 'karyawan'])
    .withMessage('Role harus manager atau karyawan'),
  body('devisi_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Devisi ID tidak valid'),
];

module.exports = {
  createUserValidation,
  updateUserValidation,
};
