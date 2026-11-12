const express = require('express');
const categoryController = require('./category.controller');
const authMiddleware = require('../../middlewares/auth.middleware');
const validate = require('../../middlewares/validate.middleware');
const {
  categoryParamSchema,
  createCategorySchema,
  updateCategorySchema
} = require('./category.validation');

const router = express.Router();

router.use(authMiddleware);

router.get('/', (req, res, next) => categoryController.getCategories(req, res, next));

router.post(
  '/',
  validate(createCategorySchema),
  (req, res, next) => categoryController.createCategory(req, res, next)
);

router.put(
  '/:id',
  validate(updateCategorySchema),
  (req, res, next) => categoryController.updateCategory(req, res, next)
);

router.delete(
  '/:id',
  validate(categoryParamSchema),
  (req, res, next) => categoryController.deleteCategory(req, res, next)
);

module.exports = router;

