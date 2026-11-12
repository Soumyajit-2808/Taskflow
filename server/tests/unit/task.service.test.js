const { NotFoundError, BadRequestError } = require('../../src/utils/errors');
const taskService = require('../../src/modules/tasks/task.service');

describe('TaskService (Unit)', () => {
  let mockTaskRepo;
  let mockCatRepo;

  beforeEach(() => {
    mockTaskRepo = {
      findTasks: jest.fn(),
      countTasks: jest.fn(),
      findByIdAndUserId: jest.fn(),
      createTask: jest.fn(),
      updateTask: jest.fn(),
      softDeleteTask: jest.fn(),
      getTaskStats: jest.fn()
    };
    mockCatRepo = {
      findByIdAndUserId: jest.fn()
    };
    taskService.repo = mockTaskRepo;
    taskService.catRepo = mockCatRepo;
  });

  describe('getTasks', () => {
    it('should calculate pagination meta correctly and format response', async () => {
      mockTaskRepo.findTasks.mockResolvedValue([
        {
          id: 'task-1',
          title: 'Test Task',
          description: 'Desc',
          status: 'pending',
          priority: 'medium',
          due_date: null,
          completed_at: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          category_id: 'cat-1',
          category_name: 'Work',
          category_color: '#3b82f6'
        }
      ]);
      mockTaskRepo.countTasks.mockResolvedValue(15);

      const result = await taskService.getTasks('user-1', {
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc'
      });

      expect(result.tasks.length).toBe(1);
      expect(result.tasks[0].title).toBe('Test Task');
      expect(result.tasks[0].category.name).toBe('Work');
      expect(result.meta.total).toBe(15);
      expect(result.meta.totalPages).toBe(2);
    });
  });

  describe('createTask', () => {
    it('should throw BadRequestError if categoryId does not belong to user', async () => {
      mockCatRepo.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        taskService.createTask('user-1', {
          title: 'My Task',
          categoryId: 'invalid-cat-id',
          priority: 'high',
          status: 'pending'
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('should create task and return formatted task', async () => {
      mockCatRepo.findByIdAndUserId.mockResolvedValue({ id: 'cat-1' });
      mockTaskRepo.createTask.mockResolvedValue({ id: 'task-100' });
      mockTaskRepo.findByIdAndUserId.mockResolvedValue({
        id: 'task-100',
        title: 'New Task',
        status: 'pending',
        priority: 'high',
        category_id: 'cat-1',
        category_name: 'Work',
        category_color: '#6366f1'
      });

      const task = await taskService.createTask('user-1', {
        title: 'New Task',
        categoryId: 'cat-1',
        priority: 'high',
        status: 'pending'
      });

      expect(task.id).toBe('task-100');
      expect(task.title).toBe('New Task');
    });
  });

  describe('patchTask', () => {
    it('should throw NotFoundError if task does not exist', async () => {
      mockTaskRepo.findByIdAndUserId.mockResolvedValue(null);

      await expect(
        taskService.patchTask('user-1', 'task-missing', { status: 'completed' })
      ).rejects.toThrow(NotFoundError);
    });

    it('should set completed_at when status transitioned to completed', async () => {
      mockTaskRepo.findByIdAndUserId
        .mockResolvedValueOnce({
          id: 'task-1',
          status: 'in_progress',
          priority: 'medium'
        })
        .mockResolvedValueOnce({
          id: 'task-1',
          status: 'completed',
          priority: 'medium',
          completed_at: new Date().toISOString()
        });

      await taskService.patchTask('user-1', 'task-1', { status: 'completed' });

      expect(mockTaskRepo.updateTask).toHaveBeenCalledWith(
        'task-1',
        'user-1',
        expect.objectContaining({
          status: 'completed',
          completed_at: expect.any(String)
        })
      );
    });
  });

  describe('deleteTask', () => {
    it('should throw NotFoundError if task is not found', async () => {
      mockTaskRepo.softDeleteTask.mockResolvedValue(null);

      await expect(taskService.deleteTask('user-1', 'task-missing')).rejects.toThrow(NotFoundError);
    });

    it('should return deleted id on soft delete', async () => {
      mockTaskRepo.softDeleteTask.mockResolvedValue({ id: 'task-1' });

      const result = await taskService.deleteTask('user-1', 'task-1');
      expect(result.id).toBe('task-1');
    });
  });

  describe('getTaskStats', () => {
    it('should return aggregated task metrics', async () => {
      const mockStats = {
        total: 10,
        pending: 4,
        in_progress: 3,
        completed: 3,
        archived: 0,
        overdue: 1,
        due_today: 2,
        due_this_week: 5
      };
      mockTaskRepo.getTaskStats.mockResolvedValue(mockStats);

      const stats = await taskService.getTaskStats('user-1');
      expect(stats.total).toBe(10);
      expect(stats.overdue).toBe(1);
    });
  });
});

