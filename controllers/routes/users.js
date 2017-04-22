let express = require('express');
let router = express.Router();
let exceptions = require('../../exceptions/exceptions');

let User = require('../models/user');
let Place = require('../models/place');

router.get('/me', (req, res, next)=> {
    res.json(req.user);
});

//TODO tests
// Get places added by user. Filtered by place status
router.get('/me/places', (req, res, next)=> {
    let status = req.query.status;
    let query = {user_id: req.user._id};
    
    if (status) query.status = status;

    Place.find(query, (err, places)=> {
        if (err) return next(err);
        res.json(places);
    });
});

// Get not deleted user by id
router.get('/:id', (req, res, next)=> {
    let userId = req.params.id;
    let query = {_id: userId, deleted: false};

    User.findOne(query, (err, user)=> {
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

// Get all not deleted users
router.get('/', (req, res, next)=> {
    let query = {deleted: false};

    User.find(query, (err, users)=> {
        if (err) return next(err);
        res.json(users);
    })
});

module.exports = router;