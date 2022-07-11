// about.js - Wiki route module.
//

var env = process.env.ENV || 'DEV';
var config = require(`../config/${env}`);

var express = require('express');
var router = express.Router();

var url = config.db;
var dbname = config.dbname;
const mongoose = require('mongoose');
var User = require('../models/user');
var labellist = [""]; // store the labels here, to pass on to PUG
var tagsliked = [""];

// definition of functions 
function compare (a,b){
    if (a["label"] >  b["label"]) {
        comparison = 1;
    } else  {
        comparison = -1;
    }
  return comparison
}
function obtain_tag_array(labellist, callback){
    //
    // function obtaintagsarray
    // objective : return in tagarray, the list of tags that exist in the database.
    // input :  <none>
    // output : labellist : tags in the database
    //
  var Tag = require('../models/tags');
  Tag.find(  
    {},          
    function(err, tagarray) {
        if (err) {
            console.log("  [routes/tags.js]  " + err);
            callback(labellist);
        } else {
            
            // first trim down the taglist 
            for (var i  = 0; i < tagarray.length; i++) {
                 labellist.push(tagarray[i]);
            };
           callback(labellist);
        }
    })
}
        
function obtain_tagslikedarray(userauthenticated, callback){
    //
    // function obtainlikedtagsarray
    // objective : return an array of tags that are liked y the user
    // input :  user (object)
    // output : array : tags that are liked
    //
    var tagsliked=[""]
    if (userauthenticated) {
        console.log("[routes/tags.js] message 1 ", tagsliked);
        User.find({username: username}, function (err, user) {
            // now find the tags that are like by the user
            console.log("[routes/tags.js] message 2 ", tagsliked);
             if ( !(user[0].tagsliked  === undefined) && Array.isArray(user[0].tagsliked) && user[0].tagsliked.length) {
                 callback(Array.from(user[0].tagsliked))
                 // console.log("[routes/tags.js] message 3", tagsliked);
             } else {
                 callback(tagsliked);
             }
             // return tagsliked;
         })  // end User.find    
      } else {
          callback(tagsliked);
      }
}
function liketag (tagstr, callback) {
 // // 
    //
    //  fucntion liketag
    // 
    // objective : register the tak with tagstr in the user profile as one tag like by the user    
    // input: tagst , string, sholuld be  and existing tag
    // output: update user profile (tagsliked array now includes also the tagst tag
    //
    if (userauthenticated) {
        console.log("[tags.js]  user authenticated.");
        User.find({username: username}, function (err, user) {
            // now find the tags that are like by the user 
            
             if (Array.isArray(user[0].tagsliked))  {
                 console.log("[tags.js] ltag command invoked.");
                 if (user[0].tagsliked.includes(tagstr)) {
                   // do nothing, the tag is already liked    
                 } else {
                     // update the tagsliked array to include the newly liked tag
                     User.findOneAndUpdate(
                             {username: username},
                             {$push: {"tagsliked": tagstr}},
                             {},  // no options,
                             function(err, object){
                                 if(err){
                                   console.log('[tags.js] : update user record : error in iupdate functin');
                                   console.warn(err.message);  // return err mess
                                   callback(err, tagstr)
                                 }else{
                                     // update tagstr prior to returning.
                                   console.log("invoking tagsliked.push")
                                   //tagsliked.push(tagstr, function (err2) {
                                       console.log('[tags.js] : update user record :  object information below: ' , tagstr);
                                       console.dir(object);
                                       callback(err,tagstr)     
                                  // })  // end taglikes.push
                                 
                               } // end else
                             }
                     );
                 }
             }       
         })                            
    }    
    
}
function unliketag (tagstr, callback) {
    // // 
       //
       //  fucntion unliketag
       // 
       // objective : deregister the tak with tagstr in the user profile as one tag no longer  liked by the user    
       // input: tagst , string, sholuld be  and existing tag
       // output: update user profile (tagsliked array now no longer includes the tagst tag
       //
       if (userauthenticated) {
           console.log("[tags.js/unliketag]  user authenticated.");
           User.find({username: username}, function (err, user) {
               // now find the tags that are like by the user 
               
                if (Array.isArray(user[0].tagsliked))  {
                    console.log("[tags.js/unliketag] utag command invoked.");
                    console.log("[tags.js/unliketag] tagstris ", tagstr)
                    console.log("[tags.js/unliketag] user0taglikes: ", user[0].tagsliked)
                    if (user[0].tagsliked.includes(tagstr)) {
                        console.log("[tag.js/unliketag] found tag-string in array of like tags....")
                      // only do somethinkg if the tag already exists                  
                        // update the tagsliked array to include the newly liked tag
                        User.findOneAndUpdate(
                                {username: username},
                                {$pull: {"tagsliked": tagstr}},
                                {},  // no options,
                                function(err, object){
                                    if(err){
                                      console.log('[tags.js/unliketag] : update user record : error in iupdate functin');
                                      callback(err.message);
                                      // console.warn(err.message);  // return err mess
                                    }else{
                                      console.log('[tags.js//unliketag] : update user record :  object information below: ' , tagstr);
                                      console.dir(object);
                                      callback();
                                    }
                                  }  
                        );
                    }
                } // end if statement to check whether tagsliked is filled.       
            })                            
       }    
       
   }
function render(res, username, userisadmin, userauthenticated,  labellist, tagsliked){
    res.render('tags', {
        title: 'Tags',
        username: username,
        admin: userisadmin,
        'taglist': labellist.sort(compare),
        authenticated: userauthenticated,
       'tagsliked':tagsliked.sort(compare)
      });
}



module.exports = {
  // A func that takes in two parameters `req` and `res` [request, response]   
  getTagsPage: function (req, res) {  
      // 
      // first obtain the information of the user that is currently logged-in
      //
      if (req.user) {
          username = req.user.username;
          userisadmin = req.user.admin;
          userauthenticated = true;
      } else {
          username = "";
          userisadmin = false;
          userauthenticated = false;
      }
    //
    // now establish connection the the mongodb database
      //
    try {
      mongoose.connect(url,  { useNewUrlParser: true });
//MongoClient.connect(url, function(err, client) {
    } catch (error) {
      console.log('[routes/tags.js] Unable to connect to the Server', url);
    } 
  
          console.log('[routes/tags.js] Connection established to', url);
          const db = mongoose.connection;
          db.on('error', () => console.error('[routes/tags.js] connection error:'));
  		  db.once('open', () => console.log('[routes/tags.js] connection succesfull'));

          //
          // var articlecollection = db.collection('scholar');
          // this function is used to sort the tags, before they are printed on the screen.
          //

          console.log("[routes/tags.js] starting getting unique tag values");
          // now start working with each of the tags, and obtain the tag-list. 
          // if this cannot be obtained for some reason, quit and throw an empty page.
          //
          console.log("[routes/tags.js] message -2 ");
          labellist=[];
          obtain_tag_array(labellist, function (labellist){
              
                    //console.log("[routes/tags.js] message 0 ", tagsliked);
                    // obtain the tagsliked from the user profile
                    obtain_tagslikedarray(userauthenticated, function(tagsliked){
                        
                        console.log("[routes/tags.js] message 3a", tagsliked);
                        if (req.query.cmd == "ltag") {
                            // add this take in the tagsliked array in the user profile
                            liketag((req.query.id), function(err){
                                console.log("[tags.js] ltag command ended.");   
                                // now again update the tagsliked array, after update in liketag function
                                obtain_tagslikedarray(userauthenticated, function(tagsliked){
                                    render(res, username, userisadmin, userauthenticated,  labellist, tagsliked)    
                                })
                                
                            })    
                        } else  if (req.query.cmd == "utag") {
                            // delete this tag from the tagsliked array in the user profile
                            unliketag((req.query.id), function(err){
                                console.log("[tags.js] utag command ended.");    
                                // now again pdate the tagsliked array, after update in unliketag function
                                obtain_tagslikedarray(userauthenticated, function(tagsliked){
                                    render(res, username, userisadmin, userauthenticated,  labellist, tagsliked)    
                                })
                                
                            })    
                        } else {
                             render(res, username, userisadmin, userauthenticated,  labellist, tagsliked)            
                        }
                        
//                        console.log("[routes/tags.js] message 3b", tagsliked);
//                        console.log(labellist);    
//                        console.log("[routes/tags.js] message 4", tagsliked);

                      }) // end of call to obtain_tagsliked function
                    
                }) // end of Tag.find function
                
            } // end gettagspage exported function
   } 