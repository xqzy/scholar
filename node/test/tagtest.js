var assert = require("assert")
var env = process.env.ENV || 'DEV';
var config = require(`../config/${env}`);
var url = config.db;
var mongoose = require('mongoose');

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, function(err){
    if(err) throw err
});

describe('Testing the Tag Model', function () { 
      it('should add a new tag', function(done){
//          
          //# var Tag = require('../models/tags.js');
          var Tag = mongoose.model('Tag', {label: String})

          var newid = mongoose.mongo.ObjectId();
          var tag = new Tag({   // _id: newid,
                                                      label: 'Fender',
                                                      // weight: 0
                                                  })
          tag.save(function (err, doc)  {
              if (err) {
                  done(err);
              } else {
                  console.log('new tag created');
                  done();
              }
          });
      })
});