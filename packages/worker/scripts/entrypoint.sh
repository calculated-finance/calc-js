#!/usr/bin/env sh
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: entrypoint.sh <path/to/app.js> [args...]"
  exit 64
fi

FILE="$1"; shift

if [ ! -f "$FILE" ]; then
  echo "File not found: $FILE" >&2
  exit 66
fi

echo "Running $FILE in $NODE_ENV mode..."

exec node "$FILE" "$@"