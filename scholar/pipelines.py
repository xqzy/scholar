# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://doc.scrapy.org/en/latest/topics/item-pipeline.html

import pymongo
from scrapy.utils.project import get_project_settings
from scrapy.exceptions import DropItem
import logging

class ScholarPipeline(object):
    def __init__(self):
	settings=get_project_settings()
	connection = pymongo.MongoClient(
		settings.get('MONGODB_SERVER'),
		settings.get('MONGODB_PORT')
	)
	db=connection[settings('MONGODB_DB')]
	self.collection = db[settings('MONGODB_COLLECTION')]		


    def process_item(self, item, spider):
        valid = True
        for data in item:
            if not data:
                valid = False
                raise DropItem("Missing {0}!".format(data))
        if valid:
            myquery = {"title": item['title']}
            rsults = self.collection.find(myquery)
            if rsults.count() == 0:      
              self.collection.insert(dict(item))
              log.msg("Article added to MongoDB database!",
                    level=log.DEBUG, spider=spider)
            else:
               log.msg("Duplicate article : not added:"+item['title'],
                    level=log.DEBUG, spider=spider)
        return item

