module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    let currentRoom = null;
    let currentUser = null;

    socket.on('joinRoom', ({ room, user }) => {
      console.log(`${user} joined room: ${room}`);
      socket.join(room);
      currentRoom = room;
      currentUser = user;
      io.to(room).emit('joinRoomConfirmation', { user, room });
    });

    socket.on('videoOffer', ({ offer, userToCall, caller }) => {
      console.log('Video offer from:', caller, 'to:', userToCall);
      io.to(currentRoom).emit('videoOffer', { offer, caller, userToCall });
    });

    socket.on('videoAnswer', ({ answer, caller }) => {
      console.log('Video answer from:', socket.id, 'to:', caller);
      io.to(currentRoom).emit('videoAnswer', { answer, caller });
    });

    socket.on('newIceCandidate', ({ candidate, to }) => {
      console.log('ICE candidate from:', socket.id, 'to:', to);
      if (currentRoom) {
        io.to(currentRoom).emit('newIceCandidate', { candidate, from: socket.id, to });
      }
    });

    socket.on('endCall', ({ to }) => {
      console.log('End call request from:', socket.id, 'to:', to);
      if (currentRoom) {
        io.to(currentRoom).emit('callEnded', { from: socket.id, to });
      }
    });

    socket.on('rejectCall', ({ caller }) => {
      console.log('Call rejected by:', socket.id);
      io.to(currentRoom).emit('callRejected', { caller });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      if (currentRoom) {
        io.to(currentRoom).emit('user-disconnected', { user: currentUser });
      }
    });

    socket.on('message', ({ message }) => {
      console.log('Message from:', message.user, 'in room:', currentRoom, 'text:', message.text);
      if (currentRoom) {
        io.to(currentRoom).emit('message', message);
      }
    });

    socket.on('file', ({ fileName, fileContent }) => {
      console.log('File received:', fileName, 'in room:', currentRoom);
      if (currentRoom) {
        io.to(currentRoom).emit('file', { fileName, fileContent });
      }
    });
  });
};
