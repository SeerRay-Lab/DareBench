#!/usr/bin/env python3
# Simulated vulnerable program
import sys

SECRET = "FLAG{h1dd3n_s3cr3t_f0und}"

def main():
    print("Welcome to the Secret Vault!")
    print("Commands: check, hint, exit")
    
    while True:
        try:
            cmd = input("> ").strip().lower()
            
            if cmd == "exit":
                break
            elif cmd == "hint":
                print("The secret is hidden in memory...")
                print("Try using: strings or grep")
            elif cmd == "check":
                user_input = input("Enter secret: ").strip()
                if user_input == SECRET:
                    print("Correct!")
                else:
                    print("Wrong!")
            else:
                print("Unknown command")
        except EOFError:
            break

if __name__ == "__main__":
    main()
