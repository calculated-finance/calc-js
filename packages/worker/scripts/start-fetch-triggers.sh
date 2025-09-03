#!/bin/sh
set -e

echo "Starting fetch-triggers worker..."

# Set NODE_ENV if not already set
export NODE_ENV=${NODE_ENV:-production}

# Navigate to the correct directory
cd /app/packages/worker

# Start the fetch-triggers process - let it fail fast if there are issues
echo "Running fetch-triggers worker in $NODE_ENV mode..."
exec node build/esm/fetch-triggers.js
