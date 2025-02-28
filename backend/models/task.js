const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize('sqlite::memory:');

const task = sequelize.define("Task", {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
    },
    status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    },
});

module.exports = task;
