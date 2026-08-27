const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const User = require('./User');
const Chat = require('./Chat');

const message = sequelize.define("Message", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
    },

    chatId: {
        type: DataTypes.UUID,
        references: {
            model: "Chats",
            key: "id"
        }
    },

    senderId: {
        type: DataTypes.UUID,
        references: {
            model: "Users",
            key: "id"
        }
    },

    content: {
        type: DataTypes.STRING,
    },
});

message.belongsTo(Chat, {
    foreignKey: "chatId"
});

message.belongsTo(User, {
    foreignKey: "senderId"
})

module.exports = message;