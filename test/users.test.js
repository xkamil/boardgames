process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let User = require('./../controllers/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('USERS', () => {

    let samplepassword = bcrypt.hashSync('testpass');

    let token = '';

    beforeEach((done)=> {

        let user = new User({
            name: 'janusz',
            password: samplepassword,
            admin: true
        });

        let user2 = new User({
            name: 'roman',
            password: samplepassword
        });

        let deletedUser = new User({
            name: 'mateusz',
            password: samplepassword,
            deleted: true
        });
        User.remove({}, (err)=> {
            user.save((err)=> {
                user2.save((err)=> {
                    deletedUser.save((err)=> {
                        chai.request(server)
                            .post('/authenticate')
                            .send({username: 'janusz', password: 'testpass'})
                            .end((err, res) => {
                                token = res.body.token;
                                done();
                            });
                    });
                });
            });
        });
    });

    describe('GET /users', ()=> {

        it('should respond with http 200 and array with 2 users', (done)=> {
            chai.request(server)
                .get('/users')
                .set('x-access-token', token)
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
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                })
        });

        it('should respond with http 200 and user data', (done)=> {
            User.findOne({name: 'janusz'}, (err, user) => {
                if (err || !user) fail();

                chai.request(server)
                    .get('/users/' + user._id)
                    .set('x-access-token', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('name');
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
                .set('x-access-token', token)
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.expect(res.body.name).to.equal('janusz');
                    chai.expect(res.body.admin).to.equal(true);
                    chai.expect(res.body.deleted).to.equal(false);
                    done();
                })
        });

    });

    describe('DELETE /users/:id', ()=> {

        it('should respond with http 200 and updated user data', (done)=> {
            User.findOne({name: 'janusz'}, (err, user) => {
                if (err || !user) fail();

                chai.request(server)
                    .delete('/users/' + user._id)
                    .set('x-access-token', token)
                    .end((err, res) => {
                        res.should.have.status(200);
                        res.body.should.have.property('name');
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
                .set('x-access-token', token)
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