#!/bin/bash
# ##################################################
#		Human Sound Sculpture
#
# This script copies all files and directories under
# ./scr to ./humanSoundSculpture.
# ##################################################

function copySrcFiles {
    cp -r ./src/* .
}

function handleAnswer {
    if [ "$1" == "Yes" ]; then
	copySrcFiles
    elif [ "$1" == "n" ]; then
	exit
    else
        echo "Please type 'Yes' or 'n'."

	read answer
	handleAnswer $answer
    fi
}

if [ -d ./systemd -o -d ./conf -o -d ./webserver -o -d ./public ]; then
    echo "One or more of the directories 'systemd', 'webserver', 'conf', 'public' exists."
    echo "Replace them? (Yes|n)"

    read answer

    handleAnswer $answer
else
    copySrcFiles
fi
