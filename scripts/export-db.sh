#!/bin/sh
# 
# this script dumpts the database (test or dev) and copies to the S3 bucket
# 
# usage : not often, only when a new, crafted testset needs to be created and saved, for testing purpose.
#
# changes
#       date        Change
#       31-10-2020  correction of databasename.....
# 

 
. ./determine_environment

if [ "$ENV" == "TEST" ]
then
  DB="scholar"
  BUCKET="thirtyfourtest"
fi

if [ "$ENV" == "DEV" ]
then
  DB="dev"
  BUCKET="thirtyfourdev"
fi

mongoexport --db $DB --collection scholar --out /tmp/scholar.json && aws s3 cp /tmp/scholar.json s3://$BUCKET/scholar.json && echo " $ENV database dumped successfully"
aws s3 cp /tmp/scholar.json s3://$BUCKET/scholar.json.`date "+%Y-%m-%d"` && echo "File saved successfully to bucket $BUCKET" 
