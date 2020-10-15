const mongoose = require('mongoose');
var mongooseuri="mongodb+srv://admin:6fA6qU4fqq4g@scholar.cyx09.mongodb.net/scholardev?retryWrites=true&w=majority";

// mongoose.set('bufferCommands', false);

//  catch(error => handleError(error));

var articleSchema = mongoose.Schema({
 //   _id: mongoose.Schema.Types.ObjectId,
    description: String,
    pubDate: String,
    title :  String,
    show : Number,
    score : Number,
    link : String,
    like : Number
});
 
// const Article = mongoose.model('article', articleSchema, 'article');

async function createArticle(desc) {
  return new Article({
    descritpion: desc,
    pubDate: '01-01-2001',
    title: 'titel',
    show: 1,
    score: 100,
    link: 'http://www.nu.nl',
    like: 1,
   }).save();
}

async function findArticle(desc) {
  return await Article.findOne({desc});
}

;(async () => {
  const connector = mongoose.connect(mongooseuri);
  const description = 'beschrijving';
  let article = await connector.then(async() => {
    return findArticle(description);
  });
  
  if(!article) {
    article = await createArticle(description);
  }
  
  console.log(article);
  process.exit(0);
})()


  
  