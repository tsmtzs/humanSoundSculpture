#!/bin/bash
# Run 'Human Sound Scuplture'

hssDir=$(pwd);
echo $hssDir;

# Start up web server
node ${hssDir}/server.js &

echo "Node web server started";

# Start headless SuperCollider
sclang -D ${hssDir}/supercollider/humanSoundSculpture.scd $

echo "SuperCollider started";
