const express = require('express');
const app = express();
const server = require('http').createServer(app);
const helmet = require('helmet');
const cors = require('cors');
const {sessionMiddleware, wrap, corsConfig} = require('./controllers/serverController');
const authRouter = require('./routers/authRouter');
const messageRouter = require('./routers/messageRouter');
const {Server} = require('socket.io');
const io = new Server(server, {cors: corsConfig});
const {
    authorizeUser,
    initializeUser,
    handleNewUser,
    handleNewMessage,
    handleDisconnect
} = require('./controllers/socketController');

app.use(helmet());
app.use(cors(corsConfig));
app.use(express.json());
app.use(sessionMiddleware);

app.use('/auth', authRouter);
app.use('/messages', messageRouter);

io.use(wrap(sessionMiddleware));
io.use(authorizeUser);

io.on('connection', async (socket) => {
    initializeUser(socket);
    const sockets = await io.fetchSockets();
    sockets.forEach(user => {
        const roomId = [socket.user.userName, user.user.userName].sort().join('-with-');
        user.join(roomId)
    });
    socket.on('new user',
        (data) => handleNewUser(io, data));
    socket.on('add message',
        (data) => handleNewMessage(socket, data));
    socket.on('disconnect',
        () => handleDisconnect(io, socket));
});

server.listen(8080,
    () => console.log(`Сервер запущен на 8080`));
