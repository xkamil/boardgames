let express = require('express');
let router = express.Router();
let E = require('../../exceptions/exceptions');
let Status = require('../models/status');

let Tag = require('../models/tag');
let Place = require('../models/place');
let Comment = require('../models/comment');

//TODO tests
// Get all active places. Admin gets all places and can filter them by status
router.get('/', (req, res, next)=> {
    let query = {status: Status.active};

    let user = req.user;

    if (user && user.admin) {
        let qStatus = req.query.status;
        if (qStatus) {
            query = {status: qStatus};
        } else {
            query = {}
        }
    }

    Place.find(query, (err, places)=> {
        if (err) return next(err);

        res.json(places);
    });
});

//TODO
// Activate place
router.post('/activate/:id', (req, res, next) => {
    let user = req.user;

});

//TODO
// Add place
router.post('/', (req, res, next) => {
    let user = req.user;
});

//TODO
// Update place
router.put('/:id', (req, res, next) => {
    let user = req.user;
});

//TODO
// Delete place
router.delete('/:id', (req, res, next)=> {
    let user = req.user;

});

module.exports = router;