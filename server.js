// server.js

const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');
const socketServer = require('./socket');
const cors = require('cors');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());
app.get('/protectedRoute', protect, (req, res) => {
    res.send('This route is protected and requires a valid token');
});
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

socketServer(server);
