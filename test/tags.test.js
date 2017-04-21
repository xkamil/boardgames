process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let User = require('./../controllers/models/user');
let Tag = require('./../controllers/models/tag');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('TAGS', () => {

    let samplepassword = bcrypt.hashSync('testpass');

    let adminToken = '';
    let userToken = '';

    before((done)=> {

        let user = new User({
            name: 'janusz',
            password: samplepassword,
            admin: true
        });

        let user2 = new User({
            name: 'roman',
            password: samplepassword
        });

        user.save((err)=> {
            user2.save((err)=> {
                chai.request(server)
                    .post('/authenticate')
                    .send({username: 'janusz', password: 'testpass'})
                    .end((err, res) => {
                        adminToken = res.body.token;

                        chai.request(server)
                            .post('/authenticate')
                            .send({username: 'roman', password: 'testpass'})
                            .end((err, res) => {
                                userToken = res.body.token;
                                done();
                            });
                    });
            });
        });
    });

    after((done)=> {
        User.remove({}, (err)=> {done()});
    });

    beforeEach((done)=> {
        let tag1 = new Tag({tag: "tag1"});
        let tag2 = new Tag({tag: "tag2"});
        let tag3 = new Tag({tag: "tag3"});

        tag1.save((err)=> {
            tag2.save((err)=> {
                tag3.save((err)=> {
                    done();
                })
            })
        })
    });

    afterEach((done)=> {
        Tag.remove({}, (err)=> {done()});
    });

    describe('GET /tags', ()=> {

        it('should respond with http 200 and array with 3 tags', (done)=> {
            chai.request(server)
                .get('/tags')
                .set('x-access-token', adminToken)
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.expect(res.body.length).to.equal(3);
                    done();
                })
        });

    });

    describe('POST /tags/:tag', ()=> {

        it('should add tag andrespond with http 201 if admin creates valid token', (done)=> {
            chai.request(server)
                .post('/tags/tag4')
                .set('x-access-token', adminToken)
                .end((err, res) => {
                    res.should.have.status(201);

                    chai.request(server)
                        .get('/tags')
                        .set('x-access-token', adminToken)
                        .end((err, res) => {
                            res.should.have.status(200);
                            chai.expect(res.body.length).to.equal(4);
                            done();
                        })

                })
        });

        it('should respond with http 400 if admin creates invalid token', (done)=> {
            chai.request(server)
                .post('/tags/ta')
                .set('x-access-token', adminToken)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                })
        });

        it('should respond with http 403 if user with no admin role is creating tag', (done)=> {
            chai.request(server)
                .post('/tags/tag4')
                .set('x-access-token', userToken)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        });

    });

});