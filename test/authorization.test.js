process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let User = require('./../controllers/models/user');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let testData = require('./spec_helper').testData;

chai.use(chaiHttp);

describe('AUTHORIZATION', () => {

    beforeEach((done)=> {
        let promises = [];

        // Add users to database
        for (let i = 0; i < testData.users.length; i++) {
            promises.push(new Promise((resolve) => {
                new User(testData.users[i]).save((err, usr) => {resolve()})
            }));
        }

        Promise.all(promises).then(()=> {done();});
    });

    afterEach((done)=> {
        User.remove({}, (err)=> { done() });
    });

    describe('authentication middleware', ()=> {

        it('should respond with http 401 if accessing protected route without loggin in', (done)=> {
            chai.request(server)
                .get('/users')
                .end((err, res) => {
                    res.should.have.status(401);
                    done();
                })
        });

        it('should respond with http 200 if accessing protected route with token in query string', (done)=> {
            chai.request(server)
                .post('/authenticate')
                .send({email: 'janusz@pega.com', password: 'testpass'})
                .end((err, res) => {
                    let token = res.body.token;

                    chai.request(server)
                        .get('/users?token=' + token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                })
        });

        it('should respond with http 200 if accessing protected route with token in header', (done)=> {
            chai.request(server)
                .post('/authenticate')
                .send({email: 'janusz@pega.com', password: 'testpass'})
                .end((err, res) => {
                    let token = res.body.token;

                    chai.request(server)
                        .get('/users')
                        .set('x-access-token', token)
                        .end((err, res) => {
                            res.should.have.status(200);
                            done();
                        });
                })
        });

        it('should respond with http 401 if accessing protected route as deleted user', (done)=> {
            chai.request(server)
                .post('/authenticate')
                .send({email: 'janusz@pega.com', password: 'testpass'})
                .end((err, res) => {
                    let token = res.body.token;

                    User.findOneAndUpdate({email: 'janusz@pega.com'}, {deleted: true}, (err) => {
                        chai.request(server)
                            .get('/users?token=' + token)
                            .end((err, res) => {
                                res.should.have.status(401);
                                done();
                            });
                    });
                })
        });

    });
});