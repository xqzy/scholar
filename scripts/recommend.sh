#!/usr/bin/bash
export HOME=/home/ec2-user
. $HOME/scrapy-env/bin/activate
python $HOME/Code/scholar/scholar/recommend.py
deactivate
# no worries