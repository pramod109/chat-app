const assert = require('assert');
const supertest = require('supertest');
const should = require('should');


const server = supertest.agent("http://localhost:3001");

describe("Testing the API requests", function() {

    
    it("should test the registration api", function(done){
        server
        .post('/registerNewClient')
        .send({name:'admin',password:'password'})
        .expect("Content-type",/json/)
        .expect(200)
        .end(function(err, res) {
            res.status.should.equal(200);
            res.body.success.should.equal(false);
            done();
        })
    });

    it("should test the user authentication api", function(done){
        server
        .post('/authenticate')
        .send({name:'admin', password:'password'})
        .expect("Content-type",/json/)
        .end(function(err, res){
            res.status.should.equal(200);
            res.body.success.should.equal(true);
            done();
        });
    });

    it("should test the token verification api", function(done){
        server
        .post('verify')
        .send({})
        .expect(403)
        .end(function(err,res){
            done();
        })
    })

});


