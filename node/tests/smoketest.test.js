const chai = require("chai");
const expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = require('chai').should();
var express = require('express'),
    app = express();

describe("smoke test", function() {
  it("checks equality", function() {
    expect(true).to.be.true; 
  });
});

describe('Front end page', function(){
  it('landing page exists', function(){
    chai.request('http://localhost:8080')
    .get('/')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
    });
  });
});


describe('Main Article page ', function(){
  it('article page exists', function(){
    chai.request('http://localhost:8080')
    .get('/articlez')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
    });
  });
});
