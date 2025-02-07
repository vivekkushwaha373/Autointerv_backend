const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { getQuestion, interviewSubmission, getInterview,deleteInterview} = require('../controllers/interviewcontroller');

router.post('/getquestion', auth, getQuestion);
router.post('/interviewSubmission', auth, interviewSubmission);
router.get('/getinterview', auth, getInterview);
router.delete('/deletefeedback', auth, deleteInterview);
module.exports = router;