const chai = require("chai");
const expect = chai.expect;
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
// var should = require('chai').should();
// var express = require('express');

// resetdatabase = require('./resetdatabase');


var tests = 1;

// Will run after every test in every file
afterEach(function() {
  console.log('Test #' + (tests++));
})


describe("smoke test", function() {
  it("checks equality", function() {
    expect(true).to.be.true;
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

describe('Test to scrape articles from the web and test whether several sources are working', function() {
    this.timeout(120000);  // this could take a minute or two
    before(() => {
        const spawn= require('child_process').spawn;
        // this should be the get_articles.sh command. Sometimes replaced by "ls" to speed-up the test...
        var commando = "/home/ec2-user/Code/scholar/scripts/get_articles.sh";
       //  var commando = "ls";
        return new Promise((resolve, reject) => {     
          var command = spawn(commando);
          var result = '';
          command.stdout.on('data', function(data) {
              result += data.toString;
          })
          command.on('close', function(code){
              resolve(result)
          })
          command.on('error', function(error){
              reject(error)
          })
        })
    });
    it('check per url to be implementedt', function(done) {
        chai.request('http://localhost:8080')
        .get('/sources')
        .end(function(err, res) {
//          res.should.have.status(200);
          res.text.should.contain('Cluley');   
          res.text.should.contain('Computerweekly'); 
          res.text.should.contain('Dark Reading');
          res.text.should.contain('Hacking Articles'); 
          res.text.should.contain('Krebs'); 
          res.text.should.contain('Schneier'); 
          res.text.should.contain('Security Magazine');
          res.text.should.contain('Schneier');
          res.text.should.contain('Techrepublic');
          res.text.should.contain('The Register'); 
          res.text.should.contain('Wired'); 
          done();
        });
    })
})

describe('preptest', function() {
    this.timeout(45000);
    before(() => {
        const exec = require('child_process').exec;
        var commando = "/home/ec2-user/Code/scholar/scripts/import-db.sh";
        return new Promise((resolve, reject) => {     
          exec(commando, (error, stdout, sterr) => {
                if(error) {
                    console.warn(error);
                } else {
                    console.warn(' datbase reset goed gedaan');
                }
            resolve(stdout? stdout : stderr);
          })
        })
    });
    it('sets database right', function(done) {
        done()
    })
})

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
  this.timeout(10000);
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



