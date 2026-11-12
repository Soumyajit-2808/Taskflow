const dotenv = require('dotenv');
const path = require('path');

// Support loading .env from server directory or root directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',

  // Database Connection
  DATABASE_URL: process.env.DATABASE_URL || null,
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT, 10) || 5432,
  DB_NAME: process.env.DB_NAME || 'taskflow_db',
  DB_USER: process.env.DB_USER || 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
  DB_POOL_MAX: parseInt(process.env.DB_POOL_MAX, 10) || 20,
  DB_IDLE_TIMEOUT_MILLIS: parseInt(process.env.DB_IDLE_TIMEOUT_MILLIS, 10) || 30000,

  // JWT & Security
  JWT_SECRET: process.env.JWT_SECRET || 'dev_fallback_secret_taskflow_secure_key_1234',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_SALT_ROUNDS: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12
};

if (env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.includes('dev_fallback'))) {
  throw new Error('FATAL: A secure JWT_SECRET environment variable must be provided in production mode.');
}

module.exports = env;

