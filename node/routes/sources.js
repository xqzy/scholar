// about.js - Wiki route module.
//
var express = require('express');
var router = express.Router();
//
// // sources page route.


module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
  getSourcePage: function (req, res) {
    res.render('sources', {
    	title: 'Information Sources'
    });
  }
}