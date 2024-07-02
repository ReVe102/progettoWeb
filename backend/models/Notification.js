const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    message: String,
    timestamp: { type: Date, default: Date.now },
    receiverId: mongoose.Schema.Types.ObjectId,
    senderName: String,
    senderId: mongoose.Schema.Types.ObjectId
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
