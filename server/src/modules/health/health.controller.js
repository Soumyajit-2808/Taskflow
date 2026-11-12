const { pool } = require('../../database/pool');
const { formatSuccessResponse } = require('../../utils/response');

async function checkHealth(req, res, next) {
  try {
    const dbStartTime = Date.now();
    await pool.query('SELECT 1');
    const dbLatencyMs = Date.now() - dbStartTime;

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        status: 'connected',
        latencyMs: dbLatencyMs
      }
    };

    return res.status(200).json(formatSuccessResponse(healthData));
  } catch (error) {
    return res.status(503).json({
      success: false,
      error: {
        code: 'SERVICE_UNAVAILABLE',
        message: 'Database health check failed',
        details: error.message
      }
    });
  }
}

module.exports = {
  checkHealth
};

