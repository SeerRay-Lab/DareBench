# Create the test directory structure
mkdir -p testDir/subDir1 testDir/subDir2

# Create test files with different permissions
touch testDir/file1.txt testDir/subDir1/file2.txt testDir/subDir2/file3.txt
chmod 755 testDir/file1.txt
chmod 644 testDir/subDir1/file2.txt
chmod 777 testDir/subDir2/file3.txt

# Display the initial permissions for verification
echo "Initial permissions:"
find testDir -type f -exec ls -l {} \;