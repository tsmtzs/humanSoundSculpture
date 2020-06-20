#!/bin/bash
# ##################################################
#		Human Sound Sculpture
#
# A bash script that sets project global variables to
# their initial name. 
# Arguments:
#	1st arg: base directory
#	2nd arg: A file with pairs parameter name - value.
#		 Pairs are one per line.
#		 Lines that start with a # are not processed.
# ##################################################

# For each line of the input file, read the 1st and 2nd 'words'
while read parName parVal
do
    # Assume comments start with #. 
    # Don't use these lines
    if [ "$parName" != "#" ]
    then
	# Search and change common parameters in all files
	# except those in node_modules, bin and .git
	# if file {} is a regular file the substitute parVal with parName
	find $1 -type d \( -path ${1}/node_modules -o -path ${1}/bin -o -path ${1}/.git \) \
	     -prune  -o \
	     -exec test -f {} \; -exec sed -i -e "s|$parVal|$parName|g" {} \;
    fi
done < $2
