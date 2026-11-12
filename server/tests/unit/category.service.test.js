const { ConflictError, NotFoundError } = require('../../src/utils/errors');
const categoryService = require('../../src/modules/categories/category.service');

describe('CategoryService (Unit)', () => {
  let mockRepo;

  beforeEach(() => {
    mockRepo = {
      findAllByUserId: jest.fn(),
      findByIdAndUserId: jest.fn(),
      findByNameAndUserId: jest.fn(),
      createCategory: jest.fn(),
      updateCategory: jest.fn(),
      deleteCategory: jest.fn()
    };
    categoryService.repo = mockRepo;
  });

  describe('createCategory', () => {
    it('should throw ConflictError if category name exists for user', async () => {
      mockRepo.findByNameAndUserId.mockResolvedValue({ id: 'cat-1', name: 'Work' });

      await expect(
        categoryService.createCategory('user-1', { name: 'Work', color: '#6366f1' })
      ).rejects.toThrow(ConflictError);
    });

    it('should create and return category', async () => {
      mockRepo.findByNameAndUserId.mockResolvedValue(null);
      mockRepo.createCategory.mockResolvedValue({
        id: 'cat-1',
        user_id: 'user-1',
        name: 'Work',
        color: '#6366f1'
      });

      const result = await categoryService.createCategory('user-1', {
        name: 'Work',
        color: '#6366f1'
      });
      expect(result.name).toBe('Work');
      expect(mockRepo.createCategory).toHaveBeenCalledWith({
        userId: 'user-1',
        name: 'Work',
        color: '#6366f1'
      });
    });
  });

  describe('updateCategory', () => {
    it('should throw NotFoundError if category does not exist', async () => {
      mockRepo.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        categoryService.updateCategory('user-1', 'non-existent', { name: 'New Name' })
      ).rejects.toThrow(NotFoundError);
    });

    it('should throw ConflictError if updating to a name that already exists', async () => {
      mockRepo.findByIdAndUserId.mockResolvedValue({ id: 'cat-1', name: 'Work' });
      mockRepo.findByNameAndUserId.mockResolvedValue({ id: 'cat-2', name: 'Personal' });

      await expect(
        categoryService.updateCategory('user-1', 'cat-1', { name: 'Personal' })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('deleteCategory', () => {
    it('should throw NotFoundError if category to delete is not found', async () => {
      mockRepo.deleteCategory.mockResolvedValue(null);

      await expect(categoryService.deleteCategory('user-1', 'cat-1')).rejects.toThrow(NotFoundError);
    });

    it('should return deleted category id on success', async () => {
      mockRepo.deleteCategory.mockResolvedValue({ id: 'cat-1' });

      const result = await categoryService.deleteCategory('user-1', 'cat-1');
      expect(result.id).toBe('cat-1');
    });
  });
});

