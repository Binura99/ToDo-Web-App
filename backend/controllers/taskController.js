const { Op } = require("sequelize");
const db = require("../models");
const Task = db.tasks;


exports.getTasks = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 

    const tasks = await Task.findAll({
      where: {
        status: false,
        dueDate: { [Op.gte]: today },
      },
      order: [["dueDate", "ASC"]],
    });

    res.json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};


exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });
    if (!dueDate) return res.status(400).json({ error: "Due date is required" });

    const newTask = await Task.create({ title, description, dueDate });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.markComplete = async (req, res) => {
  try {
    const { id } = req.params;
    const taskItem = await Task.findByPk(id);

    if (!taskItem) return res.status(404).json({ error: "Task not found" });

    taskItem.status = true;
    await taskItem.save();

    res.json({ message: "Task completed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};