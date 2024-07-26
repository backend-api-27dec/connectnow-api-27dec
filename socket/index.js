const socketio = require('socket.io');
const Message = require('../models/Message');

const socketServer = (server) => {
    const io = socketio(server, {
        cors: {
            origin: '*',
        },
    });

    io.on('connection', (socket) => {
        console.log('New connection:', socket.id);

        socket.on('joinRoom', ({ room }) => {
            socket.join(room);
            console.log('User joined room:', room);
        });
       socket.on('joinRoom', ({ room, user }) => {
    socket.join(room);
    console.log(`${user} joined room: ${room}`);
    io.to(room).emit('message', { user: 'admin', text: `${user} has joined!` });
  });

  socket.on('leaveRoom', ({ room, user }) => {
    socket.leave(room);
    console.log(`${user} left room: ${room}`);
    io.to(room).emit('message', { user: 'admin', text: `${user} has left.` });
  });

  socket.on('videoOffer', ({ offer, room, caller }) => {
    console.log('Video offer received:', offer);
    socket.to(room).emit('videoOffer', { offer, caller });
  });

  socket.on('videoAnswer', ({ answer, room }) => {
    console.log('Video answer received:', answer);
    socket.to(room).emit('videoAnswer', { answer });
  });

  socket.on('iceCandidate', ({ candidate, room }) => {
    console.log('ICE candidate received:', candidate);
    socket.to(room).emit('iceCandidate', { candidate });
  });

  socket.on('message', ({ message, room }) => {
    io.to(room).emit('message', message);
  });

  socket.on('file', ({ fileName, fileContent, room }) => {
    io.to(room).emit('file', { fileName, fileContent });
  });

        socket.on('callDisconnected', (data) => {
            const { room } = data;
            console.log('Call disconnected in room:', room);
            socket.to(room).emit('callDisconnected');
        });
    });
};

module.exports = socketServer;
