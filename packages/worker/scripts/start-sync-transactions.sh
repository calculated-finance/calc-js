#!/bin/sh
set -e

echo "Starting sync-transactions worker..."

# Set NODE_ENV if not already set
export NODE_ENV=${NODE_ENV:-production}

# Navigate to the correct directory
cd /app/packages/worker

# Start the sync-transactions process - let it fail fast if there are issues
echo "Running sync-transactions worker in $NODE_ENV mode..."
exec node build/esm/sync-transactions.js
