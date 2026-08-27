const Message = require('../Models/Message');

async function createMessage(data) {
    const { chatId, senderId, content } = data;

    const message = await Message.create({
        chatId, senderId, content
    });

    return message;
}

async function getMessagesByChat(chatId) {
    const messages = await Message.findAll({
        where: {
            chatId
        }
    });

    return messages;
}

module.exports = { createMessage, getMessagesByChat }