const express = require("express");
const app = express();
const cors = require("cors");
const { Sequelize } = require("sequelize");

app.use(express.json());
app.use(cors());

const db = require("./models");

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

db.sequelize.sync().then(()=> {
  app.listen(3001, ()=> {
      console.log("Server running on port 3001");
  });
});