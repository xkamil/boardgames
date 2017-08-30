process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let User = require('./../controllers/models/user');
let Game = require('./../controllers/models/game');
let Reservation = require('../controllers/models/reservation');
let config = require('../config/config');
let jwt = require('jsonwebtoken');


module.exports.beforeEach = (callback) => {

    let data = {};

    addTestUsers(data, (testDataWithUsers)=> {
        callback(testDataWithUsers);
    })

};

module.exports.afterEach = (callback) => {
    User.remove({}, (err)=> {
        callback();
    });
};

let addTestUsers = (testData, callback) => {

    let samplepassword = bcrypt.hashSync('testpass');

    let user1 = new User({
        email: 'janusz@pega.com',
        password: samplepassword,
        admin: true
    });

    let user2 = new User({
        email: 'roman@pega.com',
        password: samplepassword
    });

    let user3 = new User({
        email: 'mateusz@pega.com',
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
