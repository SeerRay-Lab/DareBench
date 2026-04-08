#!/bin/bash

# Function to check if file1 exists in a directory
check_file_in_dir() {
    if [ -f "$1/file1" ]; then
        echo "Success: file1 exists in $1."
    else
        echo "Failure: file1 does not exist in $1."
        exit 1
    fi
}

# Check each directory
check_file_in_dir dir1
check_file_in_dir dir2
check_file_in_dir dir3
