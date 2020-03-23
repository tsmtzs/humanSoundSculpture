#!/bin/bash
# ##################################################
#		Human Sound Sculpture
#
# A bash script that replaces in the given files
# bash environment variables with their names.
# Argument: the file/directory that the replacement
#		will take place.
# ##################################################

/usr/bin/sed -i -e "s/${HSS_IP}/HSS_IP/g" -e "s/${WEBSOCKET_PORT}/WEBSOCKET_PORT/g" $1
