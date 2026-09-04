const Chat = require('../Models/Chat');
const { Op } = require('sequelize');
const User = require('../Models/User');

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
                { user1Id: userId },
                { user2Id: userId }
            ]
        },
        include: [
            {
                model: User,
                as: 'user1',
                attributes: ['id', 'name']
            },
            {
                model: User,
                as: 'user2',
                attributes: ['id', 'name']
            }
        ]
    });

    return { chats }
}

module.exports = { createChat, getChatsByUser }