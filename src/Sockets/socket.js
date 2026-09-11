const WebSocket = require('ws');
const jwt = require('jsonwebtoken');
const url = require('url'); // Módulo nativo do Node.js
const Chat = require('../Models/Chat');
const Message = require('../Models/Message');

const rooms = new Map();

async function joinChat(socket, chatId) {
    try {
        const chat = await Chat.findByPk(chatId);

        if (!chat) return;

        if (socket.userId !== chat.user1Id && socket.userId !== chat.user2Id) {
            return;
        }

        leaveChat(socket);

        if (!rooms.has(chatId)) {
            rooms.set(chatId, new Set());
        }

        rooms.get(chatId).add(socket);

        socket.currentChat = chatId;

        console.log(`Socket entrou no chat ${chatId}`);

    } catch (error) {
        console.error("Erro ao entrar no chat: ", error);
    }
}

function leaveChat(socket) {
    for (const [chatId, room] of rooms) {
        if (room.has(socket)) {
            if (!chatId.startsWith('user:')) {
                room.delete(socket);
            }
        }

        if (room.size === 0) {
            rooms.delete(chatId);
        }
    }

    socket.currentChat = null;
}

function leaveAllChats(socket) {
    for (const [chatId, room] of rooms) {
        room.delete(socket);

        if (room.size === 0) {
            rooms.delete(chatId);
        }
    }

    socket.currentChat = null;
}

async function sendToRoom(socket, chatId, message) {
    try {
        const chat = await Chat.findByPk(chatId);

        if (!chat) return;

        const otherUser =
            chat.user1Id === socket.userId
                ? chat.user2Id
                : chat.user1Id;

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
        };

        for (const clientSocket of room) {
            clientSocket.send(JSON.stringify(messageToSend));
        }

        const notification = {
            event: 'newMessageNotification',
            chatId: newMessage.chatId,
            senderId: newMessage.senderId,
            content: newMessage.content
        };

        const otherUserRoom = rooms.get(`user:${otherUser}`);

        const otherUserInChat = [...(otherUserRoom || [])]
            .some(clientSocket => clientSocket.currentChat === chatId);

        if (!otherUserInChat) {
            sendToUser(otherUser, notification);
        }

    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
}

async function getChatMessages(socket, chatId) {
    const messages = await Message.findAll({
        where: {
            chatId
        }
    });

    socket.send(JSON.stringify(messages));
}

function joinUserRoom(socket) {
    const userRoom = `user:${socket.userId}`;

    if (!rooms.has(userRoom)) {
        rooms.set(userRoom, new Set());
    }

    rooms.get(userRoom).add(socket);
}

function sendToUser(userId, message) {
    const userRoom = rooms.get(`user:${userId}`);

    if (!userRoom) return;

    for (const clientSocket of userRoom) {
        clientSocket.send(JSON.stringify(message));
    }
}

function initializeSocket(server) {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (socket, req) => {
        console.log('Cliente tentando conectar ao WS...');

        // 1. Tenta pegar dos cookies
        const cookies = req.headers.cookie;
        let accessToken = cookies
            ?.split("; ")
            .find(cookie => cookie.startsWith("accessToken"))
            ?.split('=')[1];

        // 2. Se não veio nos cookies (cenário Vercel), pega dos query params da URL
        const queryParams = url.parse(req.url, true).query;
        if (!accessToken && queryParams.token) {
            accessToken = queryParams.token;
        }

        // Se passar apenas o userId na URL (alternativa caso use userId direto)
        const directUserId = queryParams.userId;

        try {
            if (accessToken) {
                const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
                socket.userId = decoded.id;
            } else if (directUserId) {
                socket.userId = directUserId;
            } else {
                throw new Error("Nenhum token ou userId fornecido");
            }

            socket.currentChat = null;
            joinUserRoom(socket);

            console.log(`Cliente conectado e autenticado! UserID: ${socket.userId}`);

        } catch (error) {
            console.error("Falha na autenticação do WebSocket:", error.message);
            socket.close(); // Fecha se realmente não tiver identificação válida
            return;
        }

        socket.on("message", async (data) => {
            try {
                const message = JSON.parse(data.toString());

                switch (message.event) {
                    case "joinChat":
                        await joinChat(socket, message.chatId);
                        await getChatMessages(socket, message.chatId);
                        break;

                    case "leaveChat":
                        leaveChat(socket);
                        break;

                    case "sendMessage":
                        sendToRoom(socket, message.chatId, message);
                        break;
                }
            } catch (err) {
                console.error("Erro ao processar mensagem recebida:", err);
            }
        });

        socket.on('close', () => {
            leaveAllChats(socket);
            console.log("Cliente desconectado");
        });
    });
}

module.exports = {
    initializeSocket,
    sendToUser
};