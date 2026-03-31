#!/bin/bash

# Test API Endpoints
# This script tests all available API endpoints

echo "🧪 Testing Nourish API Endpoints"
echo "================================="
echo ""

BACKEND_URL="http://localhost:8001"

# Test root endpoint
echo "1. Testing GET /api/"
curl -s $BACKEND_URL/api/ | jq .
echo ""

# Test status endpoint (GET)
echo "2. Testing GET /api/status"
curl -s $BACKEND_URL/api/status | jq .
echo ""

# Test status endpoint (POST)
echo "3. Testing POST /api/status"
curl -s -X POST $BACKEND_URL/api/status \
  -H "Content-Type: application/json" \
  -d '{"client_name": "test_client"}' | jq .
echo ""

# Test status endpoint (GET) again to see created data
echo "4. Testing GET /api/status (after POST)"
curl -s $BACKEND_URL/api/status | jq .
echo ""

echo "✓ All tests completed!"
