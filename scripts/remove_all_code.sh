#!/bin/sh
#
# rm -rf /home/ec2-user/Code/scholar/*
#
find /home/ec2-user/Code/scholar ! -name node_modules -exec rm -f {} \;
#/usr/bin/ls
echo "hi"