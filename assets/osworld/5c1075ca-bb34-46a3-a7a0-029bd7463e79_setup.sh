#!/bin/bash

# Create a sample directory structure
mkdir -p test_environment/dir1
mkdir -p test_environment/dir2/subdir1
mkdir -p test_environment/dir3

# Navigate into the test environment
cd test_environment

# Create .ipynb files, including those that match the pattern *failed.ipynb
touch dir1/a_failed.ipynb
touch dir1/b.ipynb
touch dir2/subdir1/c_failed.ipynb
touch dir2/d.ipynb
touch dir3/e_failed.ipynb

# Navigate back to the original directory
cd ..

echo "Setup complete."