const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const env = require('./config/env');
const errorHandler = require('./middlewares/error.middleware');
const { generalRateLimiter } = require('./middlewares/rateLimiter.middleware');
const { NotFoundError } = require('./utils/errors');

// Routes
const healthRoutes = require('./modules/health/health.routes');
const authRoutes = require('./modules/auth/auth.routes');
const categoryRoutes = require('./modules/categories/category.routes');
const taskRoutes = require('./modules/tasks/task.routes');

const app = express();

// Security Headers & Policy
app.use(helmet());

// CORS Configuration
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Rate Limiting
app.use(generalRateLimiter);

// Body and Cookie Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Root Welcome Route
app.get('/', (req, res) => {
  res.status(200).json({
    name: 'TaskFlow REST API',
    version: '1.0.0',
    status: 'running',
    message: 'TaskFlow REST API is operational. Visit http://localhost:5173 for the web application.',
    endpoints: {
      health: '/api/v1/health',
      auth: '/api/v1/auth',
      categories: '/api/v1/categories',
      tasks: '/api/v1/tasks'
    }
  });
});

// API Endpoints
const API_PREFIX = '/api/v1';
app.use(API_PREFIX, healthRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/tasks`, taskRoutes);

// 404 Fallback
app.use((req, res, next) => {
  next(new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`));
});

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;

