const request = require('supertest');
const app = require('../../src/app');
const categoryRepository = require('../../src/modules/categories/category.repository');
const { signToken } = require('../../src/utils/jwt');

describe('Category Endpoints (Integration)', () => {
  const userId = '123e4567-e89b-12d3-a456-426614174000';
  const validToken = signToken({ id: userId, email: 'dev@example.com' });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/v1/categories', () => {
    it('should list categories for the authenticated user', async () => {
      jest.spyOn(categoryRepository, 'findAllByUserId').mockResolvedValue([
        { id: 'cat-1', user_id: userId, name: 'Work', color: '#6366f1' }
      ]);

      const res = await request(app)
        .get('/api/v1/categories')
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].name).toBe('Work');
    });
  });

  describe('POST /api/v1/categories', () => {
    it('should create a category and return 201', async () => {
      jest.spyOn(categoryRepository, 'findByNameAndUserId').mockResolvedValue(null);
      jest.spyOn(categoryRepository, 'createCategory').mockResolvedValue({
        id: 'cat-1',
        user_id: userId,
        name: 'Urgent Ops',
        color: '#ef4444'
      });

      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Urgent Ops',
          color: '#ef4444'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Urgent Ops');
    });

    it('should return 422 if hex color format is invalid', async () => {
      const res = await request(app)
        .post('/api/v1/categories')
        .set('Authorization', `Bearer ${validToken}`)
        .send({
          name: 'Invalid Color',
          color: 'red'
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/v1/categories/:id', () => {
    const categoryId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    it('should update category and return 200', async () => {
      jest.spyOn(categoryRepository, 'findByIdAndUserId').mockResolvedValue({
        id: categoryId,
        name: 'Old Name'
      });
      jest.spyOn(categoryRepository, 'findByNameAndUserId').mockResolvedValue(null);
      jest.spyOn(categoryRepository, 'updateCategory').mockResolvedValue({
        id: categoryId,
        user_id: userId,
        name: 'New Name',
        color: '#10b981'
      });

      const res = await request(app)
        .put(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'New Name', color: '#10b981' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('New Name');
    });

    it('should return 422 if ID is not a valid UUID', async () => {
      const res = await request(app)
        .put('/api/v1/categories/not-a-uuid')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ name: 'Updated' });

      expect(res.status).toBe(422);
    });
  });

  describe('DELETE /api/v1/categories/:id', () => {
    const categoryId = 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d';

    it('should delete category and return 200', async () => {
      jest.spyOn(categoryRepository, 'deleteCategory').mockResolvedValue({ id: categoryId });

      const res = await request(app)
        .delete(`/api/v1/categories/${categoryId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(categoryId);
    });
  });
});

