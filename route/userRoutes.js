const express = require('express');
const router = express.Router();
const { validateSignup, validateLogIn,validateOTP,validateReset,validateChange, validateProfile} = require('../middleware/validation');
const { auth } = require('../middleware/auth');
const { getAllUsers, userSignUp, userLogin, logout, forgotPassword, resetPassword, changepassword, changeprofile } = require('../controllers/usercontroller');
const { sendOTP } = require('../controllers/otpSender');

router.get('/getAllUsers', getAllUsers);
router.post('/signup', validateSignup, userSignUp);
router.post('/sendotp', validateOTP, sendOTP);
router.post('/login', validateLogIn, userLogin);
router.get('/logout', logout);
router.get('/auth', auth, (req,res) => {
    const user = req.user;
    
    return res.status(200).json({
        success: true,
        message: "User is autenticated, token verified",
        user,
     })
    
});
router.post('/forgetpassword', validateOTP, forgotPassword);
router.post('/resetpassword', validateReset, resetPassword);
router.post('/changepassword', validateChange, auth, changepassword);
router.post('/changeprofile', validateProfile, auth, changeprofile);

module.exports = router;