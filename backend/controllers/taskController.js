const task = require("../models/task")

// Fetch last 5 incomplete tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await task.findAll({
      where: { completed: false },
      order: [["createdAt", "DESC"]],
      limit: 5
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const newTask = await task.create({ title, description });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark task as completed
exports.markComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const taskA = await task.findByPk(id);

    if (!taskA) return res.status(404).json({ error: "Task not found" });

    taskA.completed = true;
    await taskA.save();

    res.json({ message: "Task completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
