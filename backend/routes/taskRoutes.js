const express = require("express");
const { getTasks, createTask, markComplete } = require("../controllers/taskController");

const router = express.Router();

router.get("/", getTasks); // Fetch last 5 incomplete tasks
router.post("/", createTask); // Create new task
router.patch("/:id", markComplete); // Mark task as completed

module.exports = router;
