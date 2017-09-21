let express = require('express');
let router = express.Router();
let E = require('../../exceptions');
let bcrypt = require('bcryptjs');

let User = require('../models/user');

// Change password
router.put('/me/password', (req, res, next) => {
    let user = req.user;
    let newPassword = req.body.password;

    if (!newPassword || newPassword.length < 5) return next(new E.BadRequest('Password required. Min 5 characters.'));

        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPassword, salt, (err, hash) => {
                if (err) return next(err);

                User.findOneAndUpdate({_id: user._id}, {password: hash}, null, (err, user) => {
                    if (err) return next(err);
                    res.status(200).json(user);
                });
            });
        });
});

// Get logged in user
router.get('/me', (req, res)=> {
    res.json(req.user);
});


// Get user by id
router.get('/:id', (req, res, next)=> {
    User.findOne({_id: req.params.id}, (err, user)=> {
        if (err) return next(err);
        if (!user) return next(new E.ResourceNotFound());
        res.json(user);
    })
});

// Delete user by id
router.delete('/:id', (req, res, next) => {
    let loggedUser = req.user;
    let userId = req.params.id;

    User.findById(userId, (err, user) => {
        if (err) return next(err);
        if (!user) return next(new E.ResourceNotFound());

        if (!loggedUser.admin || loggedUser._id != userId) {
            return next(new E.AuthorizationException('You cant delete other users.'));
        }

        user.deleted = true;
        user.save((err)=> {
            if (err) return next(err);
            res.json(user);
        });
    });
});

// Get all users
router.get('/', (req, res, next)=> {
    let deleted = req.query.deleted || false;
    let query = {deleted: deleted};

    User.find(query, (err, users)=> {
        if (err) return next(err);
        res.json(users);
    })
});

module.exports = router;