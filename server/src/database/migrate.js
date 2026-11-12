const fs = require('fs');
const path = require('path');
const { pool } = require('./pool');

async function runMigrations() {
  const client = await pool.connect();
  console.log('🚀 Starting TaskFlow database migrations...');

  try {
    // 1. Ensure migrations tracking table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // 2. Fetch already applied migrations
    const { rows: appliedRows } = await client.query(
      'SELECT name FROM schema_migrations ORDER BY id ASC'
    );
    const appliedSet = new Set(appliedRows.map((r) => r.name));

    // 3. Read migration files from directory
    const migrationsDir = path.join(__dirname, 'migrations');
    if (!fs.existsSync(migrationsDir)) {
      fs.mkdirSync(migrationsDir, { recursive: true });
    }
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.sql'))
      .sort();

    let appliedCount = 0;

    for (const file of files) {
      if (!appliedSet.has(file)) {
        console.log(`➡️  Applying migration: ${file}`);
        const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');

        await client.query('BEGIN');
        try {
          await client.query(sql);
          await client.query(
            'INSERT INTO schema_migrations (name) VALUES ($1)',
            [file]
          );
          await client.query('COMMIT');
          console.log(`✅ Applied migration: ${file}`);
          appliedCount++;
        } catch (migrationError) {
          await client.query('ROLLBACK');
          console.error(`❌ Migration failed on ${file}:`, migrationError.message);
          throw migrationError;
        }
      } else {
        console.log(`⏭️  Skipping already applied: ${file}`);
      }
    }

    console.log(`🎉 Migration complete! ${appliedCount} migration(s) applied.`);
  } catch (error) {
    console.error('💥 Migration runner encountered a fatal error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };

