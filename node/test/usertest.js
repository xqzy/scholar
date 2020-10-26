/**
 * http://usejsdoc.org/
 * meant to test actions that are related to user administration
 */
const chai = require("chai");
const expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = require('chai').should();
var express = require('express');


describe('Logout ', function(){
    it('logs-out as a prereq of the testrun', function(done){
      chai.request('http://localhost:8080')
      .get('/logout')
      .end(function(err, res) {
//        res.should.have.status(200);
        res.should.have.status(200);
        done();
      });
    });
  });


describe('Profile  page', function(){
    it('profile page should not exist when not signed-in', function(done){
      chai.request('http://localhost:8080')
      .get('/profile')
      .end(function(err, res) {
        res.should.have.status(403);
        done();
      });
    });
  });

describe('Signup page', function(){
    this.timeout(6000);
    it('signup page exists', function(done){
      chai.request('http://localhost:8080')
      .get('/signup')
      .end(function(err, res) {
//        res.should.have.status(200);
        res.should.be.html;
        done();
      });
    });
    it('registers a new user ', function(done){
        chai.request('http://localhost:8080')
        .post('/signup')
        .type('form')
        .send({
            'username': 'joe',
            'password':'joe',
        })
        .end(function(error, res, body) {
            if (error) {
                done(error);
            } else {
                res.should.be.html;
                res.should.have.status(200);
                done();
            }
        });
         
        //.expect('Content-Type', /json/)
        //.expect(function(response) {
         //   expect(response.body).not.to.be.empty;
          //  expect(response.body).to.be.an('object');
 //       })
//        .end(done);
    }); 
  });

describe('Profile  page2', function(){
    this.timeout(4000)
    it('profile page should exist when signed-in', function(done){
        var agent = chai.request.agent('http://localhost:8080')
        agent
          .post('/login')
          .type('form')
          .send({
             'username': 'joe',
             'password':'joe',
          })
        .then(function(res){
            //  expect(res).to.have.cookie('sessionid');
            expect(res).to.have.status(200);
            return agent.get('/profile')
              .then(function(res) {
                  expect(res).to.have.status(200);
              });
        });
     // .end(function(err, res) {
 //       done();
 //     });
        done();
        agent.close();   
    });
    
  });



