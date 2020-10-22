/**
 * http://usejsdoc.org/
 */
//
var express = require('express');
var router = express.Router();
//
// // about page route.


module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
  getProfilePage: function (req, res) {
    res.render('profile', {
        title: 'Profile'
    });
  }
}