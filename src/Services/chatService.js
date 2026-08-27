const Chat = require('../Models/Chat');
const { Op } = require('sequelize');

async function createChat(data) {
    const { user1Id, user2Id } = data;

    const chat = await Chat.create({
        user1Id,
        user2Id
    });

    return {
        message: "Chat criado com sucesso!",
        chat
    }
}

async function getChatsByUser(userId) {
    const chats = await Chat.findAll({
        where: {
            [Op.or]: [
                {user1Id: userId},
                {user2Id: userId}
            ]
        }
    });

    return {chats}
}

module.exports = { createChat, getChatsByUser }