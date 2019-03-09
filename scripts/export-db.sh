echo "Starting backup" 
mongoexport --db test --collection scholar --out /tmp/scholar.json && aws s3 cp /tmp/scholar.json s3://thirtyfourtest/scholar.json && echo " Database dumped successfully"
aws s3 cp /tmp/scholar.json s3://thirtyfourtest/scholar.json.`date "+%Y-%m-%d"` && echo "File saved successfully"
