const { query } = require('../../database/pool');

class AuthRepository {
  async findByEmail(email) {
    const sql = `
      SELECT id, email, password_hash, full_name, avatar_url, created_at, updated_at
      FROM users
      WHERE email = $1
    `;
    const { rows } = await query(sql, [email]);
    return rows[0] || null;
  }

  async findById(id) {
    const sql = `
      SELECT id, email, full_name, avatar_url, created_at, updated_at
      FROM users
      WHERE id = $1
    `;
    const { rows } = await query(sql, [id]);
    return rows[0] || null;
  }

  async createUser({ email, passwordHash, fullName, avatarUrl = null }) {
    const sql = `
      INSERT INTO users (email, password_hash, full_name, avatar_url)
      VALUES ($1, $2, $3, $4)
      RETURNING id, email, full_name, avatar_url, created_at, updated_at
    `;
    const { rows } = await query(sql, [email, passwordHash, fullName, avatarUrl]);
    return rows[0];
  }
}

module.exports = new AuthRepository();

