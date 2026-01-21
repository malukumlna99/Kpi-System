const { validationResult } = require('express-validator');

/**
 * Middleware to handle validation results
 * Use after express-validator validation chains
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = {};
    
    errors.array().forEach(error => {
      if (!formattedErrors[error.path]) {
        formattedErrors[error.path] = [];
      }
      formattedErrors[error.path].push(error.msg);
    });

    return res.status(422).json({
      success: false,
      message: 'Validasi gagal',
      errors: formattedErrors,
    });
  }
  
  next();
};

module.exports = validate;
