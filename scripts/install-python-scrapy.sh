#!/usr/bin/bash
cd /home/ec2-user

# create virtual environment for scrapy
echo $0  ": ### STEP  1 ### Creating environment"
/usr/bin/python3 -m venv scrapy-env
echo $0  : "### STEP 2 ###  Activating environment"
. scrapy-env/bin/activate
echo $0  : "### STEP 3 ###  Installing Scrapy"
pip install Scrapy
echo $0  : "### STEP 4 ###  Installing Pymongo"
pip install pymongo
echo $0  : "### STEP 5 ###  Installing Other modules"
pip install dnspython
pip install service_identity --force --upgrade
pip install python-decouple
