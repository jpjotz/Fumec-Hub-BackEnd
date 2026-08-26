const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    try {
        const accessToken = req.cookies.accessToken;

        if (!accessToken) {
            const error = new Error("Não autenticado");
            error.statusCode = 401;
            throw error;
        }

        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {
        if (error.name === "TokenExpiredError") {
            error.statusCode = 401;
            error.message = "Token expirado";
        }

        if (error.name === "JsonWebTokenError") {
            error.statusCode = 401;
            error.message = "Token inválido";
        }

        next(error);
    }
}

module.exports = authMiddleware;