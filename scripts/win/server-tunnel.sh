#!/bin/bash

# Take input from the user
read -p "Enter your remote Node starting port number: " destination_port

START=55001
END=60000
chosen_port=""

# Check if the provided port is free
if ! ss -ltn | grep -q ":$destination_port"; then
    echo "Port $destination_port is available."
    chosen_port=$destination_port
else
    # If not free, find a port in the range START-END
    for ((i=START; i<=END; i++)); do
        if ! ss -ltn | grep -q ":$i"; then
            echo "Port $i is available."
            chosen_port=$i
            break
        fi
    done
fi

# If no port is found in the range, exit 1
if [ -z "$chosen_port" ]; then
    echo "No free port found in range $START-$END."
    exit 1
fi

echo "--------------------------------------------------------------------------"
echo "You will be able to access your application at:"
echo "http://localhost:$chosen_port"
echo "after completing the steps below..."
echo "--------------------------------------------------------------------------"

# Build the SSH tunnel using the chosen port
echo "Building SSH tunnel using port $chosen_port..."

# Take input for the CWL name
read -p "Enter your CWL name: " cwl_name

# Try to find ssh in the system's PATH
if command -v ssh &>/dev/null; then
    ssh -L "$chosen_port":localhost:"$destination_port" "$cwl_name"@remote.students.cs.ubc.ca
else
    echo "SSH not found on your system. Please ensure SSH is installed."
    exit 1
fi
