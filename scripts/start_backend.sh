#!/bin/bash

# Start Backend Server
# This script starts the FastAPI backend server

echo "🚀 Starting Nourish Backend Server..."
cd backend
uvicorn server:app --reload --host 0.0.0.0 --port 8001
