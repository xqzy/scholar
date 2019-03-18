aws s3 cp s3://thirtyfourtest/scholar.json /tmp/scholar.json
mongoimport --db test --collection scholar --type json --file /tmp/scholar.json
