// app.locals.basedir = '/home/ec2-user/Code/scholar/node';


// article.js - route module to show single article information.
//
// obtain the environment variable to determine whether this is prod/test/dev
var env = process.env.ENV || 'DEV';
var config = require(`../config/${env}`);

var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = config.db;
var dbname = "scholar";
var sortcriteria="date";
// sort Crit 
// sorting criteria 
// 0 -> sort by score
// 1 -> sort by date

//
// // article page route.


module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
 getArticlezPage: function (req, res) {
    
  MongoClient.connect(url, function(err, client) {
    if (err) {
        console.log('Unable to connect to the Server', url);
    } else {
        console.log('Connection established to', url);
        const db = client.db(`${dbname}`);
        var articlecollection = db.collection('scholar');
        
        // function to define how articles are to be sorted.....
        function compare (a, b) {
          if (sortcriteria == "score") {
              compa = a.score;
              compb = b.score;
          } else if (sortcriteria == "date") {
              compa = a.pubDate;
              compb = b.pubDate;
          } else if (sortcriteria == "source"){
              compa = a.source;
              compb = b.source;
          }
          if (compa >  compb) {
              comparison = 1;
          } else  {
              comparison = -1;
          }
          comparison = comparison * -1;
        return comparison
        }
           
        // fetch url to see whether there was a commond
        //
        // res.send(req.query.cmd);
        if (req.query.cmd == "hd") {
           // convert string to objectid for mongo
           var refid = require('mongodb').ObjectID(req.query.id); 
           articlecollection.findOneAndUpdate(
             {_id:refid},  // query to find the record
             {$set:{show:"0"}},    // update command
             {},                  // options 
             function(err, object){
               if(err){
                 console.log('error in iupdate functin');
                 console.warn(err.message);  // return err mess
               }else{
                 console.log(' object infomration below: ' , req.query.id);
                 console.dir(object);
               }
             });
           console.log('update: ',req.query.id, req.query.cmd); 
        }
        if (req.query.cmd == "lk") {
        	 var refid = require('mongodb').ObjectID(req.query.id); 
             articlecollection.findOneAndUpdate(
               {_id:refid},  // query to find the record
               {$set:{like:"1"}},    // update command
               {},                  // options 
               function(err, object){
                 if(err){
                   console.log('error in iupdate functin');
                   console.warn(err.message);  // return err mess
                 }else{
                   console.log(' object infomration below: ' , req.query.id);
                   console.dir(object);
                 }
               });
             console.log('update: ',req.query.id, req.query.cmd); 
        } else if (req.query.cmd == "sort") {
           sortcriteria = req.query.id;
           console.log ("setting sorting criterium to : ", sortcriteria);
        }
        // Find all articles
        var articlesPerPage = 20;
        var pgNum = 0;
        var nxtPg = 12;
        
        if (! req.query.page) {
        	console.log('Articlez : no page id found.');
        	console.log('articles per page', articlesPerPage);
        }
        else {
        	pgNum = parseInt(req.query.page);
        	
        	console.log('Articlez  page id found:', pgNum);
        	console.log('articles per page', articlesPerPage);
        }
        	
        var query = { show: 1};
        articlecollection.find(query).toArray(function(err, articleResult) {
          if (err) {
              res.send(err);
          } else if (articleResult.length) {
              
              articleResult.sort(compare); 
              
              fltrArticleResult = articleResult.slice(articlesPerPage * pgNum,
            		              articlesPerPage * (pgNum + 1));
              nxtPg = pgNum + 1;
              prvPg = pgNum - 1;
              if (prvPg < 0) { prvPg = 0;}
              res.render('articlez', {
                  'articlelist': fltrArticleResult.sort(compare),
                  title: 'IT Risk Reading Room',
                  pagenum: pgNum,
                  nextpage: nxtPg,
                  prevpage:prvPg,
              });
          } else {
              res.render('Articlez', {
            	  title: 'No articles found',
              });
          }
          client.close();
        });
    };

  });
 } 
}
