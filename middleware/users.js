const jwt = require("jsonwebtoken");

module.exports = {
    validateRegister: (req, res, next) => {
        // Username min length 5
        if (!req.body.username || req.body.username.length < 5) {
            return res.status(400).send({
                msg: 'Please enter a username with min. 5 chars.',
            });
        }
        // Password min 8 chars
        if (!req.body.password || req.body.password.length < 8) {
            return res.status(400).send({
                msg: 'Please enter a password with min. 8 chars.',
            });
        }
        
        next();
    },
    
    isLoggedIn: (req, res, next) => {
        if (!req.headers.authorization) {
            return res.status(400).send({
                msg: 'Your session is not valid.',
            });
        }
        
        try {
            const secretKey = 'TodolistMSIB5Stechoq'
            const authHeader = req.headers.authorization;
            const token = authHeader.split(' ')[1];
            const decoded = jwt.verify(token, secretKey);
            req.userData = decoded;
            next();
        } catch (err) {
            return res.status(400).send({
                msg: 'Your session is not valid.',
            });
        }
    }
};