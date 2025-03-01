const { getTasks, createTask, markComplete } = require('../../controllers/taskController');
const db = require('../../models');
const Task = db.tasks;
const { Op } = require('sequelize');

// Mock the Sequelize model functions
jest.mock('../../models', () => {
  const mockTask = {
    findAll: jest.fn(),
    create: jest.fn(),
    findByPk: jest.fn()
  };
  
  return { 
    tasks: mockTask,
    sequelize: {
      sync: jest.fn().mockResolvedValue()
    }
  };
});

describe('Task Controller', () => {
  let req, res;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  });
  
  describe('getTasks', () => {
    it('should fetch incomplete tasks with due dates from today onwards', async () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', status: false, dueDate: today },
        { id: 2, title: 'Task 2', description: 'Description 2', status: false, dueDate: today }
      ];
      
      Task.findAll.mockResolvedValue(mockTasks);
      
      await getTasks(req, res);
      
      expect(Task.findAll).toHaveBeenCalledWith({
        where: {
          status: false,
          dueDate: { [Op.gte]: today }
        },
        order: [["dueDate", "ASC"]]
      });
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });

    it('should handle errors correctly', async () => {
      const errorMessage = 'Database error';
      Task.findAll.mockRejectedValue(new Error(errorMessage));
      
      await getTasks(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch tasks' });
    });
  });
  
  describe('createTask', () => {
    it('should create a new task with valid input', async () => {
      req.body = { title: 'New Task', description: 'New Description', dueDate: new Date() };
      const createdTask = { id: 3, ...req.body, status: false };
      
      Task.create.mockResolvedValue(createdTask);
      
      await createTask(req, res);
      
      expect(Task.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTask);
    });
    
    it('should return error if title or dueDate is missing', async () => {
      req.body = { description: 'Missing title and dueDate' };
      await createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Title is required' });

      req.body = { title: 'Task Without DueDate' };
      await createTask(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Due date is required' });
    });
    
    it('should handle errors correctly', async () => {
      req.body = { title: 'Task', description: 'Description', dueDate: new Date() };
      const errorMessage = 'Database error';
      Task.create.mockRejectedValue(new Error(errorMessage));
      
      await createTask(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
  
  describe('markComplete', () => {
    it('should mark a task as complete', async () => {
      req.params = { id: '1' };
      const mockTask = { id: 1, status: false, save: jest.fn().mockResolvedValue(true) };
      
      Task.findByPk.mockResolvedValue(mockTask);
      
      await markComplete(req, res);
      
      expect(Task.findByPk).toHaveBeenCalledWith('1');
      expect(mockTask.status).toBe(true);
      expect(mockTask.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Task completed successfully' });
    });
    
    it('should handle non-existent task', async () => {
      req.params = { id: '999' };
      Task.findByPk.mockResolvedValue(null);
      
      await markComplete(req, res);
      
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
    
    it('should handle errors correctly', async () => {
      req.params = { id: '1' };
      const errorMessage = 'Database error';
      Task.findByPk.mockRejectedValue(new Error(errorMessage));
      
      await markComplete(req, res);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});
