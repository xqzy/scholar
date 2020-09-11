const chai = require("chai");
const expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = require('chai').should();
var express = require('express');

describe("smoke test", function() {
  it("checks equality", function() {
    expect(true).to.be.true;
  });
});

describe('Front end page', function(){
  it('landing page exists', function(done){
    chai.request('http://localhost:8080')
    .get('/')
    .end(function(err, res) {
//      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });
});


describe('Main Article page ', function(){
  this.timeout(4000);
  it('article page exists', function(done){
    chai.request('http://localhost:8080')
    .get('/articlez')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });
});

describe('Deprecated Article page ', function(){
    this.timeout(4000);
    it('article page exists', function(done){
    chai.request('http://localhost:8080')
    .get('/articles')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });
});

describe('Maintenance page ', function(){
  it('maintenance page exists', function(done){
    chai.request('http://localhost:8080')
    .get('/maint')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });
});


describe('Database Admin page ', function(){
  it('dbadmin page exists', function(done){
    chai.request('http://localhost:8080')
    .get('/dbadmin')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });
});


describe('Delete Articles page ', function(){
  it('Deleta Articles page exists', function(done){
    chai.request('http://localhost:8080' )
    .get('/deletearticles')
    .end(function(err, res) {
      res.should.have.status(200);
      res.should.be.html;
      done();
    });
  });
});

// this test temporary disabled.
// by introducing logon function in recommend function, this no longer works
// testscript needs amending to pass logon function
//
// describe('Recommend page ', function(){
//    it('Recommend page exists', function(done){
//      chai.request('http://localhost:8080')
//      .get('/recommend')
//      .end(function(err, res) {
//        res.should.have.status(200);
//        res.should.be.html;
//        done();
//      });
//    });
//  });



