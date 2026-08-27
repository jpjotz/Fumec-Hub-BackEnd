const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const User = require('./User');

const chat = sequelize.define("Chat", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    user1Id: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

    user2Id: {
        type: DataTypes.UUID,
        references: {
            model: 'Users',
            key: 'id'
        }
    },

});

chat.belongsTo(User, {
    foreignKey: "user1Id"
});

chat.belongsTo(User, {
    foreignKey: "user2Id"
});

module.exports = chat;