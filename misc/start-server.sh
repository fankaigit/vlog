#!/usr/bin/env bash
# @author   fankai
# @date     Jan 10 08:40:34 AM CST 2018


killall node

nohup node server/src/server.js >>/var/log/vlog 2>&1 &!
