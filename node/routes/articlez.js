// app.locals.basedir = '/home/ec2-user/Code/scholar/node';


// article.js - route module to show single article information.
//
// obtain the environment variable to determine whether this is prod/test/dev
var env = process.env.ENV || 'DEV';
var config = require(`../config/${env}`);

var express = require('express');
var router = express.Router();


var url = config.db;
var dbname = config.dbname;
var sortcriteria="date";
var sourcefilter="MT";


const mongoose = require('mongoose');


module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
 getArticlezPage: function (req, res) {
    

  var Article = require('../models/articles');
  
  // some code here just to try that the ocnnection works, 
  // i.e. that there we can write to the dbase.
  //var newidd = new mongoose.mongo.ObjectID();
  //var artikeltje = new Article ({
//	  description: 'awesomeaaa', 
	//  _id : newidd
//  });
//  artikeltje.save(function(err) {
 //   if (err) return handleError(err);
    // saved
 // });
  

  
  // const db = client.db(`${dbname}`);
  // var articlecollection = db.collection('articles');
    
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
  
  
  
  // example  
  // fetch url to see whether there was a commond
  //
  // res.send(req.query.cmd);
  // Function : Hide 
  // 		set the "show" bit for an article to zero, so that it isn't shown.
  if (req.query.cmd == "hd") {
     // convert string to objectid for mongo
     var refid = require('mongodb').ObjectID(req.query.id); 
     // articlecollection.findOneAndUpdate(
     Article.findOneAndUpdate(
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
  // function LIke
  // set the like bit for an article to one.
  if (req.query.cmd == "lk") {
    var refid = require('mongodb').ObjectID(req.query.id); 
       // articlecollection.findOneAndUpdate(
       Article.findOneAndUpdate(
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
   else if (req.query.cmd == "fltr") {
     if (req.query.id.length !== 0) {
       sourcefilter = {source: req.query.id};
       console.log("setting source filter to :", sourcefilter);
     } else {
         sourcefilter = "MT";
     }
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
   // var sourcefilter = {source:"Schneier"};	
   if ( sourcefilter !='MT') {
     var query = {$and :[ sourcefilter, {show:1}] };
   } else {
       var query = {show:1};
   }
   //articlecollection.find(query).toArray(function(err, articleResult) {
   Article.find(query, function(err,  articleResult) {

   
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
            res.render('articlez', {
              
          	  title: 'No articles found',
            });
     }
     // client.close();
   }); 
 }
// } 
}
