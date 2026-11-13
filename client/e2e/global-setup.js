import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { Client } = require('../../server/node_modules/pg');
const env = require('../../server/src/config/env');

export default async function globalSetup() {
  const targetDb = 'taskflow_test_db';

  console.log(`\n🧹 [globalSetup] Initiating automated database reset on '${targetDb}'...`);

  const client = new Client({
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: targetDb
  });

  try {
    await client.connect();

    // 1. Verify active database identity before any destructive operations
    const dbRes = await client.query('SELECT current_database()');
    const activeDb = dbRes.rows[0]?.current_database;

    if (activeDb !== targetDb) {
      throw new Error(
        `[CRITICAL SAFETY ABORT] Database verification failed! Active database is '${activeDb}', expected '${targetDb}'. Halting execution.`
      );
    }

    // 2. Additional safety check against known protected databases
    const protectedDbs = ['taskflow_db', 'postgres', 'production', 'development'];
    if (protectedDbs.includes(activeDb.toLowerCase())) {
      throw new Error(
        `[CRITICAL SAFETY ABORT] Target matches protected database '${activeDb}'. Halting execution.`
      );
    }

    // 3. Execute narrowly scoped reset with RESTRICT (schema_migrations is preserved)
    await client.query('TRUNCATE TABLE tasks, categories, users RESTART IDENTITY RESTRICT');
    console.log(`✅ [globalSetup] Successfully reset tables (tasks, categories, users) in '${targetDb}'.\n`);
  } catch (err) {
    console.error(`💥 [globalSetup] Failed to reset test database:`, err.message);
    throw err;
  } finally {
    // 4. Reliable connection closure
    await client.end().catch((closeErr) => {
      console.error('Error closing database connection in globalSetup:', closeErr);
    });
  }
}
