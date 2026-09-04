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

    const formattedChats = chats.map(chat => {
        const otherUser = chat.user1Id === userId ? chat.user2 : chat.user1;

        return {id: chat.id, otherUser}
    })

    return { chats: formattedChats }
}

module.exports = { createChat, getChatsByUser }