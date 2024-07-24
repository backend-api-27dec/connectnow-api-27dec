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
      // Example: handling the 'sendMessage' event
socket.on('sendMessage', async ({ room, userId, text, fileUrl }) => {
    try {
        const message = new Message({ room, userId, text, fileUrl });
        await message.save();
        io.to(room).emit('message', message);
    } catch (error) {
        console.error('Error saving message:', error);
    }
});


        socket.on('videoOffer', (data) => {
            const { room, offer, caller } = data;
            console.log('Received video offer from:', caller, 'in room:', room);
            socket.to(room).emit('videoOffer', { offer, caller });
        });

        socket.on('videoAnswer', (data) => {
            const { room, answer } = data;
            console.log('Received video answer in room:', room);
            socket.to(room).emit('videoAnswer', { answer });
        });

        socket.on('iceCandidate', (data) => {
            const { room, candidate } = data;
            console.log('Received ICE candidate in room:', room);
            socket.to(room).emit('iceCandidate', { candidate });
        });

        socket.on('callRejected', (data) => {
            const { room } = data;
            console.log('Call rejected in room:', room);
            socket.to(room).emit('callRejected');
        });

        socket.on('callDisconnected', (data) => {
            const { room } = data;
            console.log('Call disconnected in room:', room);
            socket.to(room).emit('callDisconnected');
        });
    });
};

module.exports = socketServer;
