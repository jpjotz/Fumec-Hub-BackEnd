const express = require('express');
const router = express.Router();

const authMiddleware = require('../Middlewares/authMiddleware');

const { createUser, getProfile, editProfile, changePassword } = require('../Controllers/userController');

router.get('/me', authMiddleware, getProfile )

router.post('/register', createUser);

router.patch('/me', authMiddleware, editProfile)
router.patch('/me/password', authMiddleware, changePassword);

module.exports = router;