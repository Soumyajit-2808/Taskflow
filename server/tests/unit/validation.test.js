const { registerSchema, loginSchema } = require('../../src/modules/auth/auth.validation');
const { createCategorySchema } = require('../../src/modules/categories/category.validation');
const { createTaskSchema, updateTaskSchema } = require('../../src/modules/tasks/task.validation');

describe('Zod Validation Schemas (Unit)', () => {
  describe('Auth Schemas', () => {
    it('should validate a valid registration payload', () => {
      const valid = {
        email: 'developer@example.com',
        password: 'Password123!',
        fullName: 'Jane Doe'
      };
      expect(() => registerSchema.body.parse(valid)).not.toThrow();
    });

    it('should reject registration with invalid email', () => {
      const invalid = {
        email: 'not-an-email',
        password: 'Password123!',
        fullName: 'Jane Doe'
      };
      expect(() => registerSchema.body.parse(invalid)).toThrow();
    });

    it('should reject registration with password shorter than 8 chars', () => {
      const invalid = {
        email: 'dev@example.com',
        password: 'Pass1',
        fullName: 'Jane Doe'
      };
      expect(() => registerSchema.body.parse(invalid)).toThrow();
    });

    it('should validate a valid login payload', () => {
      const valid = {
        email: 'dev@example.com',
        password: 'SecretPassword1'
      };
      expect(() => loginSchema.body.parse(valid)).not.toThrow();
    });
  });

  describe('Category Schemas', () => {
    it('should validate a valid category payload', () => {
      const valid = {
        name: 'Engineering',
        color: '#3b82f6'
      };
      expect(() => createCategorySchema.body.parse(valid)).not.toThrow();
    });

    it('should reject category with invalid hex color', () => {
      const invalid = {
        name: 'Design',
        color: 'invalid-hex'
      };
      expect(() => createCategorySchema.body.parse(invalid)).toThrow();
    });

    it('should reject category with empty name', () => {
      const invalid = {
        name: '',
        color: '#6366f1'
      };
      expect(() => createCategorySchema.body.parse(invalid)).toThrow();
    });
  });

  describe('Task Schemas', () => {
    it('should validate a valid task creation payload with defaults', () => {
      const valid = {
        title: 'Implement unit tests'
      };
      const parsed = createTaskSchema.body.parse(valid);
      expect(parsed.title).toBe('Implement unit tests');
      expect(parsed.status).toBe('pending');
      expect(parsed.priority).toBe('medium');
    });

    it('should reject task creation with missing title', () => {
      const invalid = {
        description: 'No title provided'
      };
      expect(() => createTaskSchema.body.parse(invalid)).toThrow();
    });

    it('should reject task with invalid priority enum', () => {
      const invalid = {
        title: 'Fix issue',
        priority: 'super-urgent'
      };
      expect(() => createTaskSchema.body.parse(invalid)).toThrow();
    });
  });
});

