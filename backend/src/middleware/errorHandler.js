const logger = require('../utils/logger');

// Global Error Handler
const errorHandler = (err, req, res, next) => {
  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    user: req.user?.userId,
  });

  // Default error
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    statusCode = 422;
    message = 'Validasi data gagal';
    const errors = {};
    err.errors.forEach(e => {
      errors[e.path] = [e.message];
    });
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    message = 'Data sudah ada di sistem';
    const errors = {};
    err.errors.forEach(e => {
      errors[e.path] = [`${e.path} sudah terdaftar`];
    });
    return res.status(statusCode).json({
      success: false,
      message,
      errors,
    });
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400;
    message = 'Data terkait tidak ditemukan atau masih digunakan';
  }

  // JWT errors are already handled in auth middleware
  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(statusCode).json({
      success: false,
      message: statusCode === 500 ? 'Terjadi kesalahan pada server' : message,
    });
  }

  // Development: show detailed error
  return res.status(statusCode).json({
    success: false,
    message,
    stack: err.stack,
  });
};

// 404 Not Found Handler
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint tidak ditemukan',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};