// routes / signup .js - Wiki route module.
//
var express = require('express');
var router = express.Router();
//
// // login signup  route.

module.exports = function(passport) {

/   * GET Registration Page */
	router.get('/', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));
  
    return router;
}