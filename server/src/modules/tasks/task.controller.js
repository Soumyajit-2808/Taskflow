const taskService = require('./task.service');
const { formatSuccessResponse } = require('../../utils/response');

class TaskController {
  async getTasks(req, res, next) {
    try {
      const result = await taskService.getTasks(req.user.id, req.query);
      return res.status(200).json(formatSuccessResponse(result.tasks, result.meta));
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req, res, next) {
    try {
      const task = await taskService.getTaskById(req.user.id, req.params.id);
      return res.status(200).json(formatSuccessResponse(task));
    } catch (error) {
      next(error);
    }
  }

  async createTask(req, res, next) {
    try {
      const task = await taskService.createTask(req.user.id, req.body);
      return res.status(201).json(formatSuccessResponse(task));
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req, res, next) {
    try {
      const task = await taskService.updateTask(req.user.id, req.params.id, req.body);
      return res.status(200).json(formatSuccessResponse(task));
    } catch (error) {
      next(error);
    }
  }

  async patchTask(req, res, next) {
    try {
      const task = await taskService.patchTask(req.user.id, req.params.id, req.body);
      return res.status(200).json(formatSuccessResponse(task));
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req, res, next) {
    try {
      const result = await taskService.deleteTask(req.user.id, req.params.id);
      return res.status(200).json(formatSuccessResponse(result));
    } catch (error) {
      next(error);
    }
  }

  async getTaskStats(req, res, next) {
    try {
      const stats = await taskService.getTaskStats(req.user.id);
      return res.status(200).json(formatSuccessResponse(stats));
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TaskController();

