#!/bin/bash
# check_password.sh
# Usage: ./check_password.sh username password
USERNAME=$1
PASSWORD=$2
# Create an expect script on the fly and execute it
expect <<EOF
set timeout 10
spawn su - $USERNAME -c "echo login_success"
expect "Password:"
send "$PASSWORD\r"
expect {
    "login_success" {
        send_user "Password is correct\n"
        exit 0
    }
    "su: Authentication failure" {
        send_user "Password is incorrect\n"
        exit 1
    }
    default {
        send_user "An unexpected error occurred\n"
        exit 2
    }
}
EOF