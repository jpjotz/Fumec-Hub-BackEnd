const messageService = require('../Services/messageService');

async function createMessage(req, res, next) {
    try {
        const { chatId, content } = req.body;
        const senderId = req.user.id
        const message = await messageService.createMessage({chatId, senderId, content});

        return res.status(201).json(message);
    } catch (error) {
        next(error);
    }
}

async function getMessagesByChat(req, res, next) {
    try {
        const { chatId } = req.params;
        const messages = await messageService.getMessagesByChat(chatId);

        return res.status(200).json(messages)
    } catch (error) {
        next(error);
    }
}

module.exports = { createMessage, getMessagesByChat }