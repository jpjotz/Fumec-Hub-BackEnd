const express = require('express');

const router = express.Router();

const { createMessage, getMessagesByChat } = require('../Controllers/messageController');

const authMiddleware = require('../Middlewares/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * /messages/{chatId}:
 *   get:
 *     summary: Retorna as mensagens de um chat
 *     tags: [Mensagens]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do chat
 *       - in: cookie
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Mensagens do chat retornadas com sucesso
 *       401:
 *         description: Usuário não autenticado ou token inválido
 */
router.get('/:chatId', getMessagesByChat);

/**
 * @swagger
 * /messages/create:
 *   post:
 *     summary: Cria uma nova mensagem
 *     tags: [Mensagens]
 *     parameters:
 *       - in: cookie
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - chatId
 *               - content
 *             properties:
 *               chatId:
 *                 type: integer
 *                 description: ID do chat onde a mensagem será enviada
 *               content:
 *                 type: string
 *                 description: Conteúdo da mensagem
 *     responses:
 *       201:
 *         description: Mensagem criada com sucesso
 *       401:
 *         description: Usuário não autenticado ou token inválido
 */
router.post('/create', createMessage);

module.exports = router;