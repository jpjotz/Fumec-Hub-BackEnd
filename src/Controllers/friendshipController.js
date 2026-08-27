const friendshipService = require('../Services/friendshipService');

async function sendFriendRequest(req, res, next) {
    try {
        const user1Id = req.user.id;
        const { user2Id } = req.body;

        const newFriendshipRequest = await friendshipService.sendFriendRequest(user1Id, user2Id);

        return res.status(201).json(newFriendshipRequest);
    } catch (error) {
        next(error);
    }
}

module.exports = { sendFriendRequest }