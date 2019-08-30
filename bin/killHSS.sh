#!/bin/bash

# Working directory of the piece
hssDir=/home/tassos/myProjects/humanSoundSculpture

# Kill processes sclang and node
killall node;
killall sclang;

# firt arg: base directory
# second arg: parameter - value file
sh ${hssDir}/bin/writeParNames.sh $hssDir ${hhsDir}/bin/commonParameters

# Shutdown computer
shutdown now;
