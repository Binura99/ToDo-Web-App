require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const { Sequelize } = require("sequelize");

app.use(express.json());
app.use(cors());

const db = require("./models");

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 3001;

// Sync database
db.sequelize.sync().then(() => {
  console.log("Database connected successfully");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});