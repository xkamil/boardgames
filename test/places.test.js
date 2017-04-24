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

    let samplepassword = bcrypt.hashSync('testpass');
    let userAdminData = {};
    let userData = {};

    // beforeEach((done)=> {
    //
    //     let user1 = new User({
    //         name: 'janusz',
    //         password: samplepassword,
    //         admin: true
    //     });
    //
    //     let user2 = new User({
    //         name: 'roman',
    //         password: samplepassword
    //     });
    //
    //     user1.save((err, user)=> {
    //         userAdminData = user;
    //         user2.save((err, user)=> {
    //             userData = user;
    //
    //             chai.request(server)
    //                 .post('/authenticate')
    //                 .send({username: 'janusz', password: 'testpass'})
    //                 .end((err, res) => {
    //                     userAdminData.token = res.body.token;
    //
    //                     chai.request(server)
    //                         .post('/authenticate')
    //                         .send({username: 'roman', password: 'testpass'})
    //                         .end((err, res) => {
    //                             userData.token = res.body.token;
    //                             done();
    //                         });
    //                 });
    //         });
    //     });
    // });
    //
    // afterEach((done)=> {
    //
    //     User.remove({}, (err)=> {
    //         done();
    //     });
    // });
    //
    // it('should not fail', ()=> {
    //     chai.request(server)
    //         .get('/users')
    //         .set('x-access-token', userAdminData.token)
    //         .end((err, res) => {
    //             res.should.have.status(200);
    //             done();
    //         });
    // });

});