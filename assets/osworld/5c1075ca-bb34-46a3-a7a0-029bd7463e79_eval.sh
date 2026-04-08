#!/bin/bash

# Function to compare the directory structure
compare_structure() {
    # Define prefix to remove
    prefix_src="$1/"
    prefix_dest="$2/"

    # Clean up old temp files
    rm -f /tmp/dir_structure_src /tmp/dir_structure_dest

    # Find all directories in the source, except the 'fails' directory and its subdirectories, sort them, and compare
    (cd "$1" && find . -type d ! -path "./fails/*" ! -name "fails" | sed "s|^./||g" | sort) > /tmp/dir_structure_src
    (cd "$2" && find . -type d | sed "s|^./||g" | sort) > /tmp/dir_structure_dest

    if diff /tmp/dir_structure_src /tmp/dir_structure_dest > /dev/null; then
        echo "Directory structure preserved."
        return 0
    else
        echo "Directory structure not preserved."
        return 1
    fi
}
# Function to check if all matching files were copied
# Function to check if all matching files were copied
check_files_copied() {
    local src="$1"
    local dest="$2"
    local pattern="$3"
    local all_copied=true

    while IFS= read -r file; do
        # Construct the expected destination path
        local dest_file="${dest}${file#$src}"
        if [[ ! -f "$dest_file" ]]; then
            echo "File missing in destination: $dest_file"
            all_copied=false
        fi
    done < <(find "$src" \( -name "fails" -prune \) -o -name "$pattern" -print)

    if $all_copied; then
        echo "All matching files were copied."
        return 0
    else
        echo "Some files were not copied."
        return 1
    fi
}

# Main evaluation logic
main() {
    local src_dir="/home/user/test_environment"
    local dest_dir="/home/user/test_environment/fails"
    local pattern="*failed.ipynb"

    # Check if the fails directory exists
    if [[ ! -d "$dest_dir" ]]; then
        echo "Destination directory $dest_dir does not exist."
        exit 1
    fi

    # Compare the directory structure
    compare_structure "$src_dir" "$dest_dir" || exit 1

    # Check if all matching files were copied
    check_files_copied "$src_dir" "$dest_dir" "$pattern" || exit 1

    echo "Evaluation successful."
}

main