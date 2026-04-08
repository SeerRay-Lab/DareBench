#!/bin/bash

# Expected output
expected=$'1<br/>\n2<br/>\n3<br/>'

# Actual output from the file
actual=$(cat /home/user/output.txt)

echo "Expected:"
echo "$expected" | od -c
echo "Actual:"
echo "$actual" | od -c


# Compare the expected output with the actual output
if [ "$expected" == "$actual" ]; then
    echo "Success: The task has been completed correctly."
else
    echo "Failure: The task has not been completed correctly."
fi