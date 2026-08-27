const express = require('express');
const router = express.Router();

const authMiddleware = require('../Middlewares/authMiddleware');
const { createChat , getChatsByUser } = require('../Controllers/chatController');

router.use(authMiddleware)

router.get('/', getChatsByUser);

router.post('/create', createChat);

module.exports = router