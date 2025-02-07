const express = require('express');
const { auth } = require('../middleware/auth');
const { generateChatCompletion,deleteAllUserChats,setMychat} = require('../controllers/chatcontroller');
const router = express.Router();
const { chatCompletionvalidator } = require("../middleware/validation");
router.post('/new',auth,chatCompletionvalidator,generateChatCompletion);
router.delete('/deletechat', auth, deleteAllUserChats);
router.post('/setchat', auth, setMychat);
module.exports = router;