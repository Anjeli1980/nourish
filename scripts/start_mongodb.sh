#!/bin/bash

# Start MongoDB using Docker
# This script starts MongoDB in a Docker container

echo "🚀 Starting MongoDB in Docker..."

# Check if container already exists
if docker ps -a | grep -q mongodb; then
    echo "MongoDB container exists. Starting..."
    docker start mongodb
else
    echo "Creating new MongoDB container..."
    docker run -d -p 27017:27017 --name mongodb mongo:latest
fi

echo "✓ MongoDB is running on mongodb://localhost:27017"
