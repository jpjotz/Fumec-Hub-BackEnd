const express = require('express');
const router = express.Router();

const { sendFriendRequest, acceptFriendRequest, getFriendshipRequests, rejectFriendRequest } = require('../Controllers/friendshipController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/requests', getFriendshipRequests);

router.post('/new', sendFriendRequest);

router.patch("/accept/:friendshipId", acceptFriendRequest);
router.patch("/reject/:friendshipId", rejectFriendRequest);

module.exports = router;