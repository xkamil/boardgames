process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let User = require('./../controllers/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('AUTHORIZATION', () => {

    let samplepassword = bcrypt.hashSync('testpass');

    beforeEach((done)=> {

        User.remove({}, (err)=> {
            done();
        })
    });

    describe('authentication middleware', ()=> {

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
                .send({username: 'janusz', password: 'testpass'})
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
                .send({username: 'janusz', password: 'testpass'})
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
                .send({username: 'janusz', password: 'testpass'})
                .end((err, res) => {
                    let token = res.body.token;

                    User.findOneAndUpdate({name: 'janusz'}, {deleted: true}, (err) => {
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