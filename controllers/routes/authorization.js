let exceptions = require('../../exceptions/exceptions');
let config = require('../../config/config');
let jwt = require('jsonwebtoken');
let User = require('../models/user');

module.exports = (req, res, next)=> {
    if(config.env != 'prod' && process.env.DISABLE_AUTORIZATION) return next(); // disable authorization in test env

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token) return next(new exceptions.AuthenticationFailed('User not authorized'));

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) return next(new exceptions.AuthenticationFailed('Invalid or expired token.'));

        let decodedUser = decoded._doc;

        User.findById(decodedUser._id, (err, user) => {
            if(err) return next(err);
            if(!user) return next(new exceptions.AuthenticationFailed('User not found.'));
            if(user.deleted) return next(new exceptions.AuthenticationFailed('User is not active.'));

            req.user = decodedUser;
            next();
        });
    });
};