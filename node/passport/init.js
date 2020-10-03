
var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');

module.exports = function(passport){
	console.log("[passport/init.js] starting initcode " );
	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('[passport/init.js] serializing user: ');console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('[passport/init.js] deserializing user:',user);
            done(err, user);
        });
    });

    // Setting up Passport Strategies for Login and SignUp/Registration
    console.log("[passport/init.js] initializing passport strategies for login/signup" );
    //login(passport);
    //signup(passport);

}