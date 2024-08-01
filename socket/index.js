const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('joinRoom', ({ room, user }) => {
    socket.join(room);
    socket.to(room).emit('joinRoomConfirmation', { user, room });
    console.log(`${user} joined ${room}`);
  });

  socket.on('videoCall', ({ offer, userToCall, caller, room }) => {
    socket.to(room).emit('videoOffer', { offer, caller, userToCall });
    console.log(`Sending video offer from ${caller} to ${userToCall}`);
  });

  socket.on('videoAnswer', ({ answer, caller }) => {
    io.to(caller).emit('videoAnswer', { answer });
    console.log(`Sending video answer from ${caller}`);
  });

  socket.on('newIceCandidate', ({ candidate, room }) => {
    socket.to(room).emit('newIceCandidate', { candidate });
    console.log('Sending new ICE candidate');
  });

  socket.on('message', (message) => {
    io.to(message.room).emit('message', message);
    console.log('Sending message:', message);
  });

  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id);
    console.log('User disconnected:', socket.id);
  });
});
