// .env

require('dotenv').config();

// Imports

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const sequelize = require('./Config/database');
const errorHandler = require('./Middlewares/errorHandler');
const http = require('http');
const initializeSocket = require('./Sockets/socket');

const userRoutes = require('./Routes/user.routes');
const authRoutes = require('./Routes/auth.routes');
const messageRoutes = require('./Routes/message.routes');
const chatRoutes = require('./Routes/chat.routes');
const friendshipRoutes = require('./Routes/friendship.routes');

// Variáveis

const app = express();
const PORT = process.env.PORT || 3000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    statusCode: 429,
    message: "Muitas requisições, favor aguardar"
});

// Web Socket

const server = http.createServer(app);

initializeSocket(server);

// Middlewares

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(limiter);

// Rotas

app.use('/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/messages', messageRoutes);
app.use('/chats', chatRoutes);
app.use('/friend', friendshipRoutes);

// Error Handler

app.use(errorHandler);

// Starter do banco de dados e servidor

sequelize.authenticate()
    .then(() => {
        console.log('Banco de Dados conectado!');

        return sequelize.sync();
    })

    .then(() => {
        console.log('Tabelas sincronizadas!')

        server.listen(PORT, () => {
            console.log("Servidor rodando!")
        });
    })

    .catch((error) => {
        console.error("Erro ao conectar ao banco de dados: ", error)
    })