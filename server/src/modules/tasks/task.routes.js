const express = require('express');
const taskController = require('./task.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  taskParamSchema,
  queryTasksSchema,
  createTaskSchema,
  updateTaskSchema,
  patchTaskSchema
} = require('./task.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/stats/summary', (req, res, next) => taskController.getTaskStats(req, res, next));

router.get(
  '/',
  validate(queryTasksSchema),
  (req, res, next) => taskController.getTasks(req, res, next)
);

router.post(
  '/',
  validate(createTaskSchema),
  (req, res, next) => taskController.createTask(req, res, next)
);

router.get(
  '/:id',
  validate(taskParamSchema),
  (req, res, next) => taskController.getTaskById(req, res, next)
);

router.put(
  '/:id',
  validate(updateTaskSchema),
  (req, res, next) => taskController.updateTask(req, res, next)
);

router.patch(
  '/:id',
  validate(patchTaskSchema),
  (req, res, next) => taskController.patchTask(req, res, next)
);

router.delete(
  '/:id',
  validate(taskParamSchema),
  (req, res, next) => taskController.deleteTask(req, res, next)
);

module.exports = router;

