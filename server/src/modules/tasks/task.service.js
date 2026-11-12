const taskRepository = require('./task.repository');
const categoryRepository = require('../categories/category.repository');
const { NotFoundError, BadRequestError } = require('../../utils/errors');

class TaskService {
  constructor(repo = taskRepository, catRepo = categoryRepository) {
    this.repo = repo;
    this.catRepo = catRepo;
  }

  formatTaskResponse(task) {
    if (!task) return null;
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      dueDate: task.due_date,
      completedAt: task.completed_at,
      createdAt: task.created_at,
      updatedAt: task.updated_at,
      category: task.category_id
        ? {
            id: task.category_id,
            name: task.category_name,
            color: task.category_color
          }
        : null
    };
  }

  async getTasks(userId, queryOptions) {
    const { page, limit, status, priority, categoryId, search, sortBy, order } = queryOptions;
    const offset = (page - 1) * limit;

    const [rawTasks, total] = await Promise.all([
      this.repo.findTasks(userId, { status, priority, categoryId, search, sortBy, order, offset, limit }),
      this.repo.countTasks(userId, { status, priority, categoryId, search })
    ]);

    const tasks = rawTasks.map((t) => this.formatTaskResponse(t));
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      tasks,
      meta: {
        page,
        limit,
        total,
        totalPages
      }
    };
  }

  async getTaskById(userId, id) {
    const task = await this.repo.findByIdAndUserId(id, userId);
    if (!task) {
      throw new NotFoundError(`Task with ID ${id} was not found.`);
    }
    return this.formatTaskResponse(task);
  }

  async createTask(userId, taskData) {
    if (taskData.categoryId) {
      const category = await this.catRepo.findByIdAndUserId(taskData.categoryId, userId);
      if (!category) {
        throw new BadRequestError('Specified category does not exist or does not belong to you.');
      }
    }

    const created = await this.repo.createTask({
      userId,
      title: taskData.title,
      description: taskData.description,
      categoryId: taskData.categoryId,
      priority: taskData.priority,
      status: taskData.status,
      dueDate: taskData.dueDate
    });

    return this.getTaskById(userId, created.id);
  }

  async updateTask(userId, id, taskData) {
    const existing = await this.repo.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError(`Task with ID ${id} was not found.`);
    }

    if (taskData.categoryId) {
      const category = await this.catRepo.findByIdAndUserId(taskData.categoryId, userId);
      if (!category) {
        throw new BadRequestError('Specified category does not exist or does not belong to you.');
      }
    }

    const fields = {
      title: taskData.title,
      description: taskData.description,
      category_id: taskData.categoryId,
      priority: taskData.priority,
      status: taskData.status,
      due_date: taskData.dueDate
    };

    if (taskData.status === 'completed' && existing.status !== 'completed') {
      fields.completed_at = new Date().toISOString();
    } else if (taskData.status && taskData.status !== 'completed') {
      fields.completed_at = null;
    }

    await this.repo.updateTask(id, userId, fields);
    return this.getTaskById(userId, id);
  }

  async patchTask(userId, id, patchData) {
    const existing = await this.repo.findByIdAndUserId(id, userId);
    if (!existing) {
      throw new NotFoundError(`Task with ID ${id} was not found.`);
    }

    if (patchData.categoryId) {
      const category = await this.catRepo.findByIdAndUserId(patchData.categoryId, userId);
      if (!category) {
        throw new BadRequestError('Specified category does not exist or does not belong to you.');
      }
    }

    const fields = {};
    if (patchData.title !== undefined) fields.title = patchData.title;
    if (patchData.description !== undefined) fields.description = patchData.description;
    if (patchData.categoryId !== undefined) fields.category_id = patchData.categoryId;
    if (patchData.priority !== undefined) fields.priority = patchData.priority;
    if (patchData.dueDate !== undefined) fields.due_date = patchData.dueDate;

    if (patchData.status !== undefined) {
      fields.status = patchData.status;
      if (patchData.status === 'completed' && existing.status !== 'completed') {
        fields.completed_at = new Date().toISOString();
      } else if (patchData.status !== 'completed') {
        fields.completed_at = null;
      }
    }

    await this.repo.updateTask(id, userId, fields);
    return this.getTaskById(userId, id);
  }

  async deleteTask(userId, id) {
    const deleted = await this.repo.softDeleteTask(id, userId);
    if (!deleted) {
      throw new NotFoundError(`Task with ID ${id} was not found.`);
    }
    return { id: deleted.id };
  }

  async getTaskStats(userId) {
    return this.repo.getTaskStats(userId);
  }
}

module.exports = new TaskService();

