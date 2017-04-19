let express = require('express');
let config = require('../../config/config');
let router = express.Router();
let jwt = require('jsonwebtoken');
let exceptions = require('../../exceptions/exceptions');

let User = require('../models/user');

// router.post('/authenticate', (req, res, next)=> {
//     let username = req.params.username;
//     let password = req.params.password;
//
//     if(!username || username.length < 5) next(new BadRequestException('Username required. Min 5 characters.', null, 4001));
//     if(!password || password.length < 5) next(new BadRequestException('Password required. Min 5 characters.', null, 4002));
//
//     User.findOne({username: username}, (err, user)=> {
//         if (err) return next(err);
//         if(user) return next ResourceConflictException('Username already taken');
//         res.json(users);
//     })
// });

router.post('/authenticate', (req, res, next)=> {
    let username = req.body.username || '';
    let password = req.body.password || '';

    User.findOne({name: username, deleted: false}, (err, user)=> {
        if (err) return next(err);
        if(!user) return next(new exceptions.AuthenticationFailed('User ' + username + ' not found.', null, 4001));
        if(user.password != password) return next(new exceptions.AuthenticationFailed('Wrong password', null, 4002));
        
        let token = jwt.sign(user, config.secret, {
            expiresIn: config.token_lifetime
        });

        res.json({
            token: token
        })
    })
});

module.exports = router;