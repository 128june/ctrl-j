#!/bin/bash

# Hardcode project path for reliability in launchd environment
PROJECT_DIR="/Users/june/Project/ctrl-j"

# Ensure log directory exists (implied by project dir)
cd "$PROJECT_DIR" || exit 1

# EXPORT PATH
# Include standard paths and user python bin path (where flask/pip installs go)
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:/Users/june/Library/Python/3.9/bin:$PATH"

echo "Starting services from $PROJECT_DIR"
echo "Date: $(date)"
echo "PATH: $PATH"
echo "Python: $(which python3)"

# Run scripts using bash
# We use bash explicitly to ensure execution
/bin/bash scripts/deploy.sh
/bin/bash scripts/start_backend.sh

echo "Services started"
