const { z } = require('zod');

const categoryParamSchema = {
  params: z.object({
    id: z.string().uuid('Invalid category ID format')
  })
};

const createCategorySchema = {
  body: z.object({
    name: z
      .string({ required_error: 'Category name is required' })
      .min(1, 'Category name cannot be empty')
      .max(50, 'Category name cannot exceed 50 characters')
      .trim(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid 6-character hex code (e.g. #6366f1)')
      .default('#6366f1')
  })
};

const updateCategorySchema = {
  params: z.object({
    id: z.string().uuid('Invalid category ID format')
  }),
  body: z.object({
    name: z
      .string()
      .min(1, 'Category name cannot be empty')
      .max(50, 'Category name cannot exceed 50 characters')
      .trim()
      .optional(),
    color: z
      .string()
      .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid 6-character hex code (e.g. #6366f1)')
      .optional()
  }).refine((data) => data.name !== undefined || data.color !== undefined, {
    message: 'At least one field (name or color) must be provided for update'
  })
};

module.exports = {
  categoryParamSchema,
  createCategorySchema,
  updateCategorySchema
};

