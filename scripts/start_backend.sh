#!/bin/bash

# Configuration
APP_DIR=$(pwd)
PORT=8080
LOG_FILE="$APP_DIR/api.log"
PID_FILE="$APP_DIR/backend.pid"

echo "Starting Backend API at $APP_DIR on port $PORT"

# 1. Stop Existing Process
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if ps -p $OLD_PID > /dev/null; then
        echo "Stopping existing backend process (PID: $OLD_PID)..."
        kill $OLD_PID
        sleep 2
    fi
    rm "$PID_FILE"
fi

# Ensure port is free
PID_ON_PORT=$(lsof -t -i:$PORT)
if [ ! -z "$PID_ON_PORT" ]; then
    echo "Killing process on port $PORT (PID: $PID_ON_PORT)..."
    kill -9 $PID_ON_PORT 2>/dev/null || true
fi

# 2. Start Backend Server
# Using FLASK_APP and flask run to control port/host easily or running python file directly if it has app.run
# Since api/index.py has if __name__ == '__main__': app.run(debug=True), we can run it correctly.
# However, app.run(debug=True) usually defaults to 5000. 
# Let's force it via environment variables or arguments if possible, but simplest is to use flask run command if flask is installed.
# Given api/index.py structure, running it directly might use port 5000. 
# Let's try running with python3 and see. If we need to specify port, we might need to modify python file or use flask CLI.
# Better approach for reliability: Use flask CLI.

export FLASK_APP=api/index.py
export FLASK_ENV=development

echo "Starting flask server on port $PORT..."
nohup python3 -m flask run --port=$PORT --host=0.0.0.0 > "$LOG_FILE" 2>&1 &

NEW_PID=$!
echo $NEW_PID > "$PID_FILE"

echo "Backend started with PID: $NEW_PID"
echo "Logs are being written to $LOG_FILE"
