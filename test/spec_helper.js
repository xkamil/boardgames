process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let User = require('./../controllers/models/user');
let Game = require('./../controllers/models/game');
let Reservation = require('../controllers/models/reservation');
let config = require('../config/config');
let jwt = require('jsonwebtoken');
let mongoose = require('mongoose');
let ObjectId = mongoose.Types.ObjectId;


let samplepassword = bcrypt.hashSync('testpass');

let testData = {
    users: []
};

testData.users.push({
    _id: new ObjectId(),
    email: 'janusz@pega.com',
    password: samplepassword,
    admin: true
});

testData.users.push({
    _id: new ObjectId(),
    email: 'roman@pega.com',
    password: samplepassword
});

testData.users.push({
    _id: new ObjectId(),
    email: 'mateusz@pega.com',
    password: samplepassword,
    deleted: true
});

testData = Object.assign(testData, {
    tokens: [
        jwt.sign(new User(testData.users[0]), config.secret, {expiresIn: '10h'}),
        jwt.sign(new User(testData.users[1]), config.secret, {expiresIn: '10h'}),
        jwt.sign(new User(testData.users[2]), config.secret, {expiresIn: '10h'})
    ]
});

module.exports.testData = testData;
