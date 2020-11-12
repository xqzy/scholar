#!/bin/bash
if [ "$ENV" = "TEST" ] ;
then
    HOMEDIR="/home/ec2-user/Code/scholar"
fi

if [ "$ENV" = "DEV" ];
then
    HOMEDIR="/home/rob/eclipse-workspace/scholar"
fi


if [ "$ENV" = "PROD" ];
then
    exit
fi

mongo mongodb+srv://scholar.cyx09.mongodb.net -u admin -p $PASS <<EOF
use scholar
db.articles.remove({})
db.users.remove({})
EOF



