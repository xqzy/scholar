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
       str = str + "<table> <tr> <th> link </th>";
       str = str + "<tr> <th> scores  </th>";
       str = str + "<th> description </th></tr>";
                    
       cursor.forEach(function(item) {
           if (item != null) {
                   if (item.score == null) { item.score = 0 }
                   str = str + "<tr><td><a href=\"" + item.link + "\"> link </a>  </td><td>" + item.score +"</td><td>" +  item.description + "</br></td></tr>";
           }
       }, function(err) {
           str = str + "</table>";
           res.send(str);
           client.close();
          }
       );
   });
});
app.set('view engine', 'pug');
// serve static files from the 'public' folder
app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/views'));

app.set('views', __dirname + '/views');

// app.locals.basedir = '/home/ec2-user/Code/scholar/node';
app.get('/', (req, res) => {
   res.render('index', {
     title: 'Homepage',
  });
});


// app.locals.basedir = '/home/ec2-user/Code/scholar/node';
app.get('/maint', (req, res) => {
   res.render('maint', {
     title: 'maint',
  });
});

// app.locals.basedir = '/home/ec2-user/Code/scholar/node';
app.get('/articlez', (req, res) => {
  MongoClient.connect(url, function(err, client) {
    if (err) {
        console.log('Unable to connect to the Server', err);
    } else {
        console.log('Connection established to', url);
        const db = client.db('test');
        var articlecollection = db.collection('scholar');

        // Find all articles
        articlecollection.find({}).toArray(function(err, articleResult) {
          if (err) {
              res.send(err);
          } else if (articleResult.length) {
              res.render('articlez', {
                  'articlelist': articleResult,
                  title: 'Articles',
              });
          } else {
              res.send('No documents found');
          }
          client.close();
        });
    };

   });
});

// app.locals.basedir = '/home/ec2-user/Code/scholar/node';
app.get('/dbadmin', (req, res) => {
  const exec = require('child_process').exec;
  var yourscript = exec('/home/ec2-user/Code/scholar/scripts/import-db.sh',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
   res.render('dbadmin', {
     title: 'dbadmin',
  });
});

app.get('/getarticles', (req, res) => {
  const exec = require('child_process').exec;
  var yourscript = exec('cd /home/ec2-user/Code/scholar && scrapy crawl secmag',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
   res.render('getarticles', {
     title: 'getarticles',
  });
});

var server = app.listen(8080, function() {
  console.log(`Express running → PORT ${server.address().port}`);
 });
