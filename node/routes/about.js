// about.js - Wiki route module.
//
var express = require('express');
var router = express.Router();

var username="";
var userisadmin=false;//
// // about page route.


module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
  getAboutPage: function (req, res) {
      if (req.user) {
          username = req.user.username;
          userisadmin = req.user.admin;
      }
    res.render('about', {
    	title: 'About',
        username: username,
        admin: userisadmin,
    });
  }
}