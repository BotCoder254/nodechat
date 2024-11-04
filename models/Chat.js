const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['direct', 'group'],
        required: true
    },
    name: {
        type: String,
        required: function() {
            return this.type === 'group';
        }
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function() {
            return this.type === 'group';
        }
    },
    lastMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    theme: {
        type: String,
        default: 'default'
    },
    notifications: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);