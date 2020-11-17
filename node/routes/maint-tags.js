/**
 * http://usejsdoc.org/
 */

 
 module.exports = function(req, res) {
     var Article = require('../models/articles');
     var i=0;
     Article.find({}, function(err,  articleResult) {
         console.log('starting updating tags');
         if (err) {
             res.send(err);
         } else {
             for (i=0; i<articleResult.length; i++){
                 console.log(i);
                 articleResult[i].updateTags();
                 articleResult[i].save();
             }
         }
     })
 } 
   