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



# get necessary environmental variables 
# . ./determine_environment

if [ "$ENV" = "TEST" ];
then
  DB="scholar"
  BUCKET="thirtyfourtest"
  . ./determine_environment
fi

if [ "$ENV" = "DEV" ];
then
  DB="scholar"
  BUCKET="thirtyfourtest"
fi

HOST="mongodb+srv://admin:$PASS@scholar.cyx09.mongodb.net/$DB"

collection_list="articles users"
for collection in $collection_list; do
	echo "exporting collection: " $collection
	mongoexport --uri $HOST  --collection $collection --out /tmp/scholar.$collection.json --forceTableScan && aws s3 cp /tmp/scholar.$collection.json s3://$BUCKET/scholar.$collection.json && echo " $ENV database $collection collection dumped successfully"
	aws s3 cp /tmp/scholar.$collection.json s3://$BUCKET/scholar.$collection.json.`date "+%Y-%m-%d"` && echo "File saved successfully to bucket $BUCKET" 
done
