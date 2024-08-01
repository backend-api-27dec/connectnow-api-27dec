module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Store user info
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
      // Emit the offer to the specific user
      socket.to(userToCall).emit('videoOffer', { offer, caller, userToCall });
    });

    socket.on('videoAnswer', ({ answer, caller }) => {
      console.log('Video answer from:', socket.id, 'to:', caller);
      // Emit the answer to the specific caller
      socket.to(caller).emit('videoAnswer', { answer, caller });
    });

    socket.on('newIceCandidate', ({ candidate }) => {
      console.log('ICE candidate from:', socket.id);
      io.to(currentRoom).emit('newIceCandidate', { candidate });
    });

    socket.on('rejectCall', ({ caller }) => {
      console.log('Call rejected by:', socket.id);
      socket.to(caller).emit('callRejected', { caller });
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      io.to(currentRoom).emit('user-disconnected');
    });

    socket.on('message', ({ message }) => {
      console.log('Message from:', message.user, 'in room:', currentRoom, 'text:', message.text);
      io.to(currentRoom).emit('message', message);
    });

    socket.on('file', ({ fileName, fileContent }) => {
      console.log('File received:', fileName, 'in room:', currentRoom);
      io.to(currentRoom).emit('file', { fileName, fileContent });
    });
  });
};
