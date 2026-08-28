const { DataTypes } = require('sequelize');
const sequelize = require('../Config/database');
const User = require('./User');

const Friendship = sequelize.define("Friendship", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },

    user1Id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    user2Id: {
        type: DataTypes.UUID,
        allowNull: false
    },

    status: {
        type: DataTypes.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending"
    }
});

Friendship.belongsTo(User, { foreignKey: "user1Id", as: "sender" });
Friendship.belongsTo(User, { foreignKey: "user2Id", as: "receiver" });

module.exports = Friendship