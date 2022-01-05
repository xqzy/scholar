// about.js - Wiki route module.
//
var express = require('express');
var router = express.Router();

var username="";
var userisadmin=false;//
// // about page route.

function updatetagstat (req, res) {
    var Article = require('../models/articles');
    var i=0;
    var j=0;
    var Tag = require('../models/tags');
    var tagResult=[];
    // iterate through all tags in the collection
    console.log('starting calcuation stats for tags');
    Tag.find( {}, function(err, tagResult){
        // if there are no tags, there is nothing to update
        if (err) {
            res.send(err);
        } else {
            console.log(" maint-tag.js: tag result : ",+ tagResult)
        
            Article.find({}, function(err,  articleResult) {
                // neither if there are no articles
                if (err) {
                    res.send(err);
                } else {
                    // and then for each aricle
                    for (i=0; i<articleResult.length; i++){
                        // n = i;
                        // call the "updateTags method and subsequently save the article
                        articleResult[i].updateTags(tagResult, err, function(err, done){                 
                               console.log('article ' + i + ' checked ');
                        });
                    }
                }
            })             
            
        }

    })
    
    // iterate through all articles

} 



module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
  getStatsPage: function (req, res) {
      if (req.user) {
          username = req.user.username;
          userisadmin = req.user.admin;
      }
    res.render('stats', {
    	title: 'Statistics',
        username: username,
        admin: userisadmin,
    });
  }
}