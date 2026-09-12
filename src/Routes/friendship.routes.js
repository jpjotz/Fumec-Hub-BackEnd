const express = require('express');

const router = express.Router();

const {
    sendFriendRequest,
    acceptFriendRequest,
    getFriendshipRequests,
    rejectFriendRequest
} = require('../Controllers/friendshipController');

const authMiddleware = require('../Middlewares/authMiddleware');

router.use(authMiddleware);

/**
 * @swagger
 * /friends/requests:
 *   get:
 *     summary: Retorna os pedidos de amizade recebidos
 *     tags: [Amizades]
 *     parameters:
 *       - in: cookie
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pedidos de amizade retornados com sucesso
 *       401:
 *         description: Usuário não autenticado ou token inválido
 */
router.get('/requests', getFriendshipRequests);

/**
 * @swagger
 * /friends/new:
 *   post:
 *     summary: Envia um novo pedido de amizade
 *     tags: [Amizades]
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
 *               - friendCode
 *             properties:
 *               friendCode:
 *                 type: string
 *                 description: Código de amizade do usuário que receberá o pedido
 *     responses:
 *       201:
 *         description: Solicitação enviada com sucesso
 *       401:
 *         description: Usuário não autenticado ou token inválido
 *       404:
 *         description: Nenhum usuário encontrado
 *       409:
 *         description: Usuário não pode adicionar a si mesmo ou amizade já existente
 */
router.post('/new', sendFriendRequest);

/**
 * @swagger
 * /friends/accept/{friendshipId}:
 *   patch:
 *     summary: Aceita um pedido de amizade
 *     tags: [Amizades]
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido de amizade
 *       - in: cookie
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitação de amizade aceita com sucesso
 *       401:
 *         description: Usuário não autenticado ou token inválido
 *       403:
 *         description: Usuário não autorizado a aceitar este pedido
 *       404:
 *         description: Pedido de amizade inexistente
 *       409:
 *         description: Amizade já aceita
 */
router.patch("/accept/:friendshipId", acceptFriendRequest);

/**
 * @swagger
 * /friends/reject/{friendshipId}:
 *   patch:
 *     summary: Recusa um pedido de amizade
 *     tags: [Amizades]
 *     parameters:
 *       - in: path
 *         name: friendshipId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido de amizade
 *       - in: cookie
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solicitação de amizade recusada com sucesso
 *       401:
 *         description: Usuário não autenticado ou token inválido
 *       403:
 *         description: Usuário não autorizado a recusar este pedido
 *       404:
 *         description: Pedido de amizade inexistente
 *       409:
 *         description: Pedido de amizade não está pendente
 */
router.patch("/reject/:friendshipId", rejectFriendRequest);

module.exports = router;