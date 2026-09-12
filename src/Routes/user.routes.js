const express = require('express');
const router = express.Router();

const authMiddleware = require('../Middlewares/authMiddleware');

const { createUser, getProfile, editProfile, changePassword } = require('../Controllers/userController');

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Retorna o perfil do usuário autenticado
 *     tags: [Usuários]
 *     parameters:
 *       - in: cookie
 *         name: accessToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Perfil do usuário retornado com sucesso
 *       401:
 *         description: Usuário não autenticado ou token inválido
 */

router.get('/me', authMiddleware, getProfile );

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Cria um novo usuário
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Dados obrigatórios ausentes, e-mail institucional inválido ou senha muito curta
 *       409:
 *         description: E-mail já registrado
 */

router.post('/register', createUser);

/**
 * @swagger
 * /users/me:
 *   patch:
 *     summary: Edita o perfil do usuário autenticado
 *     tags: [Usuários]
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
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Nome alterado com sucesso
 *       401:
 *         description: Usuário não autenticado ou token inválido
 *       404:
 *         description: Usuário não encontrado
 */

router.patch('/me', authMiddleware, editProfile);

/**
 * @swagger
 * /users/me/password:
 *   patch:
 *     summary: Altera a senha do usuário autenticado
 *     tags: [Usuários]
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
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *       400:
 *         description: Nova senha muito curta
 *       401:
 *         description: Usuário não autenticado ou token inválido
 *       403:
 *         description: Senha atual incorreta
 *       404:
 *         description: Usuário não encontrado
 */

router.patch('/me/password', authMiddleware, changePassword);

module.exports = router;