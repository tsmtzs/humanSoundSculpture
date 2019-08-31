#!/bin/bash
# HSS_DIR is an environment variable set at file ./startHSS.sh
# It holds the working directory of the piece

# Kill processes sclang and node
killall node;
killall sclang;

# firt arg: base directory
# second arg: parameter - value file
sh ${HSS_DIR}/bin/writeParNames.sh $HSS_DIR ${HSS_DIR}/bin/commonParameters

# Shutdown computer after one minute
shutdown +1;

