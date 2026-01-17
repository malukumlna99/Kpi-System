const { body } = require('express-validator');

const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Format email tidak valid'),
  body('password')
    .notEmpty()
    .withMessage('Password wajib diisi'),
];

const registerValidation = [
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
    .optional()
    .isIn(['manager', 'karyawan'])
    .withMessage('Role harus manager atau karyawan'),
  body('devisi_id')
    .isInt({ min: 1 })
    .withMessage('Devisi ID tidak valid'),
];

const changePasswordValidation = [
  body('old_password')
    .notEmpty()
    .withMessage('Password lama wajib diisi'),
  body('new_password')
    .isLength({ min: 8 })
    .withMessage('Password baru minimal 8 karakter')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password harus mengandung huruf besar, kecil, dan angka'),
  body('confirm_password')
    .notEmpty()
    .withMessage('Konfirmasi password wajib diisi')
    .custom((value, { req }) => value === req.body.new_password)
    .withMessage('Konfirmasi password tidak cocok'),
];

module.exports = {
  loginValidation,
  registerValidation,
  changePasswordValidation,
};