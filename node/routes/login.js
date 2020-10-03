//
// routes / login
//
var express = require('express');
var router = express.Router();


module.exports = function(passport){

// Note -> this route is included in hello.js with /login
// as root. Hence the uri/paths here are relative to /login..

  /* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		console.log("[routes/login.js] login routes");
		res.render('login', { message: req.flash('message') });
	});
  
  /* Handle Login POST */
	router.post('/', function(req, res) {
	  console.log("[routes/login.js] calling passport.authenticate");  
	  passport.authenticate('login', {
		successRedirect: '/getarticlez',
		failureRedirect: '/',
		failureFlash : true
	  });
	});
  
    return router;
    
}


