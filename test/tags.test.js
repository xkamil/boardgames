process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let User = require('./../controllers/models/user');
let Tag = require('./../controllers/models/tag');
let SpecHelper = require("./spec_helper");

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('TAGS', () => {

    let testData;

    beforeEach((done)=> {

        SpecHelper.beforeEach((data) => {
            testData = data;
            done();
        });

    });

    afterEach((done)=> {
        SpecHelper.afterEach(done);
    });

    describe('GET /tags', ()=> {

        it('should respond with http 200 and array with 3 tags', (done)=> {
            chai.request(server)
                .get('/tags')
                .set('x-access-token', testData.users.token1)
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.expect(res.body.length).to.equal(3);
                    done();
                })
        });

    });

    describe('POST /tags/:tag', ()=> {

        it('should add tag and respond with http 201', (done)=> {
            chai.request(server)
                .post('/tags/tag4')
                .set('x-access-token', testData.users.token1)
                .end((err, res) => {
                    res.should.have.status(201);

                    chai.request(server)
                        .get('/tags')
                        .set('x-access-token', testData.users.token1)
                        .end((err, res) => {
                            res.should.have.status(200);
                            chai.expect(res.body.length).to.equal(4);
                            done();
                        })

                })
        });

        it('should respond with http 400 if admin creates invalid tag', (done)=> {
            chai.request(server)
                .post('/tags/ta')
                .set('x-access-token', testData.users.token1)
                .end((err, res) => {
                    res.should.have.status(400);
                    done();
                })
        });

        it('should respond with http 403 if user with no admin role is creating tag', (done)=> {
            chai.request(server)
                .post('/tags/tag4')
                .set('x-access-token', testData.users.token2)
                .end((err, res) => {
                    res.should.have.status(403);
                    done();
                })
        });

    });

});