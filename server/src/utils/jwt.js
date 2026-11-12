const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signToken(payload, expiresIn = env.JWT_EXPIRES_IN) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn });
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });
}

module.exports = {
  signToken,
  verifyToken
};

