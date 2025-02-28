// tests/controllers/taskController.test.js

const { getTasks, createTask, markComplete } = require('../../controllers/taskController');
const db = require('../../models');
const Task = db.tasks;

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
    // Reset mocks between tests
    jest.clearAllMocks();
    
    // Mock request and response objects
    req = {
      body: {},
      params: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('getTasks', () => {
    it('should fetch last 5 incomplete tasks', async () => {
      // Mock data
      const mockTasks = [
        { id: 1, title: 'Task 1', description: 'Description 1', status: false },
        { id: 2, title: 'Task 2', description: 'Description 2', status: false }
      ];
      
      // Setup the mock return value
      Task.findAll.mockResolvedValue(mockTasks);
      
      // Call the function
      await getTasks(req, res);
      
      // Assertions
      expect(Task.findAll).toHaveBeenCalledWith({
        where: { status: false },
        order: [["createdAt", "DESC"]],
        limit: 5
      });
      expect(res.json).toHaveBeenCalledWith(mockTasks);
    });
    
    it('should handle errors correctly', async () => {
      // Setup mock to throw error
      const errorMessage = 'Database error';
      Task.findAll.mockRejectedValue(new Error(errorMessage));
      
      // Call the function
      await getTasks(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
  
  describe('createTask', () => {
    it('should create a new task with valid input', async () => {
      // Setup request data
      const taskData = { title: 'New Task', description: 'New Description' };
      req.body = taskData;
      
      // Mock the created task
      const createdTask = { id: 3, ...taskData, status: false };
      Task.create.mockResolvedValue(createdTask);
      
      // Call the function
      await createTask(req, res);
      
      // Assertions
      expect(Task.create).toHaveBeenCalledWith(taskData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdTask);
    });
    
    it('should return error if title is missing', async () => {
      // Setup request with missing title
      req.body = { description: 'Description without title' };
      
      // Call the function
      await createTask(req, res);
      
      // Assertions
      expect(Task.create).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Title is required' });
    });
    
    it('should handle errors correctly', async () => {
      // Setup request data
      req.body = { title: 'Task', description: 'Description' };
      
      // Setup mock to throw error
      const errorMessage = 'Database error';
      Task.create.mockRejectedValue(new Error(errorMessage));
      
      // Call the function
      await createTask(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
  
  describe('markComplete', () => {
    it('should mark a task as complete', async () => {
      // Setup request params
      req.params = { id: '1' };
      
      // Mock task
      const mockTask = {
        id: 1,
        title: 'Task to complete',
        description: 'Description',
        status: false,
        save: jest.fn().mockResolvedValue(true)
      };
      
      Task.findByPk.mockResolvedValue(mockTask);
      
      // Call the function
      await markComplete(req, res);
      
      // Assertions
      expect(Task.findByPk).toHaveBeenCalledWith('1');
      expect(mockTask.status).toBe(true);
      expect(mockTask.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ message: 'Task completed successfully' });
    });
    
    it('should handle non-existent task', async () => {
      // Setup request params
      req.params = { id: '999' };
      
      // Mock non-existent task
      Task.findByPk.mockResolvedValue(null);
      
      // Call the function
      await markComplete(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Task not found' });
    });
    
    it('should handle errors correctly', async () => {
      // Setup request params
      req.params = { id: '1' };
      
      // Setup mock to throw error
      const errorMessage = 'Database error';
      Task.findByPk.mockRejectedValue(new Error(errorMessage));
      
      // Call the function
      await markComplete(req, res);
      
      // Assertions
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });
});

// tests/routes/taskRoutes.test.js

const request = require('supertest');
const express = require('express');
const taskRoutes = require('../../routes/taskRoutes');
const taskController = require('../../controllers/taskController');

// Mock the controller functions
jest.mock('../../controllers/taskController', () => ({
  getTasks: jest.fn((req, res) => res.json({ message: 'getTasks called' })),
  createTask: jest.fn((req, res) => res.json({ message: 'createTask called' })),
  markComplete: jest.fn((req, res) => res.json({ message: 'markComplete called' }))
}));

// Create express app for testing
const app = express();
app.use(express.json());
app.use('/api/tasks', taskRoutes);

describe('Task Routes', () => {
  it('GET /api/tasks should call getTasks controller', async () => {
    const response = await request(app).get('/api/tasks');
    
    expect(response.status).toBe(200);
    expect(taskController.getTasks).toHaveBeenCalled();
    expect(response.body).toEqual({ message: 'getTasks called' });
  });
  
  it('POST /api/tasks should call createTask controller', async () => {
    const taskData = { title: 'Test Task', description: 'Test Description' };
    const response = await request(app)
      .post('/api/tasks')
      .send(taskData);
      
    expect(response.status).toBe(200);
    expect(taskController.createTask).toHaveBeenCalled();
    expect(response.body).toEqual({ message: 'createTask called' });
  });
  
  it('PATCH /api/tasks/:id should call markComplete controller', async () => {
    const response = await request(app).patch('/api/tasks/1');
    
    expect(response.status).toBe(200);
    expect(taskController.markComplete).toHaveBeenCalled();
    expect(response.body).toEqual({ message: 'markComplete called' });
  });
});

// tests/models/task.test.js

const { Sequelize } = require('sequelize');
const TaskModel = require('../../models/task');

describe('Task Model', () => {
  let sequelize;
  let Task;
  
  beforeAll(() => {
    // Create an in-memory SQLite database for testing
    sequelize = new Sequelize('sqlite::memory:');
    Task = TaskModel(sequelize, Sequelize.DataTypes);
    
    // Sync the model with the database
    return sequelize.sync({ force: true });
  });
  
  afterAll(() => {
    // Close the database connection
    return sequelize.close();
  });
  
  it('should create a task with default status false', async () => {
    // Create a task
    const task = await Task.create({
      title: 'Test Task',
      description: 'Test Description'
    });
    
    // Get the JSON representation
    const json = task.toJSON();
    
    // Assertions
    expect(json.title).toBe('Test Task');
    expect(json.description).toBe('Test Description');
    expect(json.status).toBe(false);
    expect(json.id).toBeDefined();
  });
  
  it('should not allow null title', async () => {
    try {
      await Task.create({
        description: 'Description without title'
      });
      // If the create succeeds, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Assertion
      expect(error).toBeDefined();
    }
  });
  
  it('should allow null description', async () => {
    // Create a task without description
    const task = await Task.create({
      title: 'Task without description'
    });
    
    // Get the JSON representation
    const json = task.toJSON();
    
    // Assertions
    expect(json.title).toBe('Task without description');
    expect(json.description).toBeNull();
  });
});