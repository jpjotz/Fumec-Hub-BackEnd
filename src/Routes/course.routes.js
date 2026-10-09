const express = require('express');
const router = express.Router();

const courseController = require('../Controllers/courseController');

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Lista todos os cursos disponíveis
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Lista de cursos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     format: uuid
 *                   name:
 *                     type: string
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/', courseController.getCourses);

module.exports = router;