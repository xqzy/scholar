// use 'strict';
require('dotenv').config()
pw = process.env.PASS;

// dbstr = "mongodb://admin:" + pw + "\@schoolar.cyx09.mongodb.net/scholardev";
dbstr = "mongodb+srv://admin:" + pw + "@scholar.cyx09.mongodb.net/scholardev?retryWrites=true&w=majority";
module.exports = {
  env: 'DEV',
  db:  dbstr,
  dbname: 'articles',
  port:  process.env.PORT || 4000,
};

