
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const Interview = require('../models/interview');
const OTP = require('../models/otpSchema');

require('dotenv').config();

exports.getAllUsers = async (req, res) => {
    try {
        //get all users
        const users = await User.find({});
        return res.status(200).json({
            success: true,
            message: "All users fetched",
            users
        })
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message:`Internal Server Error, ${error.message}`
        })
    }
}


exports.getAllinterview = async (req, res) => {
    try {
        const id = req.user.id;
        if (!id) {
            return res.status(400).json({
                success: false,
                message:"User Not Authenticated"
            })
        }
        const existingUser = await User.findById(id).populate('interview');
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message:"User not Found"
            })
        }
        const interviewData = existingUser.interview;

        return res.status(200).json({
            success: true,
            message: "Fetched all interviews",
            interviewData,
        })


    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })     
    }
}

exports.deleteInterview = async (req, res) => {
    try {
        const { email, jobrole, jobdescription } = req.boby;
        if (!email || !jobrole || !jobdescription) {
            return res.status(400).json({
                success: false,
                message: 'Invalid entry'
            })
        }
        await Interview.findOneAndDelete({ email, jobrole, jobdescription });
        

        return res.status(200).json({
            success: true,
            message: "Interview Deleted"
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })       
    }
}

exports.getfeedback = async (req, res) => {
    try {
        const { email, jobrole, jobdescription } = req.boby;
        if (!email || !jobrole || !jobdescription) {
            return res.status(400).json({
                success: false,
                message:'Invalid entry'
            })
        }
        const isfeedback = await Interview.findOne({ email, jobrole, jobdescription }).populate('feedback');
        if (!isfeedback) {
            return res.status(400).json({
                success: false,
                message:"No feedback found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "Feedback fetched",
            isfeedback,
        })
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message:"Internal Server Error"
           })        
    }
}


exports.getAllfeedback = async (req, res) => {
    try {
        
    }
    catch (error) {
        
    }
}


exports.userSignUp = async (req, res) => {
    try {
        //fetch data from the user
        const {firstname, lastname, email, password, otp} = req.body;
        //validate data from the user
        //It is the work of middleware

        //if Entry is already present in DB
        const userDetails = await User.find({ email });
        // console.log(userDetails.size()==0);
        if (userDetails.length>0) {
            return res.status(404).json({
                success: false,
                message: "Cannot signUp Again"
            });
        }
        
        

        const latestOtpEntry = await OTP.findOne({ email }).sort({ createdAt: -1 }).exec();
        
        if (!latestOtpEntry) {
            return res.status(400).json(
                {
                    success: false,
                    message:"Otp not Found or Expired"
                }
            )
        }
       
        if (latestOtpEntry.otp != otp) {
            return res.status(400).json({
                success: false,
                message:"Enter the Correct OTP"
            })
        }
     
       

        //We will hash the password before saving entries in the DataBase
        let hashPassword;
        try {
            hashPassword = await bcrypt.hash(password, 10);
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                message:"Error in Hashing Password",
            })
        }
        
        
        let logo;


        const user = await User.create({
            firstname, lastname, email, password: hashPassword
        })
        return res.status(200).json({
            success: true,
            message: "User Is registered",
            user,
            
        })
    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
    
}

exports.userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email}).populate("chats");
        if (!user) {
            return res.status(401).json({
                success: false,
                message:"User Is Not Registered",
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(403).json({
                success: false,
                message: "Enter the Right Password",
                
            })
        }
        
        res.clearCookie("token", {
            httpOnly: true,
            signed: true,
            // path: "/",
            secure: true,   // Required for HTTPS (Vercel)
            sameSite: "None"
        });

        const payload = {
            id: user._id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            
        }

        let token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        user.token = token;
        user.password = undefined;
        
        const options = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            signed: true,
            secure:true,
            //   // Required for HTTPS (Vercel)
            sameSite: "None",
           
            // path:"/"
        }
          
        res.cookie("token", token, options);
         
        return res.status(200).json({
            success: true,
            message: "User is SuccessFully LoggedIn",
            user,
            token,
        })

    }
    catch (error) {
        console.log("login error",error.message);
        return res.status(500).json({
            success: false,
            message:`Internal Server Error, ${error.message}`,
        })
    }
}

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        //email validator will handle the validation

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email doesn't exist"
            })
        }

        const token = crypto.randomUUID();

        const updatedUser = await User.findOneAndUpdate({ email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000
            },
            { new: true })

        const url = `http://localhost:3000/resetpassword/${token}`

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
                subject: 'Password Reset Link',
                text: `Password reset link: ${url}`,
            }
        )

        return res.status(200).json({
            success: true,
            message: 'Reset link sent'
        })
    
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Something went wrong while sending reset password mail'
        })
    }
}

exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmpassword, token } = req.body;
        if (!token) {
            return res.status(400).json({
                success: false,
                message:"Please Enter the correct details"
            })
        }
        const user = await User.findOne({ token });
        if (!user) {
            return res.status(400).json({
                success: false,
                message:"User Not Found"
            })
        }
        
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(401).json({
                success: false,
                message:"Your Token is expired"
            })
        }

        if (confirmpassword != password) {
            return res.status(400).json({
                success: false,
                message:"Password and confirm password field is not matched",
            })
        }

        //hash the password
        const hashedpassword = await bcrypt.hash(password,10);

        
        //update the password field in DB
        const UpdatedUser=await User.findOneAndUpdate({ token }, {
            password: hashedpassword
        }, { new: true })
        //return successful response
        return res.status(200).json(
            {
                success: false,
                message:"Password reset successfully"
            }
        )

    }
    catch (error) {
        return res.status().json({
            success: true,
            message: "Internal Server error" + error.message,
        })
    }
}


exports.changepassword = async (req, res) => {
    try {
        const {oldpass,newpass, confirmpass} = req.body;
        
        //email validator will validate the email field

        // if (!newpassword || !confirmpassword || !oldpassword)
        // {
        //     return res.status(400).json({
        //         success: false,
        //         message:"invalid Entry Error",
        //     })
        // }
        
        const userid = req.user.id;

        const existingUser = await User.findOne({ _id:userid });
        
        if (!existingUser) {
            return res.status(400).json({
                success: false,
                massage:"User Not Found"
            })
        }
        
        if (newpass != confirmpass) {
            return res.status(400).json({
                success: false,
                message:"New Passeord and confirm password doesn't match"
            })
        }

        const isMatch = await bcrypt.compare(oldpass, existingUser.password);
        
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message:"Current password is incorrect",
            })
        }
          
        //hash the password
        const hashedpassword = await bcrypt.hash(newpass, 10); 
       
        //update the password in DB
        existingUser.password = hashedpassword;
        
        //update db
        await existingUser.save();
        
        //return successful response
        return res.status(200).json({
            success: true,
            message:"Password changed successfully",
        })



    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
}

// controller.js

exports.logout = (req, res) => {
    try {
        // Clear the cookie named 'token'
        res.clearCookie("token", {
            httpOnly: true,
            signed: true,
            // path: "/",
            secure: true,   // Required for HTTPS (Vercel)
            sameSite: "None"
        });

        // Send a success response
        return res.status(200).json({
            success: true,
            message: 'You have been logged out, cookie cleared',
        });
    } catch (error) {
        // Handle any potential errors
        console.error('Error clearing cookie:', error);

        // Send an error response
        return res.status(500).json({
            success: false,
            message: 'An error occurred while logging out',
        });
    }
};

exports.changeprofile = async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        //validate using validator
        const id = req.user.id;

        const user = await User.findByIdAndUpdate(id, {
            firstname,
            lastname,
            email
        }, { new: true });
        
        return res.status(200).json({
            success: true,
            message: "Profile is successfully updated",
            user
        })

        

    }
    catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message:"Internal Server error"
        })
    }
}
