let exceptions = require('../../exceptions/exceptions');
let config = require('../../config/config');
let jwt = require('jsonwebtoken');

module.exports = (req, res, next)=> {
    if(config.env != 'prod' && process.env.DISABLE_AUTORIZATION) return next(); // disable authorization in test env

    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token) return next(new exceptions.AuthenticationFailed('User not authorized'));

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err) return next(new exceptions.AuthenticationFailed('Invalid or expired token.'));

        req.decoded = decoded;
        next();
    });
};