const express = require("express");
const { getTasks, createTask, markComplete } = require("../controllers/taskController");

const router = express.Router();

router.get("/", getTasks);
router.post("/", createTask);
router.patch("/:id", markComplete);

module.exports = router;
