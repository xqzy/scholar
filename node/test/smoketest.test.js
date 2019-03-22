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

describe('Deprecated Article page ', function(){
	  it('article page exists', function(){
	    chai.request('http://localhost:8080')
	    .get('/articles')
	    .end(function(err, res) {
	      res.should.have.status(200);
	      res.should.be.html;
	    });
	  });
	});

describe('Maintenance page ', function(){
	  it('maintenance page exists', function(){
	    chai.request('http://localhost:8080')
	    .get('/maint')
	    .end(function(err, res) {
	      res.should.have.status(200);
	      res.should.be.html;
	    });
	  });
	});


describe('Database Admin page ', function(){
	  it('dbadmin page exists', function(){
	    chai.request('http://localhost:8080')
	    .get('/dbadmin')
	    .end(function(err, res) {
	      res.should.have.status(200);
	      res.should.be.html;
	    });
	  });
	});


describe('Delete Articles page ', function(){
	  it('Deleta Articles page exists', function(){
	    chai.request('http://localhost:8080')
	    .get('/deletearticles')
	    .end(function(err, res) {
	      res.should.have.status(200);
	      res.should.be.html;
	    });
	  });
	});


describe('Get Articles page ', function(){
	  it('Get Articles page exists', function(){
	    chai.request('http://localhost:8080')
	    .get('/getarticles')
	    .end(function(err, res) {
	      res.should.have.status(200);
	      res.should.be.html;
	    });
	  });
	});


describe('Recommend page ', function(){
	  it('Recommend page exists', function(){
	    chai.request('http://localhost:8080')
	    .get('/recommend')
	    .end(function(err, res) {
	      res.should.have.status(200);
	      res.should.be.html;
	    });
	  });
	});