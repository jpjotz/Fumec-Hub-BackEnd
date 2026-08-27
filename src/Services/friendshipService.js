const Friendship = require('../Models/Friendship');
const Chat = require('../Models/Chat');
const { Op } = require('sequelize');

async function sendFriendRequest(userId, friendId) {
    const isFriends = await Friendship.findOne({
        where: {
            [Op.or]: [
                {
                    user1Id: userId,
                    user2Id: friendId
                },

                {
                    user1Id: friendId,
                    user2Id: userId
                }
            ]
        }
    });

    if (isFriends) {
        const error = new Error("Amizade já existente");
        error.statusCode = 409;
        throw error;
    }

    const newFriendshipRequest = await Friendship.create({
        user1Id: userId,
        user2Id: friendId
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

    if(requestExists.status !== 'pending') {
        const error = new Error("Amizade já aceita");
        error.statusCode = 409;
        throw error;
    }

    requestExists.status = "accepted";

    await requestExists.save();

    const chat = await Chat.create({
        user1Id: requestExists.user1Id,
        user2Id: requestExists.user2Id

    })

    return {message: "Solicitação de amizade aceita!"}
}

module.exports = { sendFriendRequest, acceptFriendRequest }