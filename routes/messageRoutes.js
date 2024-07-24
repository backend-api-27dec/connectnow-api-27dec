// routes/messageRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getMessages, uploadFile } = require('../controllers/messageController');

router.route('/:room').get(protect, getMessages);
router.route('/').post(protect, sendMessage);
router.route('/upload').post(protect, uploadFile);

module.exports = router;
