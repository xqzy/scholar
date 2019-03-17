// about.js - Wiki route module.
//
var express = require('express');
var router = express.Router();
//
// // about page route.


module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
  getAboutPage: function (req, res) {
    res.render('about', {
    	title: 'About'
    });
  }
}