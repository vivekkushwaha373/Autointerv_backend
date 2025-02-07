const mongoose = require('mongoose');
const userSchema=new mongoose.Schema({
    firstname: {
        type: String,
        required:true,
    },
    lastname: {
        type: String,
        required:true,
    },
    logo: {
        type:String,
    },
    email: {
        type: String,
        required: true,
        unique:true,
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type:String
    },
    resetPasswordExpires: {
        type:String
    },
    chats: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"Chat"
        }
    ],
    interview: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'Interview'
        }
    ]
})
 
module.exports = mongoose.model('User', userSchema);