// controllers/messageController.js

const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');
const AWS = require('aws-sdk');
const multer = require('multer');

// AWS S3 Configuration
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 50000000 } }); // 50MB limit

const uploadToS3 = (file, folder) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${folder}/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read'
  };
  return s3.upload(params).promise();
};

// @desc    Send a message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { room, text } = req.body;
  const message = await Message.create({
    user: req.user._id,
    room,
    text
  });
  res.status(201).json(message);
});

// @desc    Get messages for a room
// @route   GET /api/messages/:room
// @access  Private
const getMessages = asyncHandler(async (req, res) => {
  const messages = await Message.find({ room: req.params.room }).populate('user', 'name');
  res.json(messages);
});

// @desc    Upload a file
// @route   POST /api/messages/upload
// @access  Private
const uploadFile = asyncHandler(async (req, res) => {
    upload.single('file')(req, res, async (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
  
      // Log req.file to debug
      console.log('File received:', req.file);
  
      const file = req.file;
      
      // Check if file is undefined
      if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      try {
        const result = await uploadToS3(file, 'chatFiles');
        res.status(201).json({ url: result.Location });
      } catch (uploadErr) {
        console.error('Error uploading to S3:', uploadErr);
        res.status(500).json({ error: 'Failed to upload file' });
      }
    });
  });
  
module.exports = { sendMessage, getMessages, uploadFile };
