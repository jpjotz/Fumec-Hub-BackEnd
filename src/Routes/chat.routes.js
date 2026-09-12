const express = require('express');
const router = express.Router();

const authMiddleware = require('../Middlewares/authMiddleware');
const { createChat , getChatsByUser } = require('../Controllers/chatController');

router.use(authMiddleware);

/**
 * @swagger
 * /chats:
 *   get:
 *     summary: Retorna os chats do usuário autenticado
 *     tags: [Chats]
 *     parameters:
 *       - in: cookie
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de chats do usuário
 *       401:
 *         description: Usuário não autenticado ou token inválido
 */
router.get('/', getChatsByUser);

/**
 * @swagger
 * /chats/create:
 *   post:
 *     summary: Cria um novo chat
 *     tags: [Chats]
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
 *               - user2Id
 *             properties:
 *               user2Id:
 *                 type: integer
 *                 description: ID do usuário com quem o chat será criado
 *     responses:
 *       201:
 *         description: Chat criado com sucesso
 *       401:
 *         description: Usuário não autenticado ou token inválido
 */
router.post('/create', createChat);

module.exports = router;