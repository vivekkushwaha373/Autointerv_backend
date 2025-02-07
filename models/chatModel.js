const mongoose = require('mongoose');
const crypto = require('crypto');

const chatSchema = new mongoose.Schema({
    role: {
        type: String,
        required:true,
    },
    content: {
        type: String,
        required:true
    }
})

module.exports = mongoose.model('Chat', chatSchema);