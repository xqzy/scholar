#!/bin/sh
cd /home/ec2-user/Code/scholar/scholar
scrapy crawl secmag
scrapy crawl krebs
scrapy crawl schneier
