module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', ({ room, name }) => {
      console.log(`${name} joined room: ${room}`);
      socket.join(room);
    });

    socket.on('videoOffer', ({ offer, room, userToCall, caller }) => {
      console.log('Video offer from:', caller, 'to:', userToCall);
      io.to(room).emit('videoOffer', { offer, caller, userToCall });
    });

    socket.on('videoAnswer', ({ answer, caller }) => {
      console.log('Video answer from:', socket.id, 'to:', caller);
      io.to(caller).emit('videoAnswer', { answer });
    });

    socket.on('iceCandidate', ({ candidate, room }) => {
      console.log('ICE candidate from:', socket.id);
      io.to(room).emit('iceCandidate', { candidate });
    });

    socket.on('callRejected', ({ caller }) => {
      console.log('Call rejected by:', socket.id);
      io.to(caller).emit('callRejected');
    });

    socket.on('callDisconnected', ({ room }) => {
      console.log('Call disconnected by:', socket.id);
      io.to(room).emit('callDisconnected');
    });

    socket.on('message', ({ message, room }) => {
      console.log('Message from:', message.user, 'in room:', room, 'text:', message.text);
      io.to(room).emit('message', message);
    });

    socket.on('file', ({ room, fileName, fileContent }) => {
      console.log('File received:', fileName, 'in room:', room);
      io.to(room).emit('file', { fileName, fileContent });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
};
