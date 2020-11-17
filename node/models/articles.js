
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
    tags : [{ tagName: String, tagWeight : Number}],
});

articleSchema.methods.updateTags = function () {
    // fetch registered tags collection
    var Tag = require('../models/tags');
    // remove all tags
    this.tags.length = 0;
    // for each tag in tagcollection
    // search the article with the text and add tagg when necessary
    this.tags=[{tagName: "ransomware" , tagWeight: 1}]
    return true;
}

 var Article = mongoose.model('Article', articleSchema);
 
 module.exports = Article;