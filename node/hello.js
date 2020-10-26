// use 'strict';

// obtain the environment variable to determine whether this is prod/test/dev
var env = process.env.ENV || 'DEV';
console.log("[hello.js]  environment detected: (should be PROD/TEST/DEV): ", env);

// now fetch the correct environment file.
var config = require(`./config/${env}`);
module.exports = config;

var bodyParser = require("body-parser");
var  session = require('express-session');
const mongoose = require('mongoose');
var express = require('express');
var app = express();
module.exports - app;



//  var MongoClient = require('mongodb').MongoClient;
var url = config.db;
var dbname = config.dbname;
console.log ("[hello.js] database " + dbname + " used.");
console.log `dbname  ${dbname}`;
var aboutPage = require('./routes/about.js');
var articlePage = require('./routes/article.js');
var articlezPage = require('./routes/articlez.js');
var profilePage = require('./routes/profile.js');
var sourcesPage = require('./routes/sources.js');

// configure session and file-store
var session = require('express-session');
var FileStore = require('session-file-store')(session);
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUnitialized: false,
    resave: false,
    store: new FileStore
}));

//Configuring Passport
var passport = require('passport');
var signup = require('./passport/signup');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(passport.initialize());
app.use(passport.session());


// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());

//Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);


try {
    // mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true});
    mongoose.connect(url, { useNewUrlParser: true });
  } catch (error) {
    console.log('Unable to connect to the Server', url);
}
// MongoClient.connect(url, function(err, client) {
const db = mongoose.connection;
console.log('Connection established to', url);

db.on('error', () => console.error('connection error:'));
db.once('open', () => console.log('connection succesfull'));


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

app.route('/profile').get(function(req, res) {
    profilePage.getProfilePage(req, res);
});

app.route('/article').get(function(req,res){
	articlePage.getArticlePage(req, res);
});

app.route('/articlez').get(function(req,res){
	articlezPage.getArticlezPage(req, res);
});


app.route('/sources').get(function(req,res){
    sourcesPage.getSourcesPage(req, res);
});


app.set('view engine', 'pug');
// serve static files from the 'public' folder
app.use(express.static(__dirname + '/public'));
// app.use(express.static(__dirname + '/views'));



app.set('views', __dirname + '/views');

function isLoggedIn(req, res, next) { 
    if (req.user) {
        next(); 
    } else {
    res.redirect("/login"); 
    } 
}

app.get('/', (req, res) => {
   var titel = 'Homepage';
   var username = "";
   if (env == 'TEST') {
     titel = 'TEST Homepage TEST';
   }
   if (req.user) {
       username = req.user.username;
   }
   res.render('index', {
     title: titel,
     username: username,
  });
});


// app.locals.basedir = '/home/ec2-user/Code/scholar/node';
app.get('/maint', isLoggedIn,  (req, res) => {
   res.render('maint', {
     title: 'maint',
  });
});

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
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
  const getartscmd = spawn('sh',['/home/ec2-user/Code/scholar/scripts/get_articles.sh']);
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


/* GET login page. */
app.get('/login', function(req, res) {
  // Display the Login page with any flash message, if any
  res.render('login', { message: req.flash('message') });
});

/* Handle Login POST */
app.post('/login', passport.authenticate('login', {
  successRedirect: '/articlez',
  failureRedirect: '/login',
  failureFlash : true 
}));

/* GET Registration Page */
app.get('/signup', function(req, res){
  res.render('register',{message: req.flash('message')});
});

/* Handle Registration POST */
app.post('/signup', function(req, res) {
      var username  = req.body.username;
      var password = req.body.password;
      
      console.log('hello.js -> entered signup function');
      console.log('[hello.js] username' + username + ' password' + password )
      signup(
              req, 
              username,
              password,
              function (err, newUser) { 
                  if (err) {
                    console.log('[hello.js] het neit is gelukt');
                    aboutPage.getAboutPage(req, res);
                  } else {
                    console.log('[hello.js] het s gelukt');
                    profilePage.getProfilePage(req, res);
                  }
              }) ;  
});

// code for the recommend functionality
app.get('/recommend', (req, res) => {
  const {spawn} = require('child_process');
  const reccmd = spawn('python', ['/home/ec2-user/Code/scholar/scholar/recommend.py']);
  
  reccmd.stdout.on('data', (data)=> {
    console.log(`recommend.py stdout:\n${data}`);
//    console.log(`${stderr}`);
  });
  reccmd.on('exit', function (code, signal) {
    console.log('reccmd process exited with ' +
    		`code ${code} and signal ${signal}`);
  });
  res.render('recommend', {
     title: 'recommend',
  });
});


var server = app.listen(8080, function() {
  console.log(`Express running → PORT ${server.address().port}`);
 });
