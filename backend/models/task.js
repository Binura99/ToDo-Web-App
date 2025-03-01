module.exports = (sequelize, DataTypes) => {

const task = sequelize.define("tasks", {
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
    dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
    },
});

return task;
};
