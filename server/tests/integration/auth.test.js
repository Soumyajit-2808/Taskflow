const request = require('supertest');
const app = require('../../src/app');
const authRepository = require('../../src/modules/auth/auth.repository');
const { signToken } = require('../../src/utils/jwt');
const bcrypt = require('bcrypt');

describe('Auth Endpoints (Integration)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully and return 201', async () => {
      jest.spyOn(authRepository, 'findByEmail').mockResolvedValue(null);
      jest.spyOn(authRepository, 'createUser').mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'developer@example.com',
        full_name: 'Jane Doe',
        avatar_url: null,
        created_at: new Date().toISOString()
      });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'developer@example.com',
          password: 'Password123!',
          fullName: 'Jane Doe'
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe('developer@example.com');
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 422 if input validation fails', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'invalid-email',
          password: 'short'
        });

      expect(res.status).toBe(422);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('VALIDATION_FAILED');
    });

    it('should return 409 if user already exists', async () => {
      jest.spyOn(authRepository, 'findByEmail').mockResolvedValue({ id: 'existing-id' });

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'Password123!',
          fullName: 'Jane Doe'
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('RESOURCE_CONFLICT');
    });
  });

  describe('POST /api/v1/auth/login', () => {
    it('should authenticate user and return 200 with JWT', async () => {
      const passwordHash = await bcrypt.hash('CorrectPass1!', 4);
      jest.spyOn(authRepository, 'findByEmail').mockResolvedValue({
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'developer@example.com',
        full_name: 'Jane Doe',
        password_hash: passwordHash,
        created_at: new Date().toISOString()
      });

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'developer@example.com',
          password: 'CorrectPass1!'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });

    it('should return 401 for incorrect credentials', async () => {
      jest.spyOn(authRepository, 'findByEmail').mockResolvedValue(null);

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'unknown@example.com',
          password: 'Password123!'
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should return 401 when Authorization header is missing', async () => {
      const res = await request(app).get('/api/v1/auth/me');
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it('should return 200 and user profile when token is valid', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const token = signToken({ id: userId, email: 'developer@example.com' });

      jest.spyOn(authRepository, 'findById').mockResolvedValue({
        id: userId,
        email: 'developer@example.com',
        full_name: 'Jane Doe',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      const res = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBe(userId);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should return 200 and clear cookie', async () => {
      const token = signToken({ id: '123', email: 'dev@example.com' });

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

