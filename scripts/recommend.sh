#!/usr/bin/bash
echo "[scripts/recommend.sh] starting recommendation from bash"
export HOME=/home/ec2-user
. $HOME/scrapy-env/bin/activate
echo "[scripts/recommend.sh] invoking recommend.py"
python $HOME/Code/scholar/scholar/recommend.py
deactivate
# no worries