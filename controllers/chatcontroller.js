
const { openai } = require('../config/openAi');
const User = require("../models/userModel");
const Chat  = require('../models/chatModel');

exports.generateChatCompletion = async (req, res) => {
    try {
        const { message } = req.body;
        let id = req.user.id;
        const newchat = await Chat.create({
            role: "user",
            content: message
        });
        let user = await User.findByIdAndUpdate(id,{$push:{chats:newchat._id}},{new:true}).populate('chats');
        
        
        //grab all the chats of the user
        // chats.push(newchat);
        let history = [];
        if (user.chats.length > 0)
        {
            history = user.chats.map(({ role, content }) => ({
                role: role === 'user' ? 'user' : 'model',  // Gemini expects "model" instead of "assistant"
                parts: [{ text: content }]
            }));
        }

        

        //send all chats with new one to openAI API
        const config = openai();
        
        
        // const model = config.getGenerativeModel({ model: "gemini-1.5-flash" });
        // const model = config.getGenerativeModel({ model: "gemini-exp-1114" });
        const model = config.getGenerativeModel({ model: process.env.GEMINI_MODEL});
        const chat = model.startChat({ history });
        //reply by openAi
        

        let result = await chat.sendMessage(message);
        const assistantReply = result.response.text();
        
          
        //Save the AI's reply to the Chat schema
        const aiMessage = new Chat({
            role: 'assistant',
            content: assistantReply,
        });

       
        await aiMessage.save();

        user.chats.push(aiMessage._id);
        await user.save();

        

        return res.status(200).json(
            {
                success: true,
                message: "Message read Reply sent",
                data: assistantReply,
            }
        )
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message:"Server Error, Couldn't fullfil the request",   
        })
    }
}

exports.deleteAllUserChats = async (req, res) => {
    try {
        const userId = req.user.id; // Get the user ID

        // Find the user and get all chat references
        const user = await User.findById(userId).populate('chats');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Delete all chats associated with the user
        await Chat.deleteMany({ _id: { $in: user.chats } });

        // Clear user's chat array
        user.chats = [];
        await user.save();

        return res.status(200).json({
            success: true,
            message: "All user chats have been deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting user chats:", error);
        return res.status(500).json({
            success: false,
            message: "Server Error. Couldn't delete chats.",
        });
    }
};

exports.setMychat = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).populate("chats");
        
        const chat = user.chats;
        return res.status(200).json({
            success: true,
            message: "DB chat is collected",
            chat
        })

    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: true,
            message: `Server Error: Couldn't fetch data from databas`
        })
    }
}