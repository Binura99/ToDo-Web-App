const db = require("../models");
const Task = db.tasks; // Update this to match how your model is exported

// Fetch last 5 incomplete tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { status: false }, // Change 'completed' to 'status' to match your model
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

    const newTask = await Task.create({ title, description });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Mark task as completed
exports.markComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const taskItem = await Task.findByPk(id);

    if (!taskItem) return res.status(404).json({ error: "Task not found" });

    taskItem.status = true; // Change 'completed' to 'status' to match your model
    await taskItem.save();

    res.json({ message: "Task completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};