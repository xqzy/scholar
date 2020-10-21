
var mongoose = require('mongoose');
var UserSchema = mongoose.Schema({

    _id : String,
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
    firstName: String,
    lastName: String
});

var User = mongoose.model('User', UserSchema);
module.exports = User;