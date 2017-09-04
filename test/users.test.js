let SpecHelper = require("./spec_helper");
let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let User = require('./../controllers/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
let fail = chai.fail;
let testData = require('./spec_helper').testData;

chai.use(chaiHttp);

describe('USERS', () => {

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

    describe('GET /users', ()=> {

        it('should respond with http 200 and array with 2 users', (done)=> {
            chai.request(server)
                .get('/users')
                .set('x-access-token', testData.tokens[0])
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.expect(res.body.length).to.equal(2);
                    done();
                })
        });

    });

    describe('GET /users/:id', ()=> {

        it('should respond with http 404 if user with :id not exists', (done)=> {
            chai.request(server)
                .get('/users/58f8fead0f8a312cb0aafddb')
                .set('x-access-token', testData.tokens[0])
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                })
        });

        it('should respond with http 200 and user data', (done)=> {
            User.findOne({email: 'janusz@pega.com'}, (err, user) => {
                if (err || !user) fail();

                chai.request(server)
                    .get('/users/' + user._id)
                    .set('x-access-token', testData.tokens[0])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('email');
                        res.body.should.have.property('admin');
                        res.body.should.have.property('deleted');
                        res.body.should.have.property('_id');
                        done();
                    })
            });
        });

    });

    describe('GET /users/me', ()=> {

        it('should respond with http 200 and logged in user data', (done)=> {
            chai.request(server)
                .get('/users/me')
                .set('x-access-token', testData.tokens[0])
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.expect(res.body.email).to.equal('janusz@pega.com');
                    chai.expect(res.body.admin).to.equal(true);
                    chai.expect(res.body.deleted).to.equal(false);
                    done();
                })
        });

    });

    describe('PUT /users/me/password', ()=> {

        it('should respond with http 200 and change user password', (done)=> {

            chai.request(server)
                .put('/users/me/password')
                .set('x-access-token', testData.tokens[0])
                .send({password: 'newpassword'})
                .end((err, res) => {
                    res.should.have.status(200);

                    User.findById(testData.users[0]._id, (err, user)=> {
                        bcrypt.compare('newpassword', user.password, (err, result) => {
                            chai.expect(result).to.equal(true);
                            done();
                        });

                    });
                })
        });

    });

    describe('DELETE /users/:id', ()=> {

        it('should respond with http 200 and updated user data', (done)=> {

            User.findOne({email: 'janusz@pega.com'}, (err, user) => {

                chai.request(server)
                    .delete('/users/' + user._id)
                    .set('x-access-token', testData.tokens[0])
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('email');
                        res.body.should.have.property('admin');
                        res.body.should.have.property('deleted');
                        res.body.should.have.property('_id');
                        chai.expect(res.body.deleted).to.equal(true);
                        done();
                    })
            });
        });

        it('should respond with http 404 if user not exists', (done)=> {
            chai.request(server)
                .delete('/users/58f8fead0f8a312cb0aafddb')
                .set('x-access-token', testData.tokens[0])
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                })
        });

        xit('should respond with http 403 if deleting other user without admin role', (done)=> {
            done();
        });

    });

});