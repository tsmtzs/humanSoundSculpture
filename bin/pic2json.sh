#!/bin/bash
# ##################################################
#		Human Sound Sculpture
# 
# Discussion:	This little program is a help script
#		that generates a json formated text.
#		The output string is suitable for the
#		'icons' field of a webmanifest
#		json file.
#		
# args:
#	$1 - A path that prepends the file name in
#	     the field "src".
#	>$1 - Image file names under current working
#	     directory.
#
# Surely, there are neater ways to do the same thing
# in bash. (jq??)
# ##################################################

# Usage script
function usage() {
    echo "Usage: $0 <path> <image(s)>"
}

# Print usage if number of args given is less than 2.
if [[ "$#" < "2" ]]; then
    usage
    exit 1
fi


relativePath=$1
argArray=($@)
JSON=$'[\n'

for ((i=1; i < $#; i++)); do
    file=${argArray[$i]}
    fullname=$(basename "$file")

    # Get image's size.
    # From llogan's answer on
    # https://askubuntu.com/questions/577090/one-liner-ffmpeg-or-other-to-get-only-resolution
    size=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 $file)

    # Get image MIME type.
    # jozxyqk's and bhups's answer on
    # https://stackoverflow.com/questions/2227182/how-can-i-find-out-a-files-mime-type-content-type
    mime=$(file -b --mime-type $file)
 
    jsonEntry='{
    "src": "%s",
    "sizes": "%s",
    "type": "%s"
}'
    json=$(printf "$jsonEntry" "${relativePath}/${fullname}" "$size" "$mime")

    JSON+=$json
    
    if (( $i != $# - 1 )); then
    	JSON+=$',\n'
    fi
done

JSON+=$'\n]'

echo "${JSON}"
