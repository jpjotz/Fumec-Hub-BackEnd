const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const Chat = require('../Models/Chat');
const Message = require('../Models/Message');

const rooms = new Map();

async function joinChat(socket, chatId) {

    try {
        const chat = await Chat.findByPk(chatId);

        if (!chat) {
            return;
        }

        if (socket.userId !== chat.user1Id && socket.userId !== chat.user2Id) {
            return;
        }

        if (!rooms.has(chatId)) {
            rooms.set(chatId, new Set());
        }

        rooms.get(chatId).add(socket);

        console.log(`Socket entrou no chat ${chatId}`);
        console.log(rooms);
    } catch (error) {
        console.error("Erro ao entrar no chat: ", error);
    }
}

function leaveChat(socket) {
    for (const [chatId, room] of rooms) {
        if (room.has(socket)) {
            room.delete(socket);
        }

        if (room.size === 0) {
            rooms.delete(chatId);
        }
    }
}

async function sendToRoom(socket, chatId, message) {
    try {
        const room = rooms.get(chatId);

        if (!room || !room.has(socket)) {
            return;
        }

        const newMessage = await Message.create({
            chatId,
            senderId: socket.userId,
            content: message.content
        });

        const messageToSend = {
            event: "newMessage",
            id: newMessage.id,
            chatId: newMessage.chatId,
            senderId: newMessage.senderId,
            content: newMessage.content
        }

        for (const clientSocket of room) {
            clientSocket.send(JSON.stringify(messageToSend));

        }
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
}

async function getChatMessages(socket, chatId) {
    const chat = await Chat.findByPk(chatId);

    if (!chat) {
        return;
    }

    const messages = await Message.findAll({
        where: {
            chatId
        }
    });

    socket.send(JSON.stringify(messages));

}

function initializeSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (socket, req) => {
        console.log('Cliente conectado');

        const cookies = req.headers.cookie;

        const accessToken = cookies?.split("; ").find(cookie => cookie.startsWith("accessToken"))?.split('=')[1];

        try {
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

            socket.userId = decoded.id;
        } catch (error) {
            socket.close();
            return;
        }

        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());

            if (message.event === "joinChat") {
                joinChat(socket, message.chatId);
                getChatMessages(socket, message.chatId);
            }

            if (message.event === "sendMessage") {
                sendToRoom(socket, message.chatId, message);
            }
        });

        socket.on('close', () => {
            leaveChat(socket);
            console.log("Cliente desconectado");
        });
    });
}

module.exports = initializeSocket;