function errorHandler(err, req, res, next) {
    const message = err.message || "Falha interna do servidor";
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message
    })
}

module.exports = errorHandler;