process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let User = require('./../controllers/models/user');
let Tag = require('./../controllers/models/tag');
let Place = require('./../controllers/models/place');
let Status = require('./../controllers/models/status');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

//TODO
describe('PLACES', () => {

});