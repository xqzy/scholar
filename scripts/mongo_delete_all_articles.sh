HOMEDIR=/home/ec2-user/Code/scholar
if mongo < $HOMEDIR/scripts/mongo_delete_all_articles
then
  echo "Articles Successfully deleted"
else
	echo ERROR deleting articles in Mongodb
	exit 1
fi

