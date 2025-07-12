#!/bin/bash

echo "🐳 Starting Code Execution Server..."

# Check if docker-compose (v1 or v2) is available
if command -v docker-compose &> /dev/null || docker compose version &> /dev/null; then
    echo "✅ docker-compose found. Using docker-compose to start services..."
    docker-compose up --build -d || docker compose up --build -d
else
    echo "⚠️  docker-compose not found. Falling back to raw Docker commands..."

    echo "🔨 Building and running code-exec-server-1..."
    docker build -t code-exec-server-1 -f ./backend/dockerfile ./backend && \
    docker run -d \
      --name code-exec-server-1 \
      -p 3000:3000 \
      -e NODE_ENV=production \
      -e PORT=3000 \
      --privileged \
      --cap-add=SYS_ADMIN \
      --security-opt seccomp=unconfined \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v /tmp:/tmp \
      code-exec-server-1

    echo "🔨 Building and running code-exec-server-2..."
    docker build -t code-exec-server-2 -f ./backend/dockerfile ./backend && \
    docker run -d \
      --name code-exec-server-2 \
      -p 3001:3000 \
      -e NODE_ENV=production \
      -e PORT=3000 \
      --privileged \
      --cap-add=SYS_ADMIN \
      --security-opt seccomp=unconfined \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v /tmp:/tmp \
      code-exec-server-2
fi

echo "✅ Server is starting up..."
echo "📊 Check status with: docker ps"
echo "📝 View logs with: docker logs -f code-exec-server-1"
echo "🛑 Stop with: docker stop code-exec-server-1 code-exec-server-2 && docker rm code-exec-server-1 code-exec-server-2"
echo ""
echo "🌐 APIs will be available at:"
echo "   - Server 1: http://localhost:3000"
echo "   - Server 2: http://localhost:3001"
echo "📋 Import the Postman collection: backend/postman_collection_docker.json"
