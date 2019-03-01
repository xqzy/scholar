var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost/test';
var str = "";

app.route('/articles').get(function(req, res) {
   console.log("starting nodejs code ");
   MongoClient.connect(url, function(err, client) {
       console.log("connection ok");
       const db = client.db('test');
       var collection = db.collection('scholar');
       var cursor = collection.find({});
       str = "";
       cursor.forEach(function(item) {
           if (item != null) {
                   str = str + "    Article id  " + item._id + "</br>";
           }
       }, function(err) {
           res.send(str);
           client.close();
          }
       );
   });
});
var server = app.listen(8080, function() { });
