
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.auth = (req, res, next) => {
    try {
        //extract JWT token
        //other ways to fetch token is PENDING;
        const token = req.signedCookies['token'];

        if (!token || token == undefined) {
            return res.status(401).json({
                success: false,
                message: "token missing",
            })
        }

        //verify the token

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET)
            
            req.user = decode;
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: 'token is invalid',
            });
        }
        next();
    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "something went wrong while verifying the token"
        });
    }
}