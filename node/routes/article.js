// article.js - route module to show single article information.
//
var express = require('express');
var router = express.Router();
//
// // article page route.


module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]
  getArticlePage: function (req, res) {
    res.render('article', {
    	title: 'Article Information'
    });
  }
}