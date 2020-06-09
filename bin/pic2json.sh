#!/bin/bash

function join { local IFS="$1"; shift; echo "$*"; }

relativePath=$1
jsonArray=()

for file in ${@:2}; do
    fullname=$(basename "$file")
    json=''

    # Get image's size.
    # From llogan's answer on
    # https://askubuntu.com/questions/577090/one-liner-ffmpeg-or-other-to-get-only-resolution
    size=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 $file)

    # Get image MIME type.
    # jozxyqk's and bhups's answer on
    # https://stackoverflow.com/questions/2227182/how-can-i-find-out-a-files-mime-type-content-type
    mime=$(file -b --mime-type $file)


    # Convert to json
    # From Diego Torres Milano's asnwer on
    # https://stackoverflow.com/questions/48470049/build-a-json-string-with-bash-variables?noredirect=1&lq=1
    JSON_FMT=$'{"src":"%s","sizes":"%s","type":"%s"}'

    json=$(printf "$JSON_FMT" "${relativePath}/${fullname}" "$size" "$mime")

    # echo $json
    jsonArray+=(${json})
done

echo "${jsonArray[@]}" | json_reformat -s
