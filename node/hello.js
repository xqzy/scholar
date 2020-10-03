// use 'strict';
//
// define variables
//
// environment variable to determine whether this is prod/test/dev
//
var env = process.env.ENV || 'DEV';
console.log("[hello.js]  environment detected: (should be PROD/TEST/DEV): ", env);
var config = require(`./config/${env}`);
module.exports = config;

var express = require('express');
var app = express();
module.exports - app;

var session = require('express-session');
var FileStore = require('session-file-store')(session);

// database connection to articles database
var MongoClient = require('mongodb').MongoClient;
var url = config.db;
console.log ("[hello.js] url  " + url + " used.");
var dbname = config.dbname;
console.log ("[hello.js] database " + dbname + " used.");

// double -> removed
var  session = require('express-session');

var bodyParser = require("body-parser");
 
//
// variables Passport
var passport = require('passport'),
	LocalStrategy = require("passport-local");
 

// define mongoose
// 
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  username: String,
  email: String
}); 

 //   User = require("./models/user"),
dbusers = config.dbusers;  //database name for user registration
   
mongoose.set('useNewUrlParser', true); 
mongoose.set('useFindAndModify', false); 
mongoose.set('useCreateIndex', true); 
mongoose.set('useUnifiedTopology', true); 


   
   
// define uses
//
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({ extended: true })); 

 // Using the flash middleware provided by connect-flash to store messages in session
 // and displaying in templates
var flash = require('connect-flash');
app.use(flash());


//  connect to user database with the url provided in the configuration files for the envs.

var dbusers = config.dbusers;
url2 = "mongodb://admin:"+ pw + "@scholar.cyx09.mongodb.net:27017/?retryWrites=true&w=majority";

// url = "mongodb+srv://admin:" + pw + "\@scholar-cyx09.mongodb.net/dbuserstest?retryWrites=true&w=majority";
console.log("[hello.js] Mongoose connecting to url  " + url2 + " .");
mongoose.connect(url2, {
	useMongoClient : true
  }, function(err) {
  if (err) {
    console.log('[hello.js] Could not connect to mongodb !');
  }
});
UserSchema.plugin(passportLocalMongoose); 
User = mongoose.model('User',UserSchema);

// initialize Passport
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser()); 



// UserDetail.plugin(passportLocalMongoose);
// const UserDetails = mongoose_users.model('userInfo', UserDetail, 'userInfo');


// 
// passport local authentication
//
console.log("[hello.js] initializing passport");
//passport.use(UserDetails.createStrategy());

//passport.serializeUser(UserDetails.serializeUser());
//passport.deserializeUser(UserDetails.deserializeUser());





// Routes
var aboutPage = require('./routes/about.js');
var articlePage = require('./routes/article.js');
var articlezPage = require('./routes/articlez.js');

// var signupPage = require('./routes/signup.js');
var sourcesPage = require('./routes/sources.js');

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

console.log("[hello.js] initializing routes");
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


app.route('/sources').get(function(req,res){
    sourcesPage.getSourcesPage(req, res);
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

console.log("[hello.js] initializing session id");
app.use(session({
    name: 'session-id',
    secret: '12345-67890-09876-54321',
    saveUninitialized: false,
    resave: false,
    store: new FileStore
}));

app.set('views', __dirname + '/views');
/*
function auth (req, res, next) {
    console.log(req.session);
    if (!req.session.user) {
      var authHeader = req.headers.authorization;
      if (!authHeader) {
          var err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');              
          err.status = 401;
          next(err);
          return;
      }
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
      var user = auth[0];
      var pass = auth[1];
      if (user == 'admin' && pass == 'password') {
          req.session.user = 'admin';
          next(); // authorized
      } else {
          var err = new Error('You are not authenticated!');
          res.setHeader('WWW-Authenticate', 'Basic');              
          err.status = 401;
          next(err);
      }
    }
    else {
        if (req.session.user === 'admin') {
            next();
        }
        else {
            var err = new Error('You are not authenticated!');
            err.status = 401;
            next(err);
        }
    }
  }
  
*/ 

// app.locals.basedir = '/home/ec2-user/Code/scholar/node';
app.get('/', (req, res) => {
   var titel = 'Homepage';
   if (env == 'TEST') {
     titel = 'TEST Homepage TEST';
   }
   if (env == 'DEV') {
     titel = 'DEV Homepage DEV';
   }
   res.render('index', {
     title: titel,
  });
});

// register route to login functionality in routes/login script
//console.log("[hello.js] initializing login routes 1");
//var loginroute = require('./routes/login.js')(passport);
//console.log("[hello.js] initializing login routes 1a");
//app.use('/login', loginroute);

//Showing login form 
app.get("/login", function (req, res) { 
    res.render("login"); 
}); 
  
//Handling user login 
app.post("/login", passport.authenticate("local", { 
    successRedirect: "/secret", 
    failureRedirect: "/login"
}), function (req, res) { 
}); 


// register route to signup functionality in routes/signup script
//console.log("[hello.js] login routes 2 -> register sign-up");
//var signuproute = require('./routes/signup.js')(passport);
//app.use('/signup', signuproute);

// Showing register form 
app.get("/register", function (req, res) { 
    res.render("register"); 
}); 
  
// Handling user signup 
app.post("/register", function (req, res) { 
     console.log(req.body); //This prints the JSON document received (if it is a JSON document)
    var username = req.body.username 
    var password = req.body.password 
    User.register(new User({ username: username }), 
            password, function (err, user) { 
        if (err) { 
            console.log(err); 
            return res.render("register"); 
        } 
  
        passport.authenticate("local")( 
            req, res, function () { 
            res.render("secret"); 
        }); 
    }); 
}); 


 /* Handle Registration POST
 console.log("[hello.js] login routes 3");
app.route('/signup').post(function(req,res) {
   passport.authenticate('signup', {
     successRedirect: '/home',
     failureRedirect: '/signup',
     failureFlash : true
   });
});
*/


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
// all code below requires authentication

//  app.use(auth);
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
