const authService = require('./auth.service');
const { formatSuccessResponse } = require('../../utils/response');
const env = require('../../config/env');

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.body);
      res.cookie('token', result.token, COOKIE_OPTIONS);
      return res.status(201).json(formatSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.body);
      res.cookie('token', result.token, COOKIE_OPTIONS);
      return res.status(200).json(formatSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    try {
      const user = await authService.getMe(req.user.id);
      return res.status(200).json(formatSuccessResponse(user));
    } catch (error) {
      next(error);
    }
  }

  async logout(req, res) {
    const { maxAge, ...clearOptions } = COOKIE_OPTIONS;
    res.clearCookie('token', clearOptions);
    return res.status(200).json(formatSuccessResponse({ message: 'Logged out successfully' }));
  }
}

module.exports = new AuthController();

