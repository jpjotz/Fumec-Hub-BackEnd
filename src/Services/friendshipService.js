const Friendship = require('../Models/Friendship');
const Message = require('../Models/Message');
const Chat = require('../Models/Chat');
const Course = require('../Models/Course');
const { Op } = require('sequelize');
const User = require('../Models/User');
const { sendToUser } = require('../Sockets/socket');

async function getFriendshipRequests(userId) {
    const requests = await Friendship.findAll({
        where: {
            user2Id: userId,
            status: "pending"
        },

        include: [{
            model: User,
            as: "sender",
            attributes: ["name", "friendCode"]
        }]
    });

    return { count: requests.length, requests }

}

async function sendFriendRequest(userId, friendCode) {

    const friend = await User.findOne({
        where: {
            friendCode
        }
    });

    if (!friend) {
        const error = new Error("Nenhum usuário encontrado!");
        error.statusCode = 404;
        throw error;
    }

    if (userId === friend.id) {
        const error = new Error("Usuário não pode adicionar a si mesmo!");
        error.statusCode = 409;
        throw error;
    }

    const isFriends = await Friendship.findOne({
        where: {
            [Op.or]: [
                {
                    user1Id: userId,
                    user2Id: friend.id
                },

                {
                    user1Id: friend.id,
                    user2Id: userId
                }
            ],

            status: {
                [Op.in]: ['pending', 'accepted']
            }
        }
    });

    if (isFriends) {
        const error = new Error("Amizade já existente");
        error.statusCode = 409;
        throw error;
    }

    const newFriendshipRequest = await Friendship.create({
        user1Id: userId,
        user2Id: friend.id
    });

    sendToUser(friend.id, {
        event: "friendRequest"
    });

    return { message: "Solicitação enviada!", newFriendshipRequest }

}

async function acceptFriendRequest(userId, friendshipId) {
    const requestExists = await Friendship.findOne({
        where: {
            id: friendshipId
        }
    });

    if (!requestExists) {
        const error = new Error("Pedido de amizade inexistente");
        error.statusCode = 404;
        throw error;
    }

    if (requestExists.user2Id !== userId) {
        const error = new Error("Usuário inválido");
        error.statusCode = 403;
        throw error;
    }

    if (requestExists.status !== 'pending') {
        const error = new Error("Amizade já aceita");
        error.statusCode = 409;
        throw error;
    }

    requestExists.status = "accepted";

    await requestExists.save();

    const chat = await Chat.create({
        user1Id: requestExists.user1Id,
        user2Id: requestExists.user2Id,
        friendshipId: requestExists.id
    });

    const otherUser = await User.findByPk(requestExists.user2Id, {
        attributes: ['id', 'name'],
        include: [{
            model: Course,
            attributes: ['id', 'name']
        }]
    });

    const currentUser = await User.findByPk(requestExists.user1Id, {
        attributes: ['id', 'name'],
        include: [{
            model: Course,
            attributes: ['id', 'name']
        }]
    });

    sendToUser(requestExists.user1Id, {
        event: 'newChat',
        chat: {
            id: chat.id,
            friendshipId: requestExists.id,
            otherUser
        }
    });

    sendToUser(requestExists.user2Id, {
        event: 'newChat',
        chat: {
            id: chat.id,
            friendshipId: requestExists.id,
            otherUser: currentUser
        }
    })

    return { message: "Solicitação de amizade aceita!" }
}

async function rejectFriendRequest(userId, friendshipId) {
    const requestExists = await Friendship.findOne({
        where: {
            id: friendshipId
        }
    });

    if (!requestExists) {
        const error = new Error("Pedido de amizade inexistente!");
        error.statusCode = 404;
        throw error;
    }

    if (requestExists.user2Id !== userId) {
        const error = new Error("Usuário inválido");
        error.statusCode = 403;
        throw error;
    }

    if (requestExists.status !== 'pending') {
        const error = new Error("Amizade já aceita!");
        error.statusCode = 409;
        throw error;
    }

    requestExists.status = "rejected";

    await requestExists.save();

    return {
        message: "Solicitação de amizade recusada!"
    }
}


async function deleteFriendship(userId, friendshipId) {
    const friendship = await Friendship.findByPk(friendshipId);

    if (!friendship) {
        const error = new Error("Amizade não encontrada!");
        error.statusCode = 404;
        throw error;
    }

    if (friendship.user1Id !== userId && friendship.user2Id !== userId) {
        const error = new Error("Usuário inválido!");
        error.statusCode = 403;
        throw error;
    }

    const chat = await Chat.findOne({
        where: {
            [Op.or]: [
                {
                    user1Id: friendship.user1Id,
                    user2Id: friendship.user2Id
                },
                {
                    user1Id: friendship.user2Id,
                    user2Id: friendship.user1Id
                }
            ]
        }
    });

    if (chat) {
        await Message.destroy({
            where: {
                chatId: chat.id
            }
        });

        await chat.destroy();
    }

    await friendship.destroy();

    sendToUser(friendship.user1Id, {
        event: "friendshipDeleted",
        friendshipId
    });

    sendToUser(friendship.user2Id, {
        event: "friendshipDeleted",
        friendshipId
    });

    return { message: "Amizade excluída com sucesso!" };
}


module.exports = { sendFriendRequest, acceptFriendRequest, getFriendshipRequests, rejectFriendRequest, deleteFriendship }