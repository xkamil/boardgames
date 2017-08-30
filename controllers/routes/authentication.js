let express = require('express');
let config = require('../../config/config');
let router = express.Router();
let jwt = require('jsonwebtoken');
let exceptions = require('../../exceptions');

let User = require('../models/user');
let bcrypt = require('bcryptjs');

router.post('/register', (req, res, next)=> {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || email.length < 5) return next(new exceptions.BadRequest('Username required. Min 5 characters.', null, 4001));
    if (!/.*@pega.com$/.test(email)) return next(new exceptions.BadRequest('Username invalid. Regex Pattern: .*@pega.com', null, 4003));
    if (!password || password.length < 5) return next(new exceptions.BadRequest('Password required. Min 5 characters.', null, 4002));

    User.findOne({email: email}, (err, user)=> {
        if (err) return next(err);
        if (user) return next(exceptions.ResourceConflict('Username already taken'));

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) return next(err);

                let newUser = new User({
                    email: email,
                    password: hash
                });

                newUser.save((err, user)=> {
                    if (err) return next(err);
                    res.status(201).json(user);
                })
            });
        });
    })
});

router.post('/authenticate', (req, res, next)=> {
    let email = req.body.email || '';
    let password = req.body.password || '';

    User.findOne({email: email, deleted: false}, (err, user)=> {
        if (err) return next(err);
        if (!user) return next(new exceptions.AuthenticationFailed('User ' + email + ' not found.', null, 4001));

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return next(err);
            if (!result) return next(new exceptions.AuthenticationFailed('Wrong password', null, 4002));

            let token = jwt.sign(user, config.secret, {
                expiresIn: config.token_lifetime
            });

            res.json({
                token: token
            })
        });
    })
});

module.exports = router;