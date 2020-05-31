#!/bin/bash
# ##################################################
#		Human Sound Sculpture
#
# A bash script that replaces bash environment variable
# values with their names. 
# Arguments: the file(s) that the replacement
#		will take place.
# ##################################################

if [ "$#" == "0" ]; then
    echo "You should pass at least one file."
    exit 1
fi

if [ -z "$HSS_IP" ] || [ -z "$WEBSOCKET_PORT" ]; then
    echo "At least one of the variables HSS_IP and WEBSOCKET_PORT is empty."
    exit 1
fi

while (("$#")); do
	/usr/bin/sed -i -e "s/${HSS_IP}/HSS_IP/g" -e "s/${WEBSOCKET_PORT}/WEBSOCKET_PORT/g" $1

    shift
done
