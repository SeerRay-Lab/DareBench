#!/bin/bash

# Remove existing directories and file if they exist
rm -rf dir1 dir2 dir3
rm -f file1

# Create a new file named 'file1'
echo "This is a test file named file1." > file1

# Create directories 'dir1', 'dir2', and 'dir3'
mkdir dir1 dir2 dir3

echo "Setup completed."