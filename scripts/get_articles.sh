#!/bin/sh
cd /home/ec2-user
. scrapy-env/bin/activate
cd Code/scholar/scholar
scrapy crawl bankinfosec
scrapy crawl computerweekly
scrapy crawl secmag
scrapy crawl krebs
scrapy crawl schneier
scrapy crawl theregister
deactivate
