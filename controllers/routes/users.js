let express = require('express');
let router = express.Router();
let exceptions = require('../../exceptions/exceptions');

let User = require('../models/user');

router.get('/setup', (req, res)=> {

    let nick = new User({
        name: 'kamil',
        password: 'limak',
        admin: true,
        deleted: false
    });

    nick.save((err)=> {
        if (err) res.status(500).send(err.message);

        res.json({message: "success"});
    })
});

router.get('/me', (req, res, next)=> {
    let decoded = req.decoded;

    if(!decoded._doc) return next(new exceptions.InternalServerException());

    res.json(decoded._doc);
});

router.get('/:id', (req, res, next)=> {
    let userId = req.params.id;
    let query = {_id: userId, deleted: false};

    User.findOne(query, (err, user)=> {
        if (err) return next(err);
        if(!user) return next(new exceptions.ResourceNotFound('User not found.'));
        res.json(user);
    })
});

router.delete('/:id', (req, res, next) => {
    let userId = req.params.id;
    let query = {_id: userId};

    User.findById(userId, (err, user) => {
        if (err) return next(err);
        if (!user) return next(new exceptions.ResourceNotFound());

        User.findOneAndUpdate(query, {deleted: true}, (err) => {
            if (err) return next(err);
            res.json({message: 'User with id ' + userId + ' deleted'});
        })
    });
});

router.get('/', (req, res, next)=> {
    let query = {deleted: false};

    User.find(query, (err, users)=> {
        if (err) return next(err);
        res.json(users);
    })
});

module.exports = router;