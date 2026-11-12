const app = require('./app');
const env = require('./config/env');
const { closePool } = require('./database/pool');

const server = app.listen(env.PORT, () => {
  console.log(`🚀 TaskFlow REST API server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Graceful Shutdown Management
async function gracefulShutdown(signal) {
  console.log(`\n🛑 Received ${signal}. Starting graceful shutdown...`);

  server.close(async () => {
    console.log('🔒 HTTP server closed.');
    try {
      await closePool();
      console.log('📦 Database connections drained.');
      process.exit(0);
    } catch (err) {
      console.error('💥 Error closing database pool:', err);
      process.exit(1);
    }
  });

  // Force shutdown after 10s timeout
  setTimeout(() => {
    console.error('⚠️ Could not close connections in time, forcefully shutting down.');
    process.exit(1);
  }, 10000);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Promise Rejection:', reason);
  gracefulShutdown('unhandledRejection');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  gracefulShutdown('uncaughtException');
});

module.exports = server;

