// use 'strict';
require('dotenv').config()
pw = process.env.PASS;
dbstr = "mongodb+srv://admin:" + pw + "\@scholar-cyx09.mongodb.net/scholar?retryWrites=true";


module.exports = {
  env: 'TEST',
  db:  dbstr,
  dbname: 'scholar',
  port:  process.env.PORT || 4000,
};

