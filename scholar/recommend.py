#!/usr/bin/python
# -*- coding: utf-8 -*-

# SCript to search through articles and make recommendations (by scoring articles)

import os
os.chdir('/home/ec2-user/Code/scholar/scholar')

import pymongo
import re
from scrapy.utils.project import get_project_settings
import logging

settings=get_project_settings()

print ("server info ", settings.get('MONGODB_SERVER'))
print ("port info   ", settings.get('MONGODB_PORT'))


try:
    connection = pymongo.MongoClient(
      settings.get('MONGODB_SERVER'),
      settings.get('MONGODB_PORT')
    )
except (pymongo.errors.ConnectionFailure) as e:
    print ("Could not connect to database: %s " % e)
db=connection[settings.get('MONGODB_DB')]
articlecol = db[settings.get('MONGODB_COLLECTION')]	
usertable = db[settings.get('MONGODB_USERS')]	
tagtable = db[settings.get('MONGODB_TAGS')]

searchwords = [ { 'match': 'ATM', 'score': 12 },
                { 'match': 'PCI', 'score': 12 },
                { 'match': 'debit', 'score': 12 },
                { 'match': 'credit card', 'score': 12 },
                { 'match': 'PIN', 'score': 12 },
                { 'match': 'bank', 'score': 12 },
                { 'match': '[bB]ank', 'score': 12 },
                { 'match': 'risk management', 'score': 12 },
                { 'match': '[Ff]inancial [Ss]ervices', 'score': 12 }
              ]
myquery = {"username" : "rob"}
users = usertable.find(myquery)
for user in users:
  # there is no teration here, as there is onl one user
  likedtags = user["tagsliked"]
  for likedtag in likedtags:
    myquery = {"label" : likedtag}
    tags=tagtable.find(myquery)
    for tag in tags:
      searchword= {'match': tag["searchString"].encode('ascii','ignore'), 'score': 12}
      searchwords.append(searchword)
 
    
print ("liked tags found: ", tags)
print ("searchwords ", searchwords)
articles = articlecol.find()
print ("number of records found: ", articlecol.count_documents({}))
teller = 0
for article in articles:
   teller += 1;
   print ("teller {teller}", teller)
   
   # if article["score"] == 0 and 'description' in article :
   if 'description' in article :
     score = 100
     for sw in searchwords:
       # analyse description of article
       res = re.search(sw["match"], article["description"])
       if (res):
         score += sw["score"]
         print (" hit searchword ", sw["match"] )
       # analyse title of article
       res = re.search(sw["match"], article["title"])
       if (res):
         score += 2*sw["score"]
         print (" title hit searchword ", sw["match"] )
	
   
   
     articlecol.update_one(
       { "_id": article["_id"]},
       { '$set': {"score": score}}
     )
print ("Recommendation scores succesfully adjusted")

