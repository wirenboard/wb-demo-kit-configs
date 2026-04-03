#!/bin/bash
set -e

if dpkg -l wb-demo-kit-configs 2>/dev/null | grep -q '^ii'; then
    echo "wb-demo-kit-configs is already installed"
    exit 0
fi

echo "Installing wb-demo-kit-configs..."
apt-get update
apt-get install -y wb-demo-kit-configs
reboot