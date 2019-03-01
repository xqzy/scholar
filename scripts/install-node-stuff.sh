#!/usr/bin/bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install 4.4.5
npm i -g pm2@2.4.3
pm2 start ~/Code/scholar/node/hello.js
:
