const authService = require('../Services/authService');

async function login(req, res, next) {
    try {
        const tokens = await authService.login(req.body);
        res.cookie('accessToken', tokens.accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });
        res.cookie('refreshToken', tokens.refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.status(200).json({
            message: "Login realizado com sucesso!"
        })
    } catch (error) {
        next(error);
    }
}

function refreshToken(req, res, next) {
    try {
        const refreshToken = req.cookies.refreshToken;
        const newAccessToken = authService.refreshToken(refreshToken);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000
        });

        return res.status(200).json({
            message: "Token renovado com sucesso!"
        });

    } catch (error) {
        next(error);
    }
}

function logout(req, res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.status(200).json({
        message: "Logout realizado com sucesso"
    })
}

module.exports = { login, refreshToken, logout }