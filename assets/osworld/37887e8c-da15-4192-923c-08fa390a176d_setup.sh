#!/bin/bash

# Define the base directory for our test
BASE_DIR="/tmp/test_files"
FILE="$BASE_DIR"

# Create the directory structure
mkdir -p "$BASE_DIR/old_files"
mkdir -p "$BASE_DIR/new_files"

# Create files with modification times 30 days ago and today
# Files to be compressed
touch "$BASE_DIR/old_files/old_file1.txt"
touch "$BASE_DIR/old_files/old_file2.txt"

# Files not to be compressed
touch "$BASE_DIR/new_files/new_file1.txt"
touch "$BASE_DIR/new_files/new_file2.txt"

# Set the modification and access times
# 30 days ago for old files
find "$BASE_DIR/old_files" -type f -exec touch -d "30 days ago" {} \;

# Current date for new files (to ensure they are not compressed)
find "$BASE_DIR/new_files" -type f -exec touch -d "now" {} \;
