const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();
exports.openai = () => {

    const config = new GoogleGenerativeAI(process.env.OPEN_AI_KEY);
    return config;
};

