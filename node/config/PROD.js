// use 'strict';
require('dotenv').config()
pw = process.env.PASS;
databasename = 'scholarprod';
dbstr = "mongodb+srv://admin:" + pw + "\@scholar-cyx09.mongodb.net/" + databasename + "?retryWrites=true";

module.exports = {
  env: 'PROD',
  db:  dbstr,
  dbname: 'scholarprod',
  port:  process.env.PORT || 4000,
};
