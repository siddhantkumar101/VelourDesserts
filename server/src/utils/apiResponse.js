/**
 * Standardised API response envelope.
 * All API responses follow this shape:
 * { success, message, data, errors, pagination }
 */

const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, pagination = null) => {
  const response = { success: true, message, data };
  if (pagination) response.pagination = pagination;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'An error occurred', errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
  });
};

module.exports = { sendSuccess, sendError };
