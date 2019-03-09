#!/usr/bin/python
# -*- coding: utf-8 -*-

# SCript to search through articles and make recommendations (by scoring articles)

import pymongo
import re
from scrapy.conf import settings
from scrapy import log

connection = pymongo.MongoClient(
  settings['MONGODB_SERVER'],
  settings['MONGODB_PORT']
)
db=connection[settings['MONGODB_DB']]
articlecol = db[settings['MONGODB_COLLECTION']]		

searchwords = [ { 'match': 'ATM', 'score': 12 },
                { 'match': 'PCI', 'score': 12 },
                { 'match': 'debit', 'score': 12 },
                { 'match': 'credit card', 'score': 12 },
                { 'match': 'bank', 'score': 12 }
              ]

articles = articlecol.find()
for article in articles:
   score = 12
   for sw in searchwords:
     res = re.search(sw["match"], article["description"])
     if (res):
       score += sw["score"]
	
   articlecol.update_one(
     { "_id": article["_id"]},
     { '$set': {"score": score}}
   )

