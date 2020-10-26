/**
 * http://usejsdoc.org/
 */
//
var express = require('express');
var router = express.Router();
//
// // about page route.
var username="";
var userisadmin=false;//

module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
  getProfilePage: function (req, res) {
      if (req.user) {
          username = req.user.username;
          userisadmin = req.user.admin;
          res.render('profile', {
              title: 'Profile'
          });
      } else {
          res.status(403);
          res.render('403');
      }
      
    } 
  }