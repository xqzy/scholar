HOMEDIR=/home/ec2-user/Code/scholar
if mongo < $HOMEDIR/scripts/mongo_delete_all_articles.$ENV
then
  echo "Articles Successfully deleted from $ENV database"
else
	echo ERROR deleting articles in Mongodb
	exit 1
fi

