const authorizeUser = (socket, next) => {
    if (!socket.request.session || !socket.request.session.user) {
        next(new Error('Вы не авторизовались'));
    } else {
        next();
    }
};

const initializeUser = (socket) => {
    socket.user = {...socket.request.session.user};
    socket.users = socket.request.session.users;
    console.log(socket.users)
    socket.users?.forEach(({userName}) => {
        const roomId = [socket.user.userName, userName].sort().join('-with-');
        socket.join(roomId);
    });

};

const handleNewUser = async (io, data) => {
    /*const sockets = await io.fetchSockets();
    sockets.forEach(socket => {
        console.log(socket.user.userName)
        const roomId = [socket.user.userName, data.userName].sort().join('-with-');
        socket.join(roomId);
    });*/
    io.emit('welcome new user', {
        userName: data.userName
    });
};


const handleNewMessage = (socket, data) => {
    socket.to(data.roomId).emit('new message', data.message);
};

const handleDisconnect = (io, socket) => {
    socket.users?.forEach(user => {
        const roomId = [socket.user.userName, user].sort().join('-with-');
        socket.leave(roomId);
    });

    io.emit('user leave', {
        userName: socket.user.userName
    });
}

module.exports = {authorizeUser, initializeUser, handleNewUser, handleNewMessage, handleDisconnect};