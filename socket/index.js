// socket/index.js

const socketIO = require('socket.io');

const socketServer = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinRoom', ({ room }) => {
      socket.join(room);
      console.log(`${socket.id} joined room ${room}`);
    });

    socket.on('videoOffer', (data) => {
      const { room, offer } = data;
      socket.to(room).emit('videoOffer', data);
    });

    socket.on('videoAnswer', (data) => {
      const { room, answer } = data;
      socket.to(room).emit('videoAnswer', data);
    });

    socket.on('iceCandidate', (data) => {
      const { room, candidate } = data;
      socket.to(room).emit('iceCandidate', data);
    });

    socket.on('callRejected', (data) => {
      const { room } = data;
      socket.to(room).emit('callRejected');
    });

    socket.on('callDisconnected', (data) => {
      const { room } = data;
      socket.to(room).emit('callDisconnected');
    });

    socket.on('sendMessage', (message) => {
      const { room } = message;
      socket.to(room).emit('receiveMessage', message);
    });

    socket.on('leaveRoom', ({ room }) => {
      socket.leave(room);
      console.log(`${socket.id} left room ${room}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};

module.exports = socketServer;
