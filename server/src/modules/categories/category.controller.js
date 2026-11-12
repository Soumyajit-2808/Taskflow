const categoryService = require('./category.service');
const { formatSuccessResponse } = require('../../utils/response');

class CategoryController {
  async getCategories(req, res, next) {
    try {
      const categories = await categoryService.getCategories(req.user.id);
      return res.status(200).json(formatSuccessResponse(categories));
    } catch (error) {
      next(error);
    }
  }

  async createCategory(req, res, next) {
    try {
      const category = await categoryService.createCategory(req.user.id, req.body);
      return res.status(201).json(formatSuccessResponse(category));
    } catch (error) {
      next(error);
    }
  }

  async updateCategory(req, res, next) {
    try {
      const category = await categoryService.updateCategory(
        req.user.id,
        req.params.id,
        req.body
      );
      return res.status(200).json(formatSuccessResponse(category));
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req, res, next) {
    try {
      const result = await categoryService.deleteCategory(req.user.id, req.params.id);
      return res.status(200).json(formatSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new CategoryController();

