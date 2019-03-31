// use 'strict';

// obtain the environment variable to determine whether this is prod/test/dev
var env = process.env.ENV || 'DEV';
var config = require(`./config/${env}`);
module.exports = config;

var express = require('express');
var app = express();
module.exports - app;

var MongoClient = require('mongodb').MongoClient;
var url = config.db;
var dbname = "scholar";

console.log `dbname  ${dbname}`;
var aboutPage = require('./routes/about.js');
var articlePage = require('./routes/article.js');
var articlezPage = require('./routes/articlez.js');

var str = "";

// edited from own workstation -> eclipse
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

app.set('view engine', 'pug');

app.route('/about').get(function(req, res) {
	aboutPage.getAboutPage(req, res);
});

app.route('/article').get(function(req,res){
	articlePage.getArticlePage(req, res);
});

app.route('/articlez').get(function(req,res){
	articlezPage.getArticlezPage(req, res);
});

app.route('/articles').get(function(req, res) {
   console.log("starting nodejs code ");
   MongoClient.connect(url, function(err, client) {
       console.log("connection ok");
       const db = client.db(`${dbname}`);
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
app.get('/dbadmin', (req, res) => {
	
  const exec = require('child_process').exec;
  
  //fetch url to determine commond
  //
  // res.send(req.query.cmd);
  var retstr = "";
  var title = "database admin menu";
  if (req.query.cmd == "ipdb") {
     // import database from S3 bucket.
	  retstr="";
	  const {spawn} =require('child_process');
	  const impcmd = spawn ('/home/ec2-user/Code/scholar/scripts/import-db.sh');
	  impcmd.stdout.on('data', (data) => {
		  retstr = retstr + `${data}`;
	  });
	  impcmd.on('exit', function(code, signal) {  
		      console.log('ok rob, value of retstr : \n %s  \n End of retstr \n', retstr);
		      res.render('dbadmin', {
		          title: title,
		          messge : retstr 
		      });
	  });
  }
  else if (req.query.cmd == "budb") {
	  // backup database to s3 bucket.
	  retstr="";
	  const {spawn} =require('child_process');
	  const bupcmd = spawn ('/home/ec2-user/Code/scholar/scripts/export-db.sh');
	  bupcmd.stdout.on('data', (data) => {
		  retstr = retstr + `${data}`;
	  });
	  bupcmd.on('exit', function(code, signal) {  
		      console.log('ok rob, value of retstr : \n %s  \n End of retstr \n', retstr);
		      res.render('dbadmin', {
		          title: title,
		          messge : retstr 
		      });
	  });
  }
  else {
	  retstr = "Please make your choice... ";
      res.render('dbadmin', {
          title: title,
          messge : retstr 
      });
  };
});

// app.locals.basedir = '/home/ec2-user/Code/scholar/node';
app.get('/deletearticles', (req, res) => {
  const exec = require('child_process').exec;
  var retstr = "successfull";
  var yourscript = exec('/home/ec2-user/Code/scholar/scripts/mongo_delete_all_articles.sh',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
                retstr = "error";
            }
        });
   res.render('deleterecords', {
     title: 'deleterecords' + retstr,
  });
});

// 16/3/19
// revision as per issue #11: change exec in spawn child process as spawn better deals with large output from
// child process

app.get('/getarticles', (req, res) => {
  const {spawn} = require('child_process');
  const getartscmd = spawn('../scripts/get_articles.sh');
  getartscmd.stdout.on('data', (data) => {
	  console.log(`get_articles.sh  stdout:\n${data}`);
  });

  getartscmd.stderr.on('data', (data) => {
	  console.error(`get_articles.sh stderr:\n${data}`);
  });
  getartscmd.on('exit', function (code, signal) {
	  console.log('getartscmd process exited with ' +
	              `code ${code} and signal ${signal}`);
  });
  res.render('getarticles', {
   title: 'getarticles',
  });
});

app.get('/recommend', (req, res) => {
  const exec = require('child_process').exec;
  var yourscript = exec('../scholar/recommend.py',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
            }
        });
   res.render('recommend', {
     title: 'recommend',
  });
});

var server = app.listen(8080, function() {
  console.log(`Express running → PORT ${server.address().port}`);
 });
