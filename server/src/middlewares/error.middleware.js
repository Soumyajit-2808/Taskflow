const { AppError } = require('../utils/errors');
const { formatErrorResponse } = require('../utils/response');

function errorHandler(err, req, res, next) {
  // Operational AppError
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json(formatErrorResponse(err.code, err.message, err.details));
  }

  // PostgreSQL Unique Constraint Violation
  if (err.code === '23505') {
    return res
      .status(409)
      .json(
        formatErrorResponse(
          'RESOURCE_CONFLICT',
          'A record with this identifier or unique property already exists.',
          process.env.NODE_ENV !== 'production' ? err.detail : null
        )
      );
  }

  // PostgreSQL Foreign Key Violation
  if (err.code === '23503') {
    return res
      .status(400)
      .json(
        formatErrorResponse(
          'FOREIGN_KEY_VIOLATION',
          'The referenced entity does not exist.',
          process.env.NODE_ENV !== 'production' ? err.detail : null
        )
      );
  }

  // Generic Unexpected Server Errors
  console.error('Unhandled Application Error:', err);
  return res
    .status(500)
    .json(
      formatErrorResponse(
        'INTERNAL_SERVER_ERROR',
        'An unexpected internal server error occurred.'
      )
    );
}

module.exports = errorHandler;

