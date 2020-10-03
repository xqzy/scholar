// use 'strict';
require('dotenv').config()
pw = process.env.PASS;

// url to databases
dbstr = "mongodb+srv://admin:" + pw + "\@scholar-cyx09.mongodb.net/test?retryWrites=true";


module.exports = {
  env: 'TEST',
  db:  dbstr,
  dbname: 'scholar',			// database name for articles
  dbusers: 'users',   			// database name for user registration
  port:  process.env.PORT || 4000,
};

