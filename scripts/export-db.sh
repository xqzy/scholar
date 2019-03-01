echo "Starting backup" 
mongoexport --db test --collection scholar --out /tmp/scholar.json && aws s3 cp /tmp/scholar.json s3://thirtyfourtest/scholar.json && echo " Success"
