# Set common parameters to their initial name
# For each line of commonParameters, read 1st and 2nd element
# First arg: base directory
# Second arg: parameter name - value file
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
	     -exec test -f {} \; -exec sed -i -e "s/$parVal/$parName/g" {} \;
    fi
done < $2
