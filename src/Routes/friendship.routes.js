const express = require('express');
const router = express.Router();

const { sendFriendRequest } = require('../Controllers/friendshipController');
const authMiddleware = require('../Middlewares/authMiddleware');

router.use(authMiddleware)

router.post('/new', sendFriendRequest);

module.exports = router;