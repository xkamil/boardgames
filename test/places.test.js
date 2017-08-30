process.env.NODE_ENV = 'test';

let bcrypt = require('bcryptjs');
let mongoose = require('mongoose');
let User = require('./../controllers/models/user');
let Tag = require('../controllers/models/game');
let Place = require('./../controllers/models/place');
let Status = require('./../controllers/models/status');
let SpecHelper = require("./spec_helper");

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

//TODO
describe('PLACES', () => {

    let testData;

    beforeEach((done)=> {

        SpecHelper.beforeEach((data)=>{
            testData = data;
            done();
        })

    });

    afterEach((done)=> {

        SpecHelper.afterEach(done);
    });

    describe('GET /places', () => {

        it('should return only active places for user', (done) => {
            chai.request(server)
                .get('/places')
                .set('x-access-token', testData.users.token2)
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.expect(res.body.length).to.equal(2);
                    done();
                });
        });

        it('should return all places for admin user', (done) => {
            chai.request(server)
                .get('/places')
                .set('x-access-token', testData.users.token1)
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.expect(res.body.length).to.equal(4);
                    done();
                });
        });

        it('should filter returned places by status for admin user', (done) => {
            chai.request(server)
                .get('/places?status=deleted')
                .set('x-access-token', testData.users.token1)
                .end((err, res) => {
                    res.should.have.status(200);
                    chai.expect(res.body.length).to.equal(1);
                    chai.expect(res.body[0]._id).to.equal(testData.places.place4._id.toString());

                    chai.request(server)
                        .get('/places?status=active')
                        .set('x-access-token', testData.users.token1)
                        .end((err, res) => {
                            res.should.have.status(200);
                            chai.expect(res.body.length).to.equal(2);
                            done();
                        });

                });
        });

    });

    it('should not fail', ()=> {

    });

});