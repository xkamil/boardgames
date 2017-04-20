process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let User = require('./../controllers/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();


chai.use(chaiHttp);

describe('AUTHENTICATION', () => {

    let samplepassword = bcrypt.hashSync('testpass');

    beforeEach((done)=> {

        User.remove({}, (err)=> {
            done();
        })
    });

    describe('POST /register', ()=> {

        it('should respond with http 201', (done) => {
            chai.request(server)
                .post('/register')
                .send({username: 'matedusz', password: 'testpass'})
                .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.have.property('_id');
                    done();
                })
        });

        it('should respond with http 409 if username already taken', (done) => {

            let user = new User({
                name: 'mateusz',
                password: samplepassword,
                deleted: false
            });

            user.save((err)=> {
                chai.request(server)
                    .post('/register')
                    .send({username: 'mateusz', password: 'testpass'})
                    .end((err, res) => {
                        res.should.have.status(409);
                        done();
                    })
            });
        });

        it('should respond with http 400 if username is shorter than 5 characters', (done) => {

            chai.request(server)
                .post('/register')
                .send({username: 'mate', password: 'testpass'})
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                })
        });

        it('should respond with http 400 if password is shorter than 5 characters', (done) => {

            chai.request(server)
                .post('/register')
                .send({username: 'mateusz', password: 'test'})
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                })
        })

    });

    describe('POST /authenticate', ()=> {

        beforeEach((done)=> {

            let user = new User({
                name: 'janusz',
                password: samplepassword
            });

            let deletedUser = new User({
                name: 'mateusz',
                password: samplepassword,
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