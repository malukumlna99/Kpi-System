/**
 * Success response helper
 */
const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Success response with pagination
 */
const successResponseWithPagination = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    },
  });
};

/**
 * Error response helper
 */
const errorResponse = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Calculate grade from score (0-100)
 */
const calculateGrade = (score) => {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 85) return 'B+';
  if (score >= 80) return 'B';
  if (score >= 75) return 'C+';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'E';
};

/**
 * Format periode string (YYYY-MM, YYYY-Q1, YYYY)
 */
const formatPeriode = (date, periodeType) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  switch (periodeType) {
    case 'monthly':
      return `${year}-${month.toString().padStart(2, '0')}`;
    case 'quarterly':
      const quarter = Math.ceil(month / 3);
      return `${year}-Q${quarter}`;
    case 'yearly':
      return `${year}`;
    default:
      return `${year}-${month.toString().padStart(2, '0')}`;
  }
};

/**
 * Parse periode string to date range
 */
const parsePeriode = (periodeStr) => {
  const parts = periodeStr.split('-');
  const year = parseInt(parts[0]);

  if (parts.length === 1) {
    // Yearly: 2024
    return {
      start: new Date(year, 0, 1),
      end: new Date(year, 11, 31, 23, 59, 59),
    };
  }

  if (parts[1].startsWith('Q')) {
    // Quarterly: 2024-Q1
    const quarter = parseInt(parts[1].substring(1));
    const startMonth = (quarter - 1) * 3;
    const endMonth = startMonth + 2;
    return {
      start: new Date(year, startMonth, 1),
      end: new Date(year, endMonth + 1, 0, 23, 59, 59),
    };
  }

  // Monthly: 2024-01
  const month = parseInt(parts[1]) - 1;
  return {
    start: new Date(year, month, 1),
    end: new Date(year, month + 1, 0, 23, 59, 59),
  };
};

module.exports = {
  successResponse,
  successResponseWithPagination,
  errorResponse,
  calculateGrade,
  formatPeriode,
  parsePeriode,
};
