const nodemailer = require('nodemailer');
const crypto = require('crypto');
const OTP = require('../models/otpSchema');

require('dotenv').config();

const generateOTP = ()=> {
    return crypto.randomInt(100004, 999999).toString();
   
}


exports.sendOTP = async (req, res) => {
    
    try {
        const { email } = req.body;
        
        let otp = generateOTP();

        let transporter = nodemailer.createTransport(
            {
                host: process.env.MAIL_HOST,
                auth: {
                    user: process.env.MAIL_USER,
                    pass: process.env.MAIL_PASS,
                }
            }
        )
      

        await transporter.sendMail(
            {
                from: 'APNA AI | ViveK Kushwaha',
                to: email,
                subject: 'YOUR OTP CODE',
                text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
            }
        )
        
        const createdOTP = await OTP.create({
            otp,
            email
        })

        return res.status(200).json({
            success: true,
            message:"OTp is successfully sent on your email",
        })
                
    }
    catch (error) {
        console.log(error?.message);
        return res.status(500).json({
            success: false,
            message:"Error sending OTP from server end",
        })
    }

}