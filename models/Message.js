const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        room: { type: String, required: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        text: { type: String },
        fileUrl: { type: String },
    },
    { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;
