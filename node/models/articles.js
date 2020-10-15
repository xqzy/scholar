
var mongoose = require('mongoose');
var articleSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    description: String,
    pubDate: String,
    title :  String,
    show : Number,
    source : String,
    score : Number,
    link : String,
    like : Number,
});
 
 var Article = mongoose.model('Article', articleSchema);
 
 module.exports = Article;