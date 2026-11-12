const rateLimit = require('express-rate-limit');
const { formatErrorResponse } = require('../utils/response');

const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 15, // limit each IP to 15 requests per windowMs
  skip: () => process.env.NODE_ENV === 'test',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(
      formatErrorResponse(
        'TOO_MANY_REQUESTS',
        'Too many authentication attempts. Please try again after 15 minutes.'
      )
    );
  }
});

const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  skip: () => process.env.NODE_ENV === 'test',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json(
      formatErrorResponse(
        'TOO_MANY_REQUESTS',
        'Too many requests. Please slow down.'
      )
    );
  }
});

module.exports = {
  authRateLimiter,
  generalRateLimiter
};

