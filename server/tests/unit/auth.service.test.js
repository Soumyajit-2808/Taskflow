const bcrypt = require('bcrypt');
const { ConflictError, UnauthorizedError, NotFoundError } = require('../../src/utils/errors');
const authService = require('../../src/modules/auth/auth.service');

describe('AuthService (Unit)', () => {
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      createUser: jest.fn()
    };
    authService.repo = mockRepo;
  });

  describe('register', () => {
    it('should throw ConflictError if user email already exists', async () => {
      mockRepo.findByEmail.mockResolvedValue({ id: '1', email: 'existing@example.com' });

      await expect(
        authService.register({
          email: 'existing@example.com',
          password: 'Password123!',
          fullName: 'John Doe'
        })
      ).rejects.toThrow(ConflictError);
    });

    it('should hash password, create user, and return user with token', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      mockRepo.createUser.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'new@example.com',
        full_name: 'New User',
        avatar_url: null,
        created_at: new Date().toISOString()
      });

      const result = await authService.register({
        email: 'new@example.com',
        password: 'Password123!',
        fullName: 'New User'
      });

      expect(mockRepo.createUser).toHaveBeenCalled();
      expect(result.user.email).toBe('new@example.com');
      expect(result.token).toBeDefined();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedError if user does not exist', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login({ email: 'unknown@example.com', password: 'Password123!' })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should throw UnauthorizedError if password does not match', async () => {
      const hash = await bcrypt.hash('CorrectPassword1!', 4);
      mockRepo.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        password_hash: hash
      });

      await expect(
        authService.login({ email: 'user@example.com', password: 'WrongPassword' })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('should return user and token when password matches', async () => {
      const hash = await bcrypt.hash('CorrectPassword1!', 4);
      mockRepo.findByEmail.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        full_name: 'User One',
        password_hash: hash,
        created_at: new Date().toISOString()
      });

      const result = await authService.login({
        email: 'user@example.com',
        password: 'CorrectPassword1!'
      });

      expect(result.user.email).toBe('user@example.com');
      expect(result.token).toBeDefined();
    });
  });

  describe('getMe', () => {
    it('should throw NotFoundError if user is not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(authService.getMe('invalid-id')).rejects.toThrow(NotFoundError);
    });

    it('should return user profile data', async () => {
      mockRepo.findById.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        full_name: 'User One',
        avatar_url: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

      const user = await authService.getMe('user-1');
      expect(user.id).toBe('user-1');
      expect(user.email).toBe('user@example.com');
    });
  });
});

