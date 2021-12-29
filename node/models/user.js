var env = process.env.ENV || 'DEV';
var config = require(`../config/${env}`);

var url = config.db;
var dbname = config.dbname;
var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({

//     _id : String, not needed, mongoose takes care of ths....
    username: {
        type: String,
        required: true,
        unique: true
    },
    password:  {
        type: String,
        required: true
    },
    admin:   {
        type: Boolean,
        default: false
    },
    email: String,
    likes : [mongoose.Schema.Types.ObjectId],
    tagsliked : [String],
    sourcesliked:[String],
    firstName: String,
    lastName: String
});

var User = mongoose.model('User', UserSchema);
module.exports = User;