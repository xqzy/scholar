
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

articleSchema.methods.updateTags = function (tagarray, err, done) {

    
    // fetch registered tags collection
    var i=0;
    // remove all tags for this article 
    this.tags=[];
    this.tags.length=0
    
    // only check when there is a description, skip when it is missing
    if (! this.description)  {
        console.log ('article.js: no match found with tags in article ' + this._id);
        } else {
    
          // iterate through all tags in the collection
             for  (let i=0; i<tagarray.length; i++)  {        
    
                
                 // now search through the description with the tag-searchstring
                    var r= this.description.search(tagarray[i].searchString);
                    if ( r!= -1) {
                        // and insert a new tag to the article, when something is found.
                        console.log('article.js: inserted tag' + tagarray[i].label + ' in article ' + this._id);
                        this.tags.push({tagName: tagarray[i].label, tagWeight: 1})
                        
                    } else {
                        var r=this.title.search(tagarray[i].searchString);
                        if (r!=-1) {
                            console.log('article.js: inserted tag' + tagarray[i].label + ' in article ' + this._id);
                            this.tags.push({tagName: tagarray[i].label, tagWeight: 1})
                                
                        }
                    }
             }  //for
            
    }  // else
     

    // for each tag in tagcollection
    // search the article with the text and add tagg when necessary
    // this.tags=[{tagName: "ransomware" , tagWeight: 1}]
    this.save();
    console.log('tags added to article: ' + this.tags)
    done();
}

 var Article = mongoose.model('Article', articleSchema);
 
 module.exports = Article;