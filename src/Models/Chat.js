const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const User = require('./User');
const Friendship = require('./Friendship');

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

    friendshipId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'Friendships',
            key: 'id'
        }
    }

});

chat.belongsTo(User, {
    foreignKey: "user1Id",
    as: 'user1'
});

chat.belongsTo(User, {
    foreignKey: "user2Id",
    as: 'user2'
});

chat.belongsTo(Friendship, {
    foreignKey: "friendshipId",
    as: "friendship"
});

module.exports = chat;