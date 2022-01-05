#!/usr/bin/python
# -*- coding: utf-8 -*-

# SCript to search through articles and make recommendations (by scoring articles)
print ("[scholar/recommend.py] starting Python script")
import os
os.chdir('/home/ec2-user/Code/scholar/scholar')
import codecs   
import pymongo
import re
from scrapy.utils.project import get_project_settings
from datetime import datetime, date, timedelta
import logging

settings=get_project_settings()

print ("[scholar/recommend.py] server info ", settings.get('MONGODB_SERVER'))
print ("[scholar/recommend.py] port info   ", settings.get('MONGODB_PORT'))
print ("[scholar/recommend.py] db info   ", settings.get('MONGODB_DB'))
today = date.today()

recently = today - timedelta(days=14)


recent_str = recently.strftime('%Y/%m/%d')

print ("[scholar/recommend.py] calculated date : ", recently)
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

searchwords=[]
# searchwords = [ { 'match': 'ATM', 'score': 12 },
#                { 'match': 'PCI', 'score': 12 },
#                { 'match': 'debit', 'score': 12 },
#                { 'match': 'credit card', 'score': 12 },
#                { 'match': 'PIN', 'score': 12 },
#                { 'match': 'bank', 'score': 12 },
#                { 'match': '[bB]ank', 'score': 12 },
#                { 'match': 'risk management', 'score': 12 },
#                { 'match': '[Ff]inancial [Ss]ervices', 'score': 12 }
#              ]
myquery = {"username" : "rob"}
users = usertable.find(myquery)
tags=tagtable.find({})

# this first part is to calculate statistics
# the collection of tags is matched against the articles
# and for each match, the "hit" property of that tag is updated

for tag in tags:
    tlabel = tag["label"]
    print ("[scholar/recommend.py] Tag stat updating, tag:", tlabel)
    artsfound=articlecol.find({'tags.tagName': tlabel})
    newartsfound=articlecol.find({
        'tags.tagName' : tlabel,
        'pubDate' :  {'$gte' : recent_str}
    })
        
        
    #print ("[recommend.py] newhits ", tag["label"]," ", len(list(newartsfound)))
    tagtable.update_one(
      { "_id": tag["_id"]},
      #{ '$set': {"hits": 0}},
      { '$set': {"hits": len(list(artsfound)), "recenthits": len(list(newartsfound))}},
       upsert=True
    )
    
    # print ("af", artsfound.count())
for user in users:
  # print ("user: ", user)
  # there is no teration here, as there is onl one user
  likedtags = user["tagsliked"]
  for likedtag in likedtags:
    myquery = {"label" : likedtag}
    tags=tagtable.find(myquery)
    for tag in tags:
      searchword= {'match': tag["searchString"].encode('ascii','ignore'), 'score': 12}
      searchwords.append(searchword)
      # reset this hitcounter of the tag, so it can be recalculated

    
print ("liked tags found: ", tags)
print ("searchwords ", searchwords)
# first we reset the hitcounter in the tags collectoin


# now we cocluate scores for each of the tags liked. for this user

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
       # print ("sw , ", sw)
       # check hether the sw has the right type class
       if type(sw["match"])==bytes:
         sw["match"] = codecs.decode(sw["match"])
       # analyse description of article
       res = re.search(sw["match"], article["description"])
       if (res):
         score += sw["score"]
         print ("[recommend.py] hit searchword ", sw["match"] )
       if 'title' in article: 
         # analyse title of article
         bes = re.search(sw["match"], article["title"])
         if (bes):
           score += 2*sw["score"]
           print ("[recommend.py] hit searword in title")
       #else:
       #  print ("dummy regel")  
     articlecol.update_one(
       { "_id": article["_id"]},
       { '$set': {"score": score}}
     )
print ("Recommendation scores succesfully adjusted")

