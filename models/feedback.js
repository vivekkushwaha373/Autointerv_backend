const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
    question: {
        type: String,
        require:true,
    },
    answer: {
        type: String,
        required:true,
    },
    isCorrect: {
        type: Boolean,
        required:true,
    },
    feedback: {
        type: String,
        required:true,
    }

})

module.exports = mongoose.model('Feedback',feedbackSchema);