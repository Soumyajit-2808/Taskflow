const { query } = require('../../database/pool');

class TaskRepository {
  async findTasks(userId, { status, priority, categoryId, search, sortBy, order, offset, limit }) {
    const conditions = ['t.user_id = $1', 't.deleted_at IS NULL'];
    const params = [userId];

    if (status) {
      const statuses = Array.isArray(status) ? status : status.split(',').map((s) => s.trim());
      params.push(statuses);
      conditions.push(`t.status = ANY($${params.length})`);
    }

    if (priority) {
      params.push(priority);
      conditions.push(`t.priority = $${params.length}`);
    }

    if (categoryId) {
      params.push(categoryId);
      conditions.push(`t.category_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(t.title ILIKE $${params.length} OR t.description ILIKE $${params.length})`);
    }

    const sortColumns = {
      createdAt: 't.created_at',
      dueDate: 't.due_date',
      priority: 't.priority',
      title: 't.title'
    };

    const sortColumn = sortColumns[sortBy] || 't.created_at';
    const sortDirection = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    params.push(limit);
    const limitPlaceholder = `$${params.length}`;
    params.push(offset);
    const offsetPlaceholder = `$${params.length}`;

    const sql = `
      SELECT 
        t.id, t.user_id, t.category_id, t.title, t.description, t.status, 
        t.priority, t.due_date, t.completed_at, t.created_at, t.updated_at,
        c.name AS category_name, c.color AS category_color
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY ${sortColumn} ${sortDirection} NULLS LAST
      LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}
    `;

    const { rows } = await query(sql, params);
    return rows;
  }

  async countTasks(userId, { status, priority, categoryId, search }) {
    const conditions = ['t.user_id = $1', 't.deleted_at IS NULL'];
    const params = [userId];

    if (status) {
      const statuses = Array.isArray(status) ? status : status.split(',').map((s) => s.trim());
      params.push(statuses);
      conditions.push(`t.status = ANY($${params.length})`);
    }

    if (priority) {
      params.push(priority);
      conditions.push(`t.priority = $${params.length}`);
    }

    if (categoryId) {
      params.push(categoryId);
      conditions.push(`t.category_id = $${params.length}`);
    }

    if (search) {
      params.push(`%${search}%`);
      conditions.push(`(t.title ILIKE $${params.length} OR t.description ILIKE $${params.length})`);
    }

    const sql = `
      SELECT COUNT(*)::int AS total
      FROM tasks t
      WHERE ${conditions.join(' AND ')}
    `;

    const { rows } = await query(sql, params);
    return rows[0].total;
  }

  async findByIdAndUserId(id, userId) {
    const sql = `
      SELECT 
        t.id, t.user_id, t.category_id, t.title, t.description, t.status, 
        t.priority, t.due_date, t.completed_at, t.created_at, t.updated_at, t.deleted_at,
        c.name AS category_name, c.color AS category_color
      FROM tasks t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.id = $1 AND t.user_id = $2 AND t.deleted_at IS NULL
    `;
    const { rows } = await query(sql, [id, userId]);
    return rows[0] || null;
  }

  async createTask({ userId, title, description, categoryId, priority, status, dueDate }) {
    const completedAt = status === 'completed' ? new Date().toISOString() : null;
    const sql = `
      INSERT INTO tasks (user_id, title, description, category_id, priority, status, due_date, completed_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, user_id, category_id, title, description, status, priority, due_date, completed_at, created_at, updated_at
    `;
    const { rows } = await query(sql, [
      userId,
      title,
      description || null,
      categoryId || null,
      priority,
      status,
      dueDate || null,
      completedAt
    ]);
    return rows[0];
  }

  async updateTask(id, userId, fields) {
    const updates = ['updated_at = NOW()'];
    const params = [id, userId];

    const allowed = ['title', 'description', 'category_id', 'priority', 'status', 'due_date', 'completed_at'];

    for (const key of allowed) {
      if (fields[key] !== undefined) {
        params.push(fields[key]);
        updates.push(`${key} = $${params.length}`);
      }
    }

    const sql = `
      UPDATE tasks
      SET ${updates.join(', ')}
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING id, user_id, category_id, title, description, status, priority, due_date, completed_at, created_at, updated_at
    `;

    const { rows } = await query(sql, params);
    return rows[0] || null;
  }

  async softDeleteTask(id, userId) {
    const sql = `
      UPDATE tasks
      SET deleted_at = NOW(), updated_at = NOW()
      WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL
      RETURNING id
    `;
    const { rows } = await query(sql, [id, userId]);
    return rows[0] || null;
  }

  async getTaskStats(userId) {
    const sql = `
      SELECT
        COUNT(*)::int AS total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END)::int AS pending,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END)::int AS in_progress,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::int AS completed,
        COUNT(CASE WHEN status = 'archived' THEN 1 END)::int AS archived,
        COUNT(CASE WHEN due_date < NOW() AND status NOT IN ('completed', 'archived') THEN 1 END)::int AS overdue,
        COUNT(CASE WHEN due_date::date = CURRENT_DATE AND status NOT IN ('completed', 'archived') THEN 1 END)::int AS due_today,
        COUNT(CASE WHEN due_date >= CURRENT_DATE AND due_date <= CURRENT_DATE + INTERVAL '7 days' AND status NOT IN ('completed', 'archived') THEN 1 END)::int AS due_this_week
      FROM tasks
      WHERE user_id = $1 AND deleted_at IS NULL
    `;
    const { rows } = await query(sql, [userId]);
    return rows[0];
  }
}

module.exports = new TaskRepository();

