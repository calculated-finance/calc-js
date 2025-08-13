#!/bin/sh
set -e

echo "Starting execute-triggers worker..."

# Set NODE_ENV if not already set
export NODE_ENV=${NODE_ENV:-production}

# Navigate to the correct directory
cd /app/packages/worker

# Start the execute-triggers process - let it fail fast if there are issues
echo "Running execute-triggers worker in $NODE_ENV mode..."
exec node build/esm/execute-triggers.js
