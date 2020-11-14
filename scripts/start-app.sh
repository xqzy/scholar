su - ec2-user -c "cd ~/Code/scholar/node && pm2 delete hello.js 2> /dev/null &&  pm2 start hello.js"

