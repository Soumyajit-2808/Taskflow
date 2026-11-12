const categoryRepository = require('./category.repository');
const { ConflictError, NotFoundError } = require('../../utils/errors');

class CategoryService {
  constructor(repo = categoryRepository) {
    this.repo = repo;
  }

  async getCategories(userId) {
    return this.repo.findAllByUserId(userId);
  }

  async createCategory(userId, { name, color }) {
    const existing = await this.repo.findByNameAndUserId(name, userId);
    if (existing) {
      throw new ConflictError(`Category '${name}' already exists.`);
    }

    return this.repo.createCategory({ userId, name, color });
  }

  async updateCategory(userId, id, { name, color }) {
    const category = await this.repo.findByIdAndUserId(id, userId);
    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (name && name.toLowerCase() !== category.name.toLowerCase()) {
      const duplicate = await this.repo.findByNameAndUserId(name, userId);
      if (duplicate) {
        throw new ConflictError(`Category '${name}' already exists.`);
      }
    }

    return this.repo.updateCategory(id, userId, { name, color });
  }

  async deleteCategory(userId, id) {
    const deleted = await this.repo.deleteCategory(id, userId);
    if (!deleted) {
      throw new NotFoundError('Category not found');
    }
    return { id: deleted.id };
  }
}

module.exports = new CategoryService();

