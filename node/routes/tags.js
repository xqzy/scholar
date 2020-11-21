// about.js - Wiki route module.
//

var env = process.env.ENV || 'DEV';
var config = require(`../config/${env}`);

var express = require('express');
var router = express.Router();

var url = config.db;
var dbname = config.dbname;
const mongoose = require('mongoose');

var username="";
var userisadmin=false;//

// // tags page route.


module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
  getTagsPage: function (req, res) {
    if (req.user) {
          username = req.user.username;
          userisadmin = req.user.admin;
    }
    try {
      mongoose.connect(url,  { useNewUrlParser: true });
//MongoClient.connect(url, function(err, client) {
    } catch (error) {
      console.log('[routes/tags.js] Unable to connect to the Server', url);
    } 
    
          console.log('[routes/tags.js] Connection established to', url);
          const db = mongoose.connection;
          db.on('error', () => console.error('[routes/tags.js] connection error:'));
  		  db.once('open', () => console.log('[routes/tags.js] connection succesfull'));
          var Tag = require('../models/tags');
          
          // var articlecollection = db.collection('scholar');
          function compare (a,b){
              if (a >  b) {
                  comparison = 1;
              } else  {
                  comparison = -1;
              }
            return comparison
          }
          console.log("[routes/tags.js] starting getting unique tag values");
          
          Tag.find(
            {},
            function(err, taglist) {
                if (err) {
                    console.log("  [routes/tags.js]  " + err)
                } else {
                    // first trim down the taglist and filter out only the "label" component.
                   var labellist = new Array(); // store the labels here, to pass on to PUG
                    for (var i  = 0; i < taglist.length; i++) {
                         labellist.push(taglist[i].label);
                    }
                       
                    // console.log(labellist);    
                    res.render('tags', {
                      title: 'Tags',
                      username: username,
                      admin: userisadmin,
                      'taglist': labellist.sort(compare)
                    });
                }
            });
      
    
  }
}