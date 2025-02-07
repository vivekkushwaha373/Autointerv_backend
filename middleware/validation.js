const { body, validationResult } = require('express-validator');

const validateOTP = [

    body('email')
        .isEmail().withMessage('Please provide a valid email'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('error in validation');
            return res.status(400).json({
                message: 'Please provide a valid email',
                errors: errors.array()
            });
        }
        next();
    }
];


const chatCompletionvalidator = [
    body('message').notEmpty().withMessage('Message is Required'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(
            {
                message:"Message is required",
                errors: errors.array()
            });
        }
        next();
    }
]


const validateLogIn = [
    
    body('email')
        .isEmail().withMessage('Please provide a valid email'),

    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message:"Password must be at least 8 characters| Email should be valid",
                errors: errors.array() 
                
            });
        }
        next(); 
    }
];
const validateReset = [
    
    

    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    
    body('confirmpassword')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message:"Password must be at least 8 characters long",    
                errors: errors.array() 
            });
        }
        next(); 
    }
];
const validateChange = [
    

    

    body('oldpass')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('newpass')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    body('confirmpass')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
    

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message:"Password must be atleat 8 characters long",
                errors: errors.array()
            });
        }
        next(); 
    }
];




const validateSignup = [
    body('firstname')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
    body('lastname')
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),

    ...validateLogIn
];

const validateProfile = [
   
    body('firstname')
        .notEmpty().withMessage('First Name is required')
        .isLength({ min: 3 }).withMessage('First Name must be at least 3 characters long'),
    
    body('lastname')
        .notEmpty().withMessage('Last Name is required')
        .isLength({ min: 3 }).withMessage('Last Name must be at least 3 characters long'),

    body('email')
        .isEmail().withMessage('Please provide a valid email'),

    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message:"Please provide a valid email",
                errors: errors.array()
            });
        }
        next();
    }
];

module.exports = { validateSignup, validateLogIn, validateOTP, chatCompletionvalidator, validateReset, validateChange,validateProfile };
