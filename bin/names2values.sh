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

function replaceName2Value {
    local name=$1
    local value=$2
    # Search and change 'name' with 'value' in all files
    # under public/, webserver/ and systemd/.
    # If file {} is a regular file, then substitute name with value
    find ./public ./webserver ./systemd \
	 -exec test -f {} \; -exec sed -i -e "s|\$$name|$value|g" {} \;
}

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

	replaceName2Value $parName $parVal
    fi
done < $2

# Replace $HSS_DIR with the working directory
name="HSS_DIR"
value="$(pwd)"
replaceName2Value $name $value
