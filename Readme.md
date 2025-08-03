# Code Execution Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-24.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Supported-blue.svg)](https://www.docker.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg)](https://code-execution.bhaveshsinghal.xyz)

A secure, scalable code execution platform that allows users to run code in multiple programming languages with proper isolation and resource management. This platform provides a web-based code editor with real-time execution capabilities for JavaScript, Python, C++, and Java.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🚀 Quick Start](#-quick-start)
- [📋 Prerequisites](#-prerequisites)
- [⚙️ Installation](#️-installation)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🔒 Security Features](#-security-features)
- [📚 API Documentation](#-api-documentation)
- [🐳 Docker Setup](#-docker-setup)
- [🛠️ Development](#️-development)
- [🌐 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## ✨ Features

- **Multi-Language Support**: Execute code in JavaScript, Python, C++, and Java
- **Secure Isolation**: User-based isolation with resource limits
- **Real-time Execution**: Monaco Editor with live code execution
- **Docker Support**: Containerized deployment with security constraints
- **Resource Management**: CPU time and process limits
- **Professional UI**: Modern web interface built with Next.js
- **RESTful API**: Simple API for code execution integration

## 🚀 Quick Start

### Using the Live Demo
Visit [code-execution.bhaveshsinghal.xyz](https://code-execution.bhaveshsinghal.xyz) to try the platform immediately.

### Local Development
```bash
# Clone the repository
git clone https://github.com/bhaveshsinghal95182/code-execution-backend.git
cd code-execution-backend

# Start with Docker (recommended)
./start-docker.sh

# Or start manually
cd backend && npm install && npm run dev
cd frontend && npm install && npm run dev
```

### API Usage
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"Hello World\")", "language": "javascript"}'
```

## 📋 Prerequisites

- **Node.js**: Version 24.x or higher
- **Docker**: For containerized deployment
- **Docker Compose**: For orchestration
- **Linux/Unix**: Required for user isolation features
- **Sudo privileges**: For user creation and management

## ⚙️ Installation

### Option 1: Docker (Recommended)
```bash
# Using Docker Compose
docker-compose up --build

# Using the provided script
chmod +x start-docker.sh
./start-docker.sh
```

### Option 2: Manual Installation
```bash
# Backend setup
cd backend
npm install
npm run build
npm start

# Frontend setup (separate terminal)
cd frontend
npm install
npm run build
npm start
```

## 🏗️ Architecture Overview

The platform follows a microservices architecture with the following components:

### Frontend (Next.js)
- **Technology**: Next.js with TypeScript
- **UI Components**: Monaco Editor for code editing
- **Deployment**: Vercel
- **Features**: Multi-language code editor with real-time execution

### Backend (Express.js)
- **Technology**: Express.js with TypeScript
- **Containerization**: Docker with Node 24 Alpine
- **Security**: User isolation and resource limits
- **Deployment**: VPS with Nginx and SSL

---

## 📚 Technical Documentation

<details>
<summary><strong>🏗️ Detailed Architecture & Implementation</strong></summary>

### 🎯 Backend Architecture & Functionality

#### Core Components

##### 1. **Main Server (`index.ts`)**
The backend is built with Express.js and provides a single API endpoint for code execution:

```typescript
POST /api/execute
```

**Request Body:**
```json
{
  "code": "console.log('Hello World')",
  "language": "javascript"
}
```

**Response:**
```json
{
  "output": "Hello World"
}
```

##### 2. **Supported Languages**
The backend supports four programming languages:
- **JavaScript** (Node.js)
- **Python** (Python 3)
- **C++** (GCC compiler)
- **Java** (OpenJDK 17)

##### 3. **Security & Isolation System**

###### User Isolation
- Each code execution creates a unique user with UUID: `exec_${uuidv4()}`
- Users are created with limited permissions and resources
- Automatic cleanup after execution

###### Resource Limits
```bash
ulimit -t 10    # CPU time limit: 10 seconds
ulimit -u 40    # Process limit: 40 processes
```

###### Process Management
- Uses process groups (PGID) for proper cleanup
- SIGTERM signals for graceful termination
- Automatic cleanup of orphaned processes

##### 4. **Execution Flow**

1. **Request Processing**
   - Validates language support
   - Generates unique execution ID
   - Creates isolated user environment

2. **Code Preparation**
   - Creates temporary directory: `/home/${execId}/temp/${execId}`
   - Writes code to appropriate file extension
   - Generates execution script with resource limits

3. **Code Execution**
   - Compiles code (for C++, Java)
   - Runs code with resource constraints
   - Captures stdout/stderr output

4. **Cleanup**
   - Kills process group if execution fails
   - Deletes user and all associated files
   - Releases system resources

#### Utility Functions (`utils.ts`)

##### 1. **Semaphore Class**
```typescript
class Semaphore {
  private max: number;
  private count: number;
  private queue: Array<() => void>;
}
```
- Prevents race conditions during user creation/deletion
- Ensures thread-safe operations
- Maximum concurrency: 1 operation at a time

##### 2. **Core Functions**

**`execShellCommand(cmd: string)`**
- Executes shell commands with 10-second timeout
- Handles error logging and output capture
- Returns Promise<string> with command output

**`createUser(username: string)`**
- Creates system user with sudo privileges
- Sets password for user authentication
- Uses semaphore for thread safety

**`deleteUser(username: string)`**
- Removes user and home directory
- Cleans up all associated files
- Handles cleanup errors gracefully

**`killProcessGroup(pgid: number)`**
- Sends SIGTERM to entire process group
- Ensures complete process termination
- Prevents zombie processes

#### Language-Specific Execution

##### JavaScript
```bash
# File: script.js
node script.js
```

##### Python
```bash
# File: script.py
python3 script.py
```

##### C++
```bash
# File: program.cpp
g++ -o program program.cpp
./program
```

##### Java
```bash
# File: Main.java
javac Main.java
java -cp /temp Main
```

### 🐳 Advanced Docker Configuration

#### Container Setup
```dockerfile
FROM node:24-alpine
RUN apk add --no-cache sudo shadow python3 openjdk17 gcc g++ musl-dev
```

#### Docker Compose Configuration
```yaml
services:
  code-execution-server:
    build: ./backend
    ports: ["3000:3000"]
    privileged: true
    cap_add: [SYS_ADMIN]
    security_opt: [seccomp:unconfined]
```

#### Security Features
- **Privileged Mode**: Required for user creation
- **SYS_ADMIN Capability**: Process management
- **Unconfined Seccomp**: Allows system calls
- **Volume Mounts**: Docker socket and temp directory

### 📊 System Architecture Diagrams

#### Original Scalable Architecture
![Scalable Architecture](/frontend/public/scalable.png)

*The original architecture was designed for high scalability with multiple containers and load balancing.*

#### Current Implementation
![Current Implementation](/frontend/public/small.png)

*The current implementation focuses on simplicity and security with a single container approach.*

### 📝 Implementation Notes

The backend implementation prioritizes:

1. **Security**: User isolation and resource limits
2. **Reliability**: Comprehensive error handling
3. **Scalability**: Thread-safe operations with semaphores
4. **Maintainability**: Clean code structure and documentation

#### Key Design Decisions

1. **Single Container Approach**: Simplified deployment and maintenance
2. **User-based Isolation**: Better security than container-per-execution
3. **Resource Limits**: Prevents abuse and ensures fair usage
4. **Automatic Cleanup**: Prevents resource leaks

### 🎯 Technology Stack

- **Backend**: Express.js, TypeScript, Node.js 24
- **Frontend**: Next.js, TypeScript, Monaco Editor
- **Containerization**: Docker, Docker Compose
- **Deployment**: Vercel (Frontend), VPS (Backend)
- **Infrastructure**: Nginx, SSL certificates
- **Languages**: JavaScript, Python, C++, Java

</details>

## 🔗 Important Links

- **🌐 Live Demo**: [Code Execution Platform](https://code-execution.bhaveshsinghal.xyz)
- **📂 GitHub Repository**: [Backend Code](https://github.com/bhaveshsinghal95182/code-execution-backend)
- **🔌 API Endpoint**: `https://server.bhaveshsinghal.xyz/api/execute`
- **📮 Postman Collections**: Available in `/backend` directory

---

<div align="center">

**⭐ If you found this project helpful, please give it a star! ⭐**

*This project demonstrates a secure, scalable approach to code execution with proper isolation, resource management, and error handling.*

</div>
