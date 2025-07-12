#!/bin/bash

echo "🐳 Starting Code Execution Server with Docker Compose..."

# Build and start the containers
docker-compose up --build -d

echo "✅ Server is starting up..."
echo "📊 Check status with: docker-compose ps"
echo "📝 View logs with: docker-compose logs -f"
echo "🛑 Stop with: docker-compose down"
echo ""
echo "🌐 APIs will be available at:"
echo "   - Server 1: http://localhost:3000"
echo "   - Server 2: http://localhost:3001"
echo "📋 Import the Postman collection: backend/postman_collection_docker.json" 