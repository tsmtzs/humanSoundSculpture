#!/bin/bash

# Working directory of the piece
hssDir=/home/tassos/myProjects/humanSoundSculpture

# Kill processes sclang and node
killall node;
killall sclang;

# Set common parameters to their initial name
# For each line of commonParameters, read 1st and 2nd element
while read parName parVal
do
    # Assume comments start with #. 
    # Don't use these lines
    if [ "$parName" != "#" ]
    then
	# Search and change common parameters in all files
	# except those in node_modules, bin and .git
	# if file {} is a regular file the substitute parVal with parName
	find $hssDir -type d \( -path ${hssDir}/node_modules -o -path ${hssDir}/bin -o -path ${hssDir}/.git \) \
	     -prune  -o \
	     -exec test -f {} \; -exec sed -i -e "s/$parVal/$parName/g" {} \;
    fi
done < ${hssDir}/bin/commonParameters


# Shutdown computer
shutdown now;
