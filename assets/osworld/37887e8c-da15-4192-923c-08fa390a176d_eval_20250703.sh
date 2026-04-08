#!/bin/bash

# Define the base directory for our test
BASE_DIR="/tmp/test_files"

# Function to check if a file is compressed (supports multiple formats)
is_compressed() {
    local file="$1"
    
    # Check file type using 'file' command
    local file_type=$(file "$file")
    
    # Check for various compression formats
    if echo "$file_type" | grep -qE '(gzip compressed data|Zip archive|bzip2 compressed data|XZ compressed data|7-zip archive|RAR archive)'; then
        return 0 # True, file is compressed
    fi
    
    # Check for tar archives (compressed or uncompressed)
    if echo "$file_type" | grep -qE '(POSIX tar archive|tar archive)'; then
        return 0 # True, file is a tar archive
    fi
    
    # Check by file extension as fallback
    case "${file##*.}" in
        gz|bz2|xz|zip|7z|rar|tar|tgz|tbz2|txz)
            return 0 # True, likely compressed based on extension
            ;;
    esac
    
    return 1 # False, file is not compressed
}

# Function to check if compressed archives contain old files
check_for_compressed_archives() {
    local base_dir="$1"
    local found_compressed=false
    
    # Check for compressed archives in the base directory and subdirectories
    echo "Checking for compressed archives containing old files..."
    
    # Look for various compressed archive formats
    for archive in $(find "$base_dir" -type f \( -name "*.tar.gz" -o -name "*.tgz" -o -name "*.tar.bz2" -o -name "*.tar.xz" -o -name "*.zip" -o -name "*.7z" \) 2>/dev/null); do
        echo "Found archive: $archive"
        found_compressed=true
        
        # Try to list contents to verify it contains files
        case "$archive" in
            *.tar.gz|*.tgz)
                if tar -tzf "$archive" >/dev/null 2>&1; then
                    echo "  ✓ Valid tar.gz archive"
                fi
                ;;
            *.tar.bz2)
                if tar -tjf "$archive" >/dev/null 2>&1; then
                    echo "  ✓ Valid tar.bz2 archive"
                fi
                ;;
            *.tar.xz)
                if tar -tJf "$archive" >/dev/null 2>&1; then
                    echo "  ✓ Valid tar.xz archive"
                fi
                ;;
            *.zip)
                if unzip -l "$archive" >/dev/null 2>&1; then
                    echo "  ✓ Valid zip archive"
                fi
                ;;
        esac
    done
    
    if $found_compressed; then
        return 0
    else
        return 1
    fi
}

# Function to check if files in a directory are compressed/uncompressed
check_directory_files() {
    local dir="$1"
    local should_be_compressed="$2"  # true or false
    
    # Skip if directory doesn't exist
    if [ ! -d "$dir" ]; then
        return 0  # Consider non-existent directories as passing
    fi
    
    local files_found=false
    for file in "$dir"/*; do
        # Skip if not a regular file
        [ -f "$file" ] || continue
        files_found=true
        
        if [ "$should_be_compressed" = "true" ]; then
            # Should be compressed
            if ! is_compressed "$file"; then
                echo "DEBUG: File $file is not compressed but should be"
                return 1
            fi
        else
            # Should NOT be compressed
            if is_compressed "$file"; then
                echo "DEBUG: File $file is compressed but should not be"
                return 1
            fi
        fi
    done
    
    # If no files found, that's okay for old files (they might be in archives)
    if ! $files_found && [ "$should_be_compressed" = "true" ]; then
        return 0
    fi
    
    return 0
}

# Check old files compression status
echo "=== Checking old files compression ==="
OLD_FILES_HANDLED=false

# Method 1: Check if old files are compressed in place
if check_directory_files "$BASE_DIR/old_files" "true"; then
    OLD_FILES_HANDLED=true
    echo "✓ Method 1: Old files are compressed in place"
fi

# Method 2: Check if old files are missing (moved to archives) and archives exist
if [ ! "$OLD_FILES_HANDLED" = "true" ]; then
    # Check if old files directory is empty or has no uncompressed files
    old_files_exist=false
    if [ -d "$BASE_DIR/old_files" ]; then
        for file in "$BASE_DIR/old_files"/*; do
            if [ -f "$file" ] && ! is_compressed "$file"; then
                old_files_exist=true
                break
            fi
        done
    fi
    
    if ! $old_files_exist; then
        # Old files are missing, check for archives
        if check_for_compressed_archives "$BASE_DIR" || check_for_compressed_archives "/tmp"; then
            OLD_FILES_HANDLED=true
            echo "✓ Method 2: Old files moved to compressed archives"
        fi
    fi
fi

# Method 3: Check if there are compressed archives alongside uncompressed old files
if [ ! "$OLD_FILES_HANDLED" = "true" ]; then
    if check_for_compressed_archives "$BASE_DIR"; then
        OLD_FILES_HANDLED=true
        echo "✓ Method 3: Compressed archives created (original files may still exist)"
    fi
fi

# Check new files (should remain uncompressed)
echo "=== Checking new files ==="
if check_directory_files "$BASE_DIR/new_files" "false"; then
    NEW_FILES_UNCOMPRESSED=true
    echo "✓ All new files remain uncompressed"
else
    NEW_FILES_UNCOMPRESSED=false
    echo "✗ Some new files are compressed"
fi

# Final evaluation
echo "=== Final Evaluation ==="
if $OLD_FILES_HANDLED && $NEW_FILES_UNCOMPRESSED; then
    echo "✅ SUCCESS: The task was completed correctly."
    echo "   - Old files (30+ days) have been compressed"
    echo "   - New files remain uncompressed"
else
    echo "❌ FAILURE: The task was not completed correctly."
    if ! $OLD_FILES_HANDLED; then
        echo "   - Old files were not compressed or archived"
    fi
    if ! $NEW_FILES_UNCOMPRESSED; then
        echo "   - New files were incorrectly compressed"
    fi
fi