#!/bin/bash

SSH_DIR="/root/.ssh"

set -euo pipefail

echo "[INFO] Setting up SSH for Git access..."

if [[ -z "${SSH_KEY:-}" ]]; then
    echo "[ERROR] SSH_KEY environment variable is not set."
    exit 1
fi

mkdir -p "$SSH_DIR"
echo "$SSH_KEY" > "$SSH_DIR/id_ed25519"
chmod 600 "$SSH_DIR/id_ed25519"
echo "[INFO] SSH private key written."

echo "[INFO] Adding github.com to known_hosts..."


cat <<EOF > "$SSH_DIR/config"
Host github.com
  StrictHostKeyChecking accept-new
  IdentityFile ~/.ssh/id_ed25519
EOF

git config --global core.sshCommand "ssh -F $SSH_DIR/config"

echo "[INFO] SSH setup complete."
