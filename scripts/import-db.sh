#!/bin/bash
echo "[import-db.sh] [DEBUG]  ########## starting import_db.sh ####" `date`
if [ "$ENV" == "TEST" ] 
then
  BUCKET="thirtyfourtest"
  DB="scholar"
fi


if [ "$ENV" == "DEV" ] 
then
  BUCKET="thirtyfourtest"
  DB="scholar"
fi

HOST="mongodb+srv://admin:$PASS@scholar.cyx09.mongodb.net/$DB"
#
# extra step for test environemnt -> put reference database in the right location
# name of references database is *.ref
#

if [ "$ENV" == "TEST" ]
then
  if [ ! -f /tmp/fdbimp ]
  then
    aws s3 cp s3://$BUCKET/scholar.articles.json.ref s3://$BUCKET/scholar.articles.json
    aws s3 cp s3://$BUCKET/scholar.users.json.ref s3://$BUCKET/scholar.users.json
    echo " reference test database restored at " `date` >> /tmp/fdbimp 
  fi  
fi

if [ "$ENV" == "DEV" -o "$ENV" == "TEST" ] 
then
  /home/ec2-user/Code/scholar/scripts/mongo_delete_all_articles.sh
  collection_list="articles users"
  echo "[import-db.sh] [DEBUG] returned from deleting articles"
  for collection in $collection_list; do
	echo "[import-db.sh] [DEBUG] copying collection $collection from aws to /tmp"
    aws s3 cp s3://$BUCKET/scholar.$collection.json /tmp/scholar.$collection.json
	echo "[import-db.sh] [DEBUG] mongoimport $collection from  /tmp file " 
    mongoimport --uri $HOST  --collection $collection --type json --file /tmp/scholar.$collection.json  && echo " $ENV database $collection collection imported successfully"
#    mongonimport --db $DB  --collection scholar --type json --file /tmp/scholar.json
  done
  echo "database $DB imported"
else
  echo "database not imported, environment value not set (in tag ec2 instance"
fi
echo "########## exiting  import_db.sh ####" `date`
