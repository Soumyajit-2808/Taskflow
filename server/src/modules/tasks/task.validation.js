const { z } = require('zod');

const taskStatusEnum = z.enum(['pending', 'in_progress', 'completed', 'archived']);
const taskPriorityEnum = z.enum(['low', 'medium', 'high', 'urgent']);

const taskParamSchema = {
  params: z.object({
    id: z.string().uuid('Invalid task ID format')
  })
};

const queryTasksSchema = {
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    status: z.union([taskStatusEnum, z.string()]).optional(),
    priority: taskPriorityEnum.optional(),
    categoryId: z.string().uuid().optional(),
    search: z.string().max(100).optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'title']).default('createdAt'),
    order: z.enum(['asc', 'desc', 'ASC', 'DESC']).default('desc')
  })
};

const createTaskSchema = {
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title cannot exceed 200 characters')
      .trim(),
    description: z.string().max(2000, 'Description cannot exceed 2000 characters').optional().nullable(),
    categoryId: z.string().uuid('Invalid category ID').optional().nullable(),
    priority: taskPriorityEnum.default('medium'),
    status: taskStatusEnum.default('pending'),
    dueDate: z.string().datetime({ offset: true }).optional().nullable()
  })
};

const updateTaskSchema = {
  params: z.object({
    id: z.string().uuid('Invalid task ID format')
  }),
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(1, 'Title cannot be empty')
      .max(200, 'Title cannot exceed 200 characters')
      .trim(),
    description: z.string().max(2000).optional().nullable(),
    categoryId: z.string().uuid().optional().nullable(),
    priority: taskPriorityEnum,
    status: taskStatusEnum,
    dueDate: z.string().datetime({ offset: true }).optional().nullable()
  })
};

const patchTaskSchema = {
  params: z.object({
    id: z.string().uuid('Invalid task ID format')
  }),
  body: z.object({
    title: z.string().min(1).max(200).trim().optional(),
    description: z.string().max(2000).optional().nullable(),
    categoryId: z.string().uuid().optional().nullable(),
    priority: taskPriorityEnum.optional(),
    status: taskStatusEnum.optional(),
    dueDate: z.string().datetime({ offset: true }).optional().nullable()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for partial update'
  })
};

module.exports = {
  taskParamSchema,
  queryTasksSchema,
  createTaskSchema,
  updateTaskSchema,
  patchTaskSchema
};

