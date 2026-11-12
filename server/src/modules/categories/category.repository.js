const { query } = require('../../database/pool');

class CategoryRepository {
  async findAllByUserId(userId) {
    const sql = `
      SELECT id, user_id, name, color, created_at
      FROM categories
      WHERE user_id = $1
      ORDER BY name ASC
    `;
    const { rows } = await query(sql, [userId]);
    return rows;
  }

  async findByIdAndUserId(id, userId) {
    const sql = `
      SELECT id, user_id, name, color, created_at
      FROM categories
      WHERE id = $1 AND user_id = $2
    `;
    const { rows } = await query(sql, [id, userId]);
    return rows[0] || null;
  }

  async findByNameAndUserId(name, userId) {
    const sql = `
      SELECT id, user_id, name, color, created_at
      FROM categories
      WHERE LOWER(name) = LOWER($1) AND user_id = $2
    `;
    const { rows } = await query(sql, [name, userId]);
    return rows[0] || null;
  }

  async createCategory({ userId, name, color }) {
    const sql = `
      INSERT INTO categories (user_id, name, color)
      VALUES ($1, $2, $3)
      RETURNING id, user_id, name, color, created_at
    `;
    const { rows } = await query(sql, [userId, name, color]);
    return rows[0];
  }

  async updateCategory(id, userId, { name, color }) {
    const updates = [];
    const values = [id, userId];

    if (name !== undefined) {
      values.push(name);
      updates.push(`name = $${values.length}`);
    }
    if (color !== undefined) {
      values.push(color);
      updates.push(`color = $${values.length}`);
    }

    const sql = `
      UPDATE categories
      SET ${updates.join(', ')}
      WHERE id = $1 AND user_id = $2
      RETURNING id, user_id, name, color, created_at
    `;
    const { rows } = await query(sql, values);
    return rows[0] || null;
  }

  async deleteCategory(id, userId) {
    const sql = `
      DELETE FROM categories
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
    const { rows } = await query(sql, [id, userId]);
    return rows[0] || null;
  }
}

module.exports = new CategoryRepository();

