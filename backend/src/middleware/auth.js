const jwt = require('jsonwebtoken');
const { User } = require('../models');
const authConfig = require('../config/auth');

// Authenticate JWT Token
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Token tidak ditemukan. Silakan login terlebih dahulu.',
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify token
    const decoded = jwt.verify(token, authConfig.jwt.secret);

    // Check if user still exists
    const user = await User.findByPk(decoded.userId, {
      attributes: ['id', 'email', 'role', 'devisi_id', 'is_active'],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User tidak ditemukan atau sudah dihapus.',
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Akun Anda telah dinonaktifkan.',
      });
    }

    // Attach user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      devisiId: user.devisi_id,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token sudah kadaluarsa. Silakan login kembali.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token tidak valid.',
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan saat verifikasi token.',
    });
  }
};

// Authorize based on roles
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Silakan login terlebih dahulu.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Akses ditolak. Anda tidak memiliki hak akses untuk resource ini.',
      });
    }

    next();
  };
};

// Check if user can access specific resource
const checkResourceOwnership = (resourceUserIdField = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = parseInt(req.params[resourceUserIdField] || req.body[resourceUserIdField]);
    const currentUserId = req.user.userId;
    const currentUserRole = req.user.role;

    // Manager can access all resources
    if (currentUserRole === 'manager') {
      return next();
    }

    // Karyawan can only access their own resources
    if (currentUserRole === 'karyawan' && currentUserId === resourceUserId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Anda tidak memiliki akses ke resource ini.',
    });
  };
};

module.exports = {
  authenticate,
  authorize,
  checkResourceOwnership,
};