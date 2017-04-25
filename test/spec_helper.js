process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let User = require('./../controllers/models/user');
let Place = require('./../controllers/models/place');
let Tag = require('./../controllers/models/tag');
let Status = require('./../controllers/models/status');
let config = require('../config/config');
let jwt = require('jsonwebtoken');


module.exports.beforeEach = (callback) => {

    let data = {};

    addTestUsers(data, (testDataWithUsers)=> {
        addTestPlaces(testDataWithUsers, (testDataWithPlaces) => {
            addTestTags(testDataWithPlaces, callback);
        });
    })

};

module.exports.afterEach = (callback) => {
    User.remove({}, (err)=> {
        Place.remove({}, (err)=> {
            Tag.remove({}, (err)=> {
                callback();
            });
        });
    });
};

let addTestUsers = (testData, callback) => {

    let samplepassword = bcrypt.hashSync('testpass');

    let user1 = new User({
        name: 'janusz',
        password: samplepassword,
        admin: true
    });

    let user2 = new User({
        name: 'roman',
        password: samplepassword
    });

    let user3 = new User({
        name: 'mateusz',
        password: samplepassword,
        deleted: true
    });

    user1.save((err, user1)=> {
        user2.save((err, user2)=> {
            user3.save((err, user3)=> {

                testData.users = {
                    user1: user1,
                    user2: user2,
                    user3: user3,
                    token1: jwt.sign(user1, config.secret, {expiresIn: '10h'}),
                    token2: jwt.sign(user2, config.secret, {expiresIn: '10h'}),
                    token3: jwt.sign(user3, config.secret, {expiresIn: '10h'})
                };

                callback(testData);
            });
        });
    });
};

let addTestPlaces = (testData, callback) => {

    let place1 = new Place({
        user_id: testData.users.user1._id,
        description: 'user place1',
        status: Status.draft
    });

    let place2 = new Place({
        user_id: testData.users.user1._id,
        description: 'user place2',
        status: Status.active
    });

    let place3 = new Place({
        user_id: testData.users.user3._id,
        description: 'user2 place1',
        status: Status.active
    });

    let place4 = new Place({
        user_id: testData.users.user2._id,
        description: 'user2 place1',
        status: Status.deleted
    });

    place1.save((err, place1)=> {
        place2.save((err, place2)=> {
            place3.save((err, place3)=> {
                place4.save((err, place4)=> {
                    testData.places = {
                        place1: place1,
                        place2: place2,
                        place3: place3,
                        place4: place4

                    };

                    callback(testData);
                });
            })
        })
    });
};

let addTestTags = (testData, callback) => {

    let tag1 = new Tag({tag: "tag1"});
    let tag2 = new Tag({tag: "tag2"});
    let tag3 = new Tag({tag: "tag3"});

    tag1.save((err, tag1)=> {
        tag2.save((err, tag2)=> {
            tag3.save((err, tag3)=> {

                testData.tags = [tag1, tag2, tag3];

                callback(testData);
            });
        });
    });
};