/**
 * http://usejsdoc.org/
 */

var User = require('../models/user');
var bCrypt = require('bcrypt-nodejs');

module.exports  = function(req, username, password, done){
       console.log('[signup.js] -> entry point');
//
            findOrCreateUser = function(){
                // find a user in Mongo with provided username
                console.log('[signup.js] findorcreateuser');
                User.findOne({ 'username' :  username }, function(err, user) {
                    // In case of any error, return using the done method
                    if (err){
                        console.log('Error in SignUp: '+err);
                        return done(err);
                    }
                    // already exists
                    if (user) {
                        console.log('User already exists with username: '+username);
                        return done(new Error('user already exists'), null);
//                        return done(null, false, req.flash('message','User Already Exists'));
//                         done(new Error ('user already exists'));
                    } else {
                        // if there is no user with that email
                        // create the user
                        var newUser = new User();
                        // set the user's local credentials
                        // newUser._id = new ObjectID();
                        newUser.username = username;
                        newUser.password = createHash(password);
                        //newUser.email = req.param('email');
                        //newUser.firstName = req.param('firstName');
                        //newUser.lastName = req.param('lastName');

                        // save the user
                        newUser.save(function(err) {
                            if (err){
                                console.log('[signup.js] Error in Saving user: '+err);  
                                throw err;  
                            }
                            console.log('[signup.js]  User Registration succesful');    
                            return done(null, newUser);
                        });
                    }
                });
            };
            // Delay the execution of findOrCreateUser and execute the method
            // in the next tick of the event loop
            process.nextTick(findOrCreateUser);

//        })   // end of the callback functoin of the localstrategy for the  signup as part of passport.
//    );

    // Generates hash using bCrypt
    var createHash = function(password){
        return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
    }

}