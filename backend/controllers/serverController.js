const serverController = require("express-session");
const sessionMiddleware = serverController({
    secret: 'rdq4312iuh321hu143264hj',
    credentials: true,
    name: 'sid',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
        expires: 1000 * 60 * 60 * 24 * 7
    }
});

const wrap = (expressMiddleware) => (socket, next) => expressMiddleware(socket.request, {}, next);

const corsConfig = {
    origin: 'http://localhost:3000',
    credentials: true
};

module.exports = {sessionMiddleware, wrap, corsConfig};