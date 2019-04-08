#!/usr/bin/bash
chmod 755 ~/Code/scholar/scripts/*
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install v10.15.1
npm i -g pm2@2.4.3
npm install express
npm install mongodb
npm install pug
npm install -g mocha
npm install chai
npm install chai-http
npm install dotenv
pm2 start ~/Code/scholar/node/hello.js

