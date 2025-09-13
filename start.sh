#!/bin/sh

# Start nginx in the background
nginx -g 'daemon off;' &

# Start the Node.js server
NODE_ENV=production node dist/index.js