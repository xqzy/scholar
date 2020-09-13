#!/usr/bin/python
# -*- coding: utf-8 -*-

# SCript to search through articles and make recommendations (by scoring articles)

import pymongo
import re
from scrapy.utils.project import get_project_settings
import logging

settings=get_project_settings()
try:
    connection = pymongo.MongoClient(
      settings.get('MONGODB_SERVER'),
      settings.get('MONGODB_PORT')
    )
except pymongo.errors.ConnectionFailure, e:
    print "Could not connect to database: %s " % e
db=connection[settings.get('MONGODB_DB')]
articlecol = db[settings.get('MONGODB_COLLECTION')]		

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

articles = articlecol.find()
print "number of records found: ", articles.count()
teller = 0
for article in articles:
   teller += 1;
#    print "teller {teller}", teller;
   score = 100
   for sw in searchwords:
     # analyse description of article
     res = re.search(sw["match"], article["description"])
     if (res):
       score += sw["score"]
     # analyse title of article
     res = re.search(sw["match"], article["title"])
     if (res):
       score += 2*sw["score"]
	
   articlecol.update_one(
     { "_id": article["_id"]},
     { '$set': {"score": score}}
   )
print "Recommendation scores succesfully adjusted"

