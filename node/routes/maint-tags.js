/**
 * http://usejsdoc.org/
 */

 
 module.exports = function(req, res) {
     var Article = require('../models/articles');
     var i=0;
     var Tag = require('../models/tags');
     // iterate through all tags in the collection
     console.log('starting updating tags');
     Tag.find( {}, function(err, tagResult){
         // if there are no tags, there is nothing to update
         Article.find({}, function(err,  articleResult) {
             // neither if there are no articles
             if (err) {
                 res.send(err);
             } else {
                 // and then for each aricle
                 for (i=0; i<articleResult.length; i++){
                     // n = i;
                     // call the "updateTags method and subsequently save the article
                     articleResult[i].updateTags(tagResult, err, function(err, done){                 
                             console.log('article ' + i + ' checked ');
                     });
                 }
             }
         })
         
         
         
     })
     
     // iterate through all articles

 } 
   