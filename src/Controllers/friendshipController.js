const friendshipService = require('../Services/friendshipService');

async function getFriendshipRequests(req, res, next) {
    try {
        const userId = req.user.id;

        const requests = await friendshipService.getFriendshipRequests(userId);

        return res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
}

async function sendFriendRequest(req, res, next) {
    try {
        const user1Id = req.user.id;
        const { friendCode } = req.body;

        const newFriendshipRequest = await friendshipService.sendFriendRequest(user1Id, friendCode);

        return res.status(201).json(newFriendshipRequest);
    } catch (error) {
        next(error);
    }
}

async function acceptFriendRequest(req, res, next) {
    try {
        const userId = req.user.id;
        const { friendshipId } = req.params;

        const result = await friendshipService.acceptFriendRequest(userId, friendshipId);

        return res.status(200).json(result);
    } catch (error) {
        next(error);
    }
}

module.exports = { sendFriendRequest, acceptFriendRequest, getFriendshipRequests }