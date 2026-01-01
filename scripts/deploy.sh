#!/bin/bash

# Configuration
APP_DIR=$(pwd)
PORT=8000
LOG_FILE="$APP_DIR/app.log"
PID_FILE="$APP_DIR/app.pid"

echo "Deploying Static Frontend to $APP_DIR"

# 1. Stop Existing Process
if [ -f "$PID_FILE" ]; then
    OLD_PID=$(cat "$PID_FILE")
    if ps -p $OLD_PID > /dev/null; then
        echo "Stopping existing process (PID: $OLD_PID)..."
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

# 2. Start Static Server
echo "Starting static server on port $PORT..."
# Using python3 http.server as it is available on macOS
nohup python3 -m http.server $PORT > "$LOG_FILE" 2>&1 &

NEW_PID=$!
echo $NEW_PID > "$PID_FILE"

echo "Frontend started with PID: $NEW_PID"
echo "Logs are being written to $LOG_FILE"
