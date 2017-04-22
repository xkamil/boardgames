let express = require('express');
let router = express.Router();
let E = require('../../exceptions/exceptions');
let Status = require('../models/status');

let Tag = require('../models/tag');
let Place = require('../models/place');
let Comment = require('../models/comment');

router.get('/', (req, res, next)=> {

    let query = {status: Status.active};

    Place.find({}, (err, places)=> {
        if (err) return next(err);

        res.json(places);
    });
});

router.post('/:tag', (req, res, next) => {
    let user = req.user;
    let tag = req.params.tag;

    if (!user || !user.admin)return next(new E.AuthorizationException('Not authorized to add new tags.'));
    if (!tag || tag.length < 3) return next(new E.BadRequest('Tag must have at last 3 characters'));

    Tag.findOne({tag: tag}, (err, tag) => {
        if (err) return next(err);
        if (tag) return res.status(201).json(tag);

        let newTag = new Tag({tag: tag});
        newTag.save((err)=> {
            if (err) return next(err);
            res.status(201).json(tag)
        });
    });
});

router.delete('/:tag', (req, res, next)=> {
    let user = req.user;
    let tag = req.params.tag;

    if (!user || !user.admin)return next(new E.AuthorizationException('Not authorized to remove tags.'));
    if (!tag) tag = '';

    Tag.remove({tag: tag}, (err) => {
        if (err) return next(err);
        res.json('');
    });
});

module.exports = router;