// use 'strict';
require('dotenv').config()
pw = process.env.PASS;
databasename = 'scholar';
dbstr = "mongodb+srv://admin:" + pw + "\@scholar-cyx09.mongodb.net/" + databasename + "?retryWrites=true";


module.exports = {
  env: 'TEST',
  db:  dbstr,
  dbname: databasename,
  port:  process.env.PORT || 4000,
};

