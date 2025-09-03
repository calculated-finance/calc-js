#!/bin/sh
set -e

echo "Starting producer worker..."

# Set NODE_ENV if not already set
export NODE_ENV=${NODE_ENV:-production}

# Navigate to the correct directory
cd /app/packages/worker

# Start the producer process - let it fail fast if there are issues
echo "Running producer worker in $NODE_ENV mode..."
exec node build/esm/producer.js
