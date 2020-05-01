#!/bin/sh 


amixer sset 'Input Source',0 'Headset Mic'
amixer sset 'Input Source',1 'Headset Mic'
sleep 5

oak /app/src/server.js