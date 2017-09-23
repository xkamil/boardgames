let express = require('express');
let config = require('../../config/config');
let router = express.Router();
let jwt = require('jsonwebtoken');
let E = require('../../exceptions');

let User = require('../models/user');
let bcrypt = require('bcryptjs');

router.post('/register', (req, res, next)=> {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || email.length < 5) return next(new E.BadRequest('Username required. Min 5 characters.'));
    if (!/.*@pega.com$/.test(email)) return next(new E.BadRequest('Username invalid. Regex Pattern: .*@pega.com'));
    if (!password || password.length < 5) return next(new E.BadRequest('Password required. Min 5 characters.'));

    User.findOne({email: email}, (err, user)=> {
        if (err) return next(err);
        if (user) return next(E.ResourceConflict('Username already taken'));

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) return next(err);

                let newUser = new User({
                    email: email,
                    password: hash,
                    admin: email === 'admin@pega.com'
                });

                newUser.save((err, user)=> {
                    if (err) return next(err);
                    res.status(201).json(user);
                })
            });
        });
    })
});

router.post('/login', (req, res, next)=> {
    let email = req.body.email || '';
    let password = req.body.password || '';

    User.findOne({email: email, deleted: false}, (err, user)=> {
        if (err) return next(err);
        if (!user) return next(new E.AuthenticationFailed('User ' + email + ' not found.'));

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) return next(err);
            if (!result) return next(new E.AuthenticationFailed('Wrong password'));

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