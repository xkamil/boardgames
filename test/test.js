process.env.NODE_ENV = 'test';
process.env.DISABLE_AUTORIZATION = true;

let mongoose = require('mongoose');
let User = require('./../controllers/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('API route', () => {

    beforeEach((done)=> {
        User.remove({}, (err)=> {
            done();
        })
    });

    describe('/users', ()=> {

        describe('GET ', ()=> {

            it('should respond with http 200', (done) => {
                chai.request(server)
                    .get('/users')
                    .end((err, res) => {
                        res.should.have.status(200);
                        done();
                    })
            })
        });
    });

    describe('/authenticate', ()=> {


        describe('POST', ()=> {

            beforeEach((done)=> {
                let user = new User({
                    name: 'janusz',
                    password: 'testpass'
                });

                let deletedUser = new User({
                    name: 'mateusz',
                    password: 'testpass',
                    deleted: true
                });

                user.save((err)=> {
                    deletedUser.save((err)=> {
                        done();
                    })
                })
            });

            it('should respond with http 401 if user not exists', (done)=> {
                chai.request(server)
                    .post('/authenticate')
                    .send({username: 'matedusz', password: 'testpass'})
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    })
            });

            it('should respond with http 401 if authenticating as deleted user', (done)=> {
                chai.request(server)
                    .post('/authenticate')
                    .send({username: 'mateusz', password: 'testpass'})
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    })
            });

            it('should respond with http 401 if password not match', (done)=> {
                chai.request(server)
                    .post('/authenticate')
                    .send({username: 'janusz', password: 'testpass2'})
                    .end((err, res) => {
                        res.should.have.status(401);
                        done();
                    })
            });

            it('should respond with http 200 and token if valid credentials sent', (done)=> {
                chai.request(server)
                    .post('/authenticate')
                    .send({username: 'janusz', password: 'testpass'})
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('token');
                        done();
                    })
            });
        });
    });
});