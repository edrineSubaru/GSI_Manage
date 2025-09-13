#!/bin/sh

echo "Starting GSI application..."

# Start nginx in the background
echo "Starting nginx..."
nginx -g 'daemon off;' &
NGINX_PID=$!

# Wait a moment for nginx to start
sleep 2

# Check if nginx is running
if kill -0 $NGINX_PID 2>/dev/null; then
    echo "Nginx started successfully (PID: $NGINX_PID)"
else
    echo "Nginx failed to start"
    exit 1
fi

# Start the Node.js server
echo "Starting Node.js server..."
NODE_ENV=production node dist/index.js &
SERVER_PID=$!

# Wait a moment for server to start
sleep 2

# Check if server is running
if kill -0 $SERVER_PID 2>/dev/null; then
    echo "Server started successfully (PID: $SERVER_PID)"
else
    echo "Server failed to start"
    exit 1
fi

echo "Both services started. Application is ready."

# Wait for any process to exit
wait