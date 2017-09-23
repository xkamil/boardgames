let E = require('../../exceptions');
let config = require('../../config/config');
let jwt = require('jsonwebtoken');
let User = require('../models/user');

module.exports = (req, res, next)=> {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token) return next(new E.AuthenticationFailed('User not authorized'));

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            if(err.name == 'TokenExpiredError') return next(new E.AuthenticationFailed('expired_token'));
            return next(new E.AuthenticationFailed('Invalid token.'));
        }

        let decodedUser = decoded._doc;

        User.findById(decodedUser._id, (err, user) => {
            if(err) return next(err);
            if(!user) return next(new E.AuthenticationFailed('User not found.'));
            if(user.deleted) return next(new E.AuthenticationFailed('User is deleted.'));
            if(!user.admin) return next(new E.AuthenticationFailed('User is not allowed to access this route.'));

            req.user = decodedUser;
            next();
        });
    });
};