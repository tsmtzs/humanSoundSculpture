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
HSS_DIR=/home/tassos/myProjects/humanSoundSculpture
# Export to a global variable
export HSS_DIR


# Replace all parameters from the
# firt arg: base directory
# second arg: parameter - value file
sh ${HSS_DIR}/bin/writeParValues.sh $HSS_DIR ${HSS_DIR}/bin/commonParameters

# Start up web server
/usr/local/bin/node ${HSS_DIR}/server.js &

sleep 2

# Start headless SuperCollider
/usr/local/bin/sclang -D ${HSS_DIR}/supercollider/humanSoundSculpture.scd
