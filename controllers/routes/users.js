let express = require('express');
let router = express.Router();
let exceptions = require('../../exceptions');
let bcrypt = require('bcryptjs');

let User = require('../models/user');

// Change password
router.put('/me/password', (req, res, next) => {
    let user = req.user;
    let newPassword = req.body.password;

    if (!newPassword || newPassword.length < 5) return next(new exceptions.BadRequest('Password required. Min 5 characters.', null, 4002));

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

router.get('/me', (req, res, next)=> {
    res.json(req.user);
});


// Get user by id
router.get('/:id', (req, res, next)=> {
    let userId = req.params.id;

    User.findOne({_id: userId}, (err, user)=> {
        if (err) return next(err);
        if (!user) return next(new exceptions.ResourceNotFound('User not found.'));
        res.json(user);
    })
});

// Delete user by id
router.delete('/:id', (req, res, next) => {
    let loggedUser = req.user;
    let userId = req.params.id;
    let query = {_id: userId};

    User.findById(userId, (err, user) => {
        if (err) return next(err);
        if (!user) return next(new exceptions.ResourceNotFound());

        if (!loggedUser.admin || loggedUser._id != userId) {
            return next(new exceptions.AuthorizationException('You cant delete other users.'));
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