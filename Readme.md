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

## 🔒 Security Features

### 1. **User Isolation**
- Each execution runs under a unique user (`exec_${uuid}`)
- No shared resources between executions
- Automatic user cleanup after execution

### 2. **Resource Limits**
- **CPU Time**: 10 seconds maximum per execution
- **Process Count**: Maximum 40 processes per user
- **Memory**: Controlled via ulimit constraints

### 3. **Process Management**
- Process group isolation (PGID)
- Graceful termination with SIGTERM
- Automatic cleanup of orphaned processes

### 4. **Container Security**
- Privileged mode for controlled user creation
- SYS_ADMIN capability for process management
- Unconfined seccomp for required system calls

## 📚 API Documentation

### Execute Code Endpoint

**POST** `/api/execute`

Execute code in supported programming languages with automatic isolation and cleanup.

#### Request
```http
POST /api/execute
Content-Type: application/json

{
  "code": "console.log('Hello World')",
  "language": "javascript"
}
```

#### Supported Languages
- `javascript` - Node.js execution
- `python` - Python 3 execution  
- `cpp` - GCC compilation and execution
- `java` - OpenJDK 17 compilation and execution

#### Success Response
```json
{
  "output": "Hello World"
}
```

#### Error Response
```json
{
  "error": "Unsupported language"
}
```

#### Example Usage

**JavaScript**
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "console.log(\"Hello from Node.js\")", "language": "javascript"}'
```

**Python**
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "print(\"Hello from Python\")", "language": "python"}'
```

**C++**
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "#include<iostream>\nint main(){std::cout<<\"Hello from C++\";return 0;}", "language": "cpp"}'
```

**Java**
```bash
curl -X POST http://localhost:3000/api/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "public class Main{public static void main(String[] args){System.out.println(\"Hello from Java\");}}", "language": "java"}'
```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)
```bash
# Start all services
docker-compose up --build

# Run in background
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Docker Build
```bash
# Build backend image
docker build -t code-execution-backend ./backend

# Run container
docker run -d \
  --name code-exec-server \
  -p 3000:3000 \
  --privileged \
  --cap-add=SYS_ADMIN \
  --security-opt seccomp=unconfined \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /tmp:/tmp \
  code-execution-backend
```

### Docker Configuration
```yaml
services:
  code-execution-server:
    build: ./backend
    ports: ["3000:3000"]
    privileged: true           # Required for user creation
    cap_add: [SYS_ADMIN]      # Process management
    security_opt: [seccomp:unconfined]  # System calls
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /tmp:/tmp
```

## 🛠️ Development

### Backend Development
```bash
cd backend
npm install           # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
```

### Frontend Development
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm start           # Start production server
```

### Available Scripts

#### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

#### Frontend  
- `npm run dev` - Start Next.js development server
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Development Tools
- **TypeScript**: Type safety and better development experience
- **TSX**: Fast TypeScript execution for development
- **Monaco Editor**: VS Code-like code editor in the browser
- **Tailwind CSS**: Utility-first CSS framework

## 🌐 Deployment

### Frontend Deployment (Vercel)
The frontend is deployed on Vercel with automatic deployments from the main branch.

**Live URL**: [code-execution.bhaveshsinghal.xyz](https://code-execution.bhaveshsinghal.xyz)

### Backend Deployment (VPS)
The backend is deployed on a Virtual Private Server with the following setup:

**Server**: `https://server.bhaveshsinghal.xyz/api/execute`

#### Production Setup
1. **Web Server**: Nginx with SSL certificates
2. **Container**: Docker with security constraints
3. **Process Management**: Systemd service
4. **Monitoring**: Docker logs and system monitoring

#### Deployment Steps
```bash
# Clone repository on server
git clone https://github.com/bhaveshsinghal95182/code-execution-backend.git
cd code-execution-backend

# Start production services
./start-docker.sh

# Monitor logs
docker logs -f code-exec-server
```

## 🤝 Contributing

We welcome contributions to the Code Execution Platform! Here's how you can help:

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Development Guidelines
- Follow the existing code style and conventions
- Write clear commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation if needed

### Reporting Issues
If you find a bug or have a feature request:
1. Check existing issues first
2. Create a detailed issue with steps to reproduce
3. Include system information and error messages
4. Add labels to help categorize the issue

### Security Considerations
When contributing to security-related features:
- Follow the principle of least privilege
- Test isolation and resource limits thoroughly
- Document security implications of changes
- Consider attack vectors and edge cases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 Bhavesh Singhal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

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
