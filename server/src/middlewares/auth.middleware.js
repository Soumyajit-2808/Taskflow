const { verifyToken } = require('../utils/jwt');
const { UnauthorizedError } = require('../utils/errors');

async function authMiddleware(req, res, next) {
  try {
    let token = null;

    // 1. Check Authorization header (Bearer <token>)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback to HTTP-only cookie if header is not present
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new UnauthorizedError('Authentication token is required');
    }

    const decoded = await verifyToken(token);
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(new UnauthorizedError('Authentication token has expired'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Invalid authentication token'));
    }
    next(error);
  }
}

module.exports = authMiddleware;

