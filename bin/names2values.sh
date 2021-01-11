#!/bin/bash
# ##################################################
#		Human Sound Sculpture
#
# A bash script that sets project global variable
# names to values.
# Arguments:
#	1st arg: Path of the Human Sound Sculpture repository.
#	2nd arg: A file with pairs of the form parameter name - value.
#		 Pairs are written one per line.
#		 Lines that start with a # are not processed.
# ##################################################

# A regular expression pattern that
# matches the first three leftmost
# bytes of an IP address.
ipExpr="([0-9]{1,3}\.){3}"

# For each line of the input file, read the 1st and 2nd 'words'.
while read parName parVal
do
    # Assume comments start with #.
    # Don't use these lines
    if [ "$parName" != "#" ]
    then
	# Save the leftmost three bytes of IP
	# to the global variable HSS_NETWORK
	if [[ "$parName" == "HSS_IP" ]]; then
	    # Regular expression comparison:
	    if [[ $parVal =~ $ipExpr ]]; then
		HSS_NETWORK="${BASH_REMATCH[0]}"
		# Replace HSS_NETWORK
		# ONLY in systemd/dhcpd.conf
		sed -i -e "s|\$HSS_NETWORK|$HSS_NETWORK|g" $1/conf/dhcpd.conf
	    fi
	fi

	# Search and change common parameters in all files
	# under public/, webserver/ supercollider/ and systemd/.
	# If file {} is a regular file, then substitute parName with parVal
	find $1/public $1/webserver $1/supercollider $1/systemd \
	     -exec test -f {} \; -exec sed -i -e "s|\$$parName|$parVal|g" {} \;
    fi
done < $2
