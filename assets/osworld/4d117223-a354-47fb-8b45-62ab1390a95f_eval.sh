# Evaluation script to verify that all regular files have permissions set to 644
allFilesCorrect=1
while IFS= read -r line; do
    # Extract the permission and file path
    perm=$(echo "$line" | awk '{print $1}')
    file=$(echo "$line" | awk '{print $9}')

    # Check if the permission is not 644
    if [[ "$perm" != "-rw-r--r--" ]]; then
        echo "Incorrect permission for $file: $perm"
        allFilesCorrect=0
    fi
done < <(find testDir -type f -exec ls -l {} \;)

if [ "$allFilesCorrect" -eq 1 ]; then
    echo "All files have the correct permissions."
else
    echo "Some files do not have the correct permissions."
fi