const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');

const Course = sequelize.define("Course", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = Course;