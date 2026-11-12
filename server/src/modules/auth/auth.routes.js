const express = require('express');
const authController = require('./auth.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const { authRateLimiter } = require('../../middlewares/rateLimiter.middleware');
const { registerSchema, loginSchema } = require('./auth.validation');

const router = express.Router();

router.post(
  '/register',
  authRateLimiter,
  validate(registerSchema),
  (req, res, next) => authController.register(req, res, next)
);

router.post(
  '/login',
  authRateLimiter,
  validate(loginSchema),
  (req, res, next) => authController.login(req, res, next)
);

router.get(
  '/me',
  authMiddleware,
  (req, res, next) => authController.getMe(req, res, next)
);

router.post(
  '/logout',
  (req, res) => authController.logout(req, res)
);

module.exports = router;

