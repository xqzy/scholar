/**
 * http://usejsdoc.org/
 */

var mongoose = require('mongoose');
var tagSchema = mongoose.Schema({
   _id: mongoose.Schema.Types.ObjectId,
    label: String,
    weight: Number,
});
 
 var Tag = mongoose.model('Tag', tagSchema);
 
 module.exports = Tag;