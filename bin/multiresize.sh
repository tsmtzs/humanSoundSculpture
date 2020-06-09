#!/bin/bash
# ##################################################
#		Human Sound Sculpture
# A help script to generate the icons for the
# webmanifest file.
#
# Discussion:	This programme is used to resize
#		a given image 'name.ext' to size NxN.
#		The output picture is saved as
#		'name_NxN.ext'.
# args:
#	$1 - an image file
#	rest args - new size(s)
# ##################################################

# Resize a given image name.ext to
# size NxN.
# The output picture is saved as 'name_NxN.ext'.

# Usage script
function usage() {
    echo "Usage: $0 <filename> <size(s)>"
}

# Print usage if number of args given is less than 2.
if [[ "$#" < "2" ]]; then
    usage
    exit 1
fi


if [[ ! -e $1 ]]; then
    echo "First argument should be a picture file."
    exit 1
fi

# Strip the file name from arg1
fl=$(basename "$1")
# Save the extension of the file to 'extension'
extension="${fl##*.}"
# Save the name of the file to 'filename'
filename="${fl%.*}"

for size in ${@:2}; do
    out="${filename}_${size}x${size}.${extension}"

    # Resize picture to SIZE x SIZE
    ffmpeg -i "${fl}" -vf scale=${size}:-1 "${out}"
done
