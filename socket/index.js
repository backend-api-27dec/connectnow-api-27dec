module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('joinRoom', ({ room, user }) => {
      console.log(`${user} joined room: ${room}`);
      socket.join(room);
      io.to(room).emit('userJoined', { user, id: socket.id });
    });

    socket.on('videoOffer', ({ offer, room, userToCall }) => {
      console.log('Video offer from:', socket.id, 'to:', userToCall);
      io.to(room).emit('videoOffer', { offer, caller: socket.id, userToCall });
    });

    socket.on('videoAnswer', ({ answer, room, caller }) => {
      console.log('Video answer from:', socket.id, 'to:', caller);
      io.to(caller).emit('videoAnswer', { answer, answerer: socket.id });
    });

    socket.on('iceCandidate', ({ candidate, room, target }) => {
      console.log('ICE candidate from:', socket.id);
      io.to(target).emit('iceCandidate', { candidate, from: socket.id });
    });

    socket.on('callRejected', ({ room, caller }) => {
      console.log('Call rejected by:', socket.id);
      io.to(caller).emit('callRejected');
    });

    socket.on('callDisconnected', ({ room }) => {
      console.log('Call disconnected by:', socket.id);
      io.to(room).emit('callDisconnected');
    });

    socket.on('message', ({ room, user, text }) => {
      console.log('Message from:', user, 'in room:', room, 'text:', text);
      io.to(room).emit('message', { user, text });
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
