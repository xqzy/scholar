// about.js - Wiki route module.
//

var env = process.env.ENV || 'DEV';
var config = require(`../config/${env}`);

var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var url = config.db;
var dbname = "scholar";

//
// // sources page route.


module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
  getSourcesPage: function (req, res) {
    MongoClient.connect(url, function(err, client) {
      if (err) {
          console.log('Unable to connect to the Server', url);
      } else {
          console.log('Connection established to', url);
          const db = client.db(`${dbname}`);
          var articlecollection = db.collection('scholar');
          function compare (a,b){
              if (a >  b) {
                  comparison = 1;
              } else  {
                  comparison = -1;
              }
            return comparison
          }
          
          console.log("starting getting unique values");
          articlecollection.distinct(
            "source",
            {},
            function(err, sourcelist) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(sourcelist);    
                    res.render('sources', {
                      title: 'Information Sources',
                      'sourcelist': sourcelist.sort(compare)
                    });
                }
            });
      }
    });
  }
}