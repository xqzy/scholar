#!/bin/sh
echo "Starting backup" 
. ./determine_environment

if [ "$ENV" == "TEST" ]
then
  DB="test"
  BUCKET="thirtyfourtest"
fi

if [ "$ENV" == "DEV" ]
then
  DB="dev"
  BUCKET="thirtyfourdev"
fi

mongoexport --db $DB --collection scholar --out /tmp/scholar.json && aws s3 cp /tmp/scholar.json s3://$BUCKET/scholar.json && echo " $ENV database dumped successfully"
aws s3 cp /tmp/scholar.json s3://$BUCKET/scholar.json.`date "+%Y-%m-%d"` && echo "File saved successfully to bucket $BUCKET" 
