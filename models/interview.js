const mongoose = require('mongoose');
const interviewSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required:true,   
        },
        jobrole: {
            type: String,
            require:true,
        },
        jobdescription: {
            type: String,
            required:true,
        },
        experience: {
            type: Number,
            require:true,
        },
        feedback: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Feedback"
            }
        ],       
    }
)

module.exports = mongoose.model('Interview',interviewSchema)