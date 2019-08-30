#!/bin/bash
# 'Human Sound Scuplture'
# Start web server and SuperCollider
#
# This file can be scheduled to run on startup.
# For this you can use crontab.
#	In a terminal type 'crontab -u pi -e' (assuming your username is 'pi').
#	Append the next two lines in the crontab file opened.
#	# Scheduling Human Sound Sculpture to start 1 minute after boot
#	@reboot sleep 60; /home/pi/Documents/myProjects/humanSoundSculpture/bin/startHSS.sh

# Bring interface up
/bin/ip link set wlan0 up

# Working directory of the piece
hssDir=/home/tassos/myProjects/humanSoundSculpture

# For each line of commonParameters, read 1st and 2nd element
while read parName parVal
do
    # Assume comments start with #. 
    # Don't use these lines
    if [ "$parName" != "#" ]
    then
	# Search and change common parameters in all files
	# except those in node_modules, bin and .git
	# if file {} is a regular file the substitute parName with parVal
	find $hssDir -type d \( -path ${hssDir}/node_modules -o -path ${hssDir}/bin -o -path ${hssDir}/.git \) \
	     -prune  -o \
	     -exec test -f {} \; -exec sed -i -e "s/$parName/$parVal/g" {} \;
    fi
done < ${hssDir}/bin/commonParameters

# Start up web server
/usr/local/bin/node ${hssDir}/server.js &

sleep 2

# Start headless SuperCollider
/usr/local/bin/sclang -D ${hssDir}/supercollider/humanSoundSculpture.scd
