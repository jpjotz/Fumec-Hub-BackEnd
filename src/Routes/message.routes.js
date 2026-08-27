const express = require('express');
const router = express.Router();

const { createMessage, getMessagesByChat } = require('../Controllers/messageController');
const authMiddleware = require('../Middlewares/authMiddleware');

application.use(authMiddleware);

router.get('/:chatId', getMessagesByChat);

router.post('/create', createMessage)

module.exports = router;