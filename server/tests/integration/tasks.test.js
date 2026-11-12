const request = require('supertest');
const app = require('../../src/app');
const taskRepository = require('../../src/modules/tasks/task.repository');
const categoryRepository = require('../../src/modules/categories/category.repository');
const { signToken } = require('../../src/utils/jwt');

describe('Task Endpoints (Integration)', () => {
  const userId = '123e4567-e89b-12d3-a456-426614174000';
  const taskId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';
  const validToken = signToken({ id: userId, email: 'dev@example.com' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/tasks/stats/summary', () => {
    it('should return metrics summary', async () => {
      jest.spyOn(taskRepository, 'getTaskStats').mockResolvedValue({
        total: 5,
        pending: 2,
        in_progress: 2,
        completed: 1,
        archived: 0,
        overdue: 0,
        due_today: 1,
        due_this_week: 3
      });

      const res = await request(app)
        .get('/api/v1/tasks/stats/summary')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(5);
    });
  });

  describe('GET /api/v1/tasks', () => {
    it('should list tasks with pagination meta', async () => {
      jest.spyOn(taskRepository, 'findTasks').mockResolvedValue([
        {
          id: taskId,
          title: 'Implement unit tests',
          description: null,
          status: 'pending',
          priority: 'medium',
          due_date: null,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category_id: null
        }
      ]);
      jest.spyOn(taskRepository, 'countTasks').mockResolvedValue(1);

      const res = await request(app)
        .get('/api/v1/tasks?page=1&limit=10')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.total).toBe(1);
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create task and return 201', async () => {
      jest.spyOn(taskRepository, 'createTask').mockResolvedValue({ id: taskId });
      jest.spyOn(taskRepository, 'findByIdAndUserId').mockResolvedValue({
        id: taskId,
        title: 'New Task',
        description: 'New Description',
        status: 'pending',
        priority: 'high',
        due_date: null,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category_id: null
      });

      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          title: 'New Task',
          description: 'New Description',
          priority: 'high'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('New Task');
    });

    it('should return 422 if title is empty', async () => {
      const res = await request(app)
        .post('/api/v1/tasks')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: '' });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/tasks/:id', () => {
    it('should return 200 with task detail', async () => {
      jest.spyOn(taskRepository, 'findByIdAndUserId').mockResolvedValue({
        id: taskId,
        title: 'Task Details',
        status: 'in_progress',
        priority: 'high',
        due_date: null,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        category_id: null
      });

      const res = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe('Task Details');
    });

    it('should return 404 if task not found', async () => {
      jest.spyOn(taskRepository, 'findByIdAndUserId').mockResolvedValue(null);

      const res = await request(app)
        .get(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/v1/tasks/:id', () => {
    it('should update task status and return 200', async () => {
      jest.spyOn(taskRepository, 'findByIdAndUserId')
        .mockResolvedValueOnce({ id: taskId, status: 'pending', priority: 'medium' })
        .mockResolvedValueOnce({
          id: taskId,
          title: 'Patched Task',
          status: 'completed',
          priority: 'medium',
          due_date: null,
          completed_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category_id: null
        });
      jest.spyOn(taskRepository, 'updateTask').mockResolvedValue({ id: taskId });

      const res = await request(app)
        .patch(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ status: 'completed' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('completed');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should soft-delete task and return 200', async () => {
      jest.spyOn(taskRepository, 'softDeleteTask').mockResolvedValue({ id: taskId });

      const res = await request(app)
        .delete(`/api/v1/tasks/${taskId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(taskId);
    });
  });
});

