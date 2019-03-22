echo "########## starting import_db.sh ####" `date`
if [ "$ENV" == "TEST" ] 
then
  BUCKET="thirtyfourtest"
  DB="test"
fi


if [ "$ENV" == "DEV" ] 
then
  BUCKET="thirtyfourdev"
  DB="dev"
fi

if [ "$ENV" == "DEV" -o "$ENV" == "TEST" ] 
then
  aws s3 cp s3://$BUCKET/scholar.json /tmp/scholar.json
  ./mongo_delete_all_articles.sh
  mongoimport --db $DB  --collection scholar --type json --file /tmp/scholar.json

  echo "database $DB imported"
else
  echo "database not imported, environment value not set (in tag ec2 instance"
fi
echo "########## exiting  import_db.sh ####" `date`
