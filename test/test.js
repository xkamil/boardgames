process.env.NODE_ENV = 'test';

let mongoose = require('mongoose');
let User = require('./../controllers/models/user');

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Api', () => {

    beforeEach((done)=> {
        User.remove({}, (err)=> {
            done();
        })
    });

    describe('GET /', ()=> {

        it('should respond with http 200', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('message');
                    done();
                })
        })
    });
});