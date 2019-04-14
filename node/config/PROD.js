// use 'strict';

require('dotenv').config()
// the password to the database should be included in the environment variable
pw = process.env.PASS;
dbstr = "mongodb+srv://admin:" + pw + "\@scholar-cyx09.mongodb.net/test?retryWrites=true";

module.exports = {
  env: 'PROD',
  db:  dbstr,
  port:  process.env.PORT || 4000,
};