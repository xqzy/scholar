// use 'strict';
require('dotenv').config()
pw = process.env.PASS;
dbstr = "mongodb+srv://admin:" + pw + "\@scholar-cyx09.mongodb.net/test?retryWrites=true";
module.exports = {
  env: 'DEV',
  db:  dbstr,
  port:  process.env.PORT || 4000,
};

