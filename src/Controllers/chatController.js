const chatService = require('../Services/chatService');

async function createChat(req, res, next) {
    try {
        const { user2Id } = req.body;
        const user1Id = req.user.id

        const chat = await chatService.createChat({user1Id, user2Id});

        res.status(201).json(chat);
    } catch (error) {
        next(error);
    }
}

async function getChatsByUser(req, res, next) {
    try {
        const userId = req.user.id;

        const chats = await chatService.getChatsByUser(userId);

        return res.status(200).json(chats);
    } catch (error) {
        next(error);
    }
}

module.exports = { createChat, getChatsByUser }