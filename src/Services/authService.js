const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

function generateTokens(user) {
    const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
    }

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

    return { accessToken, refreshToken }

}

async function login(data) {
    const { email, password } = data;

    if (!email || !password) {
        const error = new Error("Credenciais incompletas");
        error.statusCode = 400;
        throw error;
    }

    const user = await User.findOne({
        where: {
            email
        }

    });

    if (!user) {
        const error = new Error("Credenciais inválidas");
        error.statusCode = 401;
        throw error;
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        const error = new Error("Credenciais inválidas");
        error.statusCode = 401;
        throw error;
    }

    return generateTokens(user);
}

function refreshToken(refreshToken) {
    if (!refreshToken) {
        const error = new Error("Token não enviado");
        error.statusCode = 400;
        throw error;
    }

    try {
        const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const newAccessToken = jwt.sign({
            id: payload.id,
            name: payload.name,
            email: payload.email
        }, process.env.JWT_SECRET, { expiresIn: '15m' });

        return newAccessToken;
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            error.statusCode = 401;
            error.message = "Refresh token expirado";
        } else if (error.name === "JsonWebTokenError") {
            error.statusCode = 401;
            error.message = "Refresh token inválido";
        }

        throw error;
    }
}

module.exports = { login, refreshToken, generateTokens }