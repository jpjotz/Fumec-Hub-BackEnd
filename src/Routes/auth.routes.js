const express = require('express');
const router = express.Router();

const { login, refreshToken, logout } = require('../Controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Realiza o login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 */

router.post('/login', login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Renova o token de acesso
 *     tags: [Autenticação]
 *     parameters:
 *       - in: cookie
 *         name: refreshToken
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Token de acesso renovado com sucesso
 */

router.post('/refresh', refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Realiza logout do usuário no sistema
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Logout realizado com sucesso
 */

router.post('/logout', logout)

module.exports = router;