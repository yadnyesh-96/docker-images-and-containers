# Docker Fundamentals with a React Demo

A beginner-friendly, hands-on guide to Docker concepts, images, containers, Dockerfiles, ports, and multi-stage builds — demonstrated with a simple React application built using Vite and served by NGINX.

> **Learning goal:** Understand what Docker does, how an image differs from a container, how they work together, and how to containerize and run a React app.

---

## Table of Contents

- [1. What Is Docker?](#1-what-is-docker)
- [2. Why Do We Need Docker?](#2-why-do-we-need-docker)
- [3. Important Docker Terms](#3-important-docker-terms)
- [4. Image vs. Container](#4-image-vs-container)
- [5. How Docker Works](#5-how-docker-works)
- [6. Demo Project: React Hello Docker](#6-demo-project-react-hello-docker)
- [7. Run the Project Locally](#7-run-the-project-locally)
- [8. Dockerize the React App](#8-dockerize-the-react-app)
- [9. Build and Run the Docker Image](#9-build-and-run-the-docker-image)
- [10. Run Two Containers from One Image](#10-run-two-containers-from-one-image)
- [11. Docker Ports Explained](#11-docker-ports-explained)
- [12. Container Lifecycle and Cleanup](#12-container-lifecycle-and-cleanup)
- [13. Useful Docker Commands](#13-useful-docker-commands)
- [14. Common Mistakes](#14-common-mistakes)
- [15. Docker Interview Questions and Answers](#15-docker-interview-questions-and-answers)
- [16. What I Learned](#16-what-i-learned)
- [17. Official Documentation](#17-official-documentation)

---

## 1. What Is Docker?

**Docker is a platform for building, packaging, distributing, and running applications in containers.**

It helps developers run applications in a consistent environment across development machines, test environments, and servers.

For example, a React application may need Node.js and npm to build. Rather than requiring every environment to be configured manually, Docker can build the application in a Node.js environment and package the production files into an image that runs with NGINX.

Docker containers share the host operating-system kernel, unlike traditional virtual machines that generally run a separate guest operating system.

### Simple analogy

- **Dockerfile:** A recipe with instructions.
- **Image:** The packaged template produced from the recipe.
- **Container:** An instance created from the image and started as an isolated process environment.

An image can be used to create multiple containers.

## 2. Why Do We Need Docker?

Docker helps reduce environment-related problems.

| Problem | How Docker helps |
|---|---|
| Different environments | Package the application and required runtime components consistently. |
| Manual setup | Define repeatable build and startup steps. |
| Deployment | Distribute versioned images to compatible Docker environments. |
| Microservices | Run services as separate containers. |
| Multiple instances | Create multiple containers from the same image. |
| Development consistency | Use the same container image in multiple stages of the workflow. |

Docker does not automatically fix application bugs or guarantee that every environment behaves identically. Configuration, networking, secrets, and persistent data still need to be managed correctly.

## 3. Important Docker Terms

| Term | Meaning |
|---|---|
| **Dockerfile** | Text file containing instructions to build an image. |
| **Image** | Packaged, read-only template containing filesystem layers and configuration metadata. |
| **Container** | A created instance of an image with its own runtime state and writable layer. |
| **Docker Engine** | The software responsible for building and managing images, containers, networks, and volumes. |
| **Docker CLI** | Command-line tool used to send commands to Docker Engine. |
| **Registry** | A service for storing and distributing images. Docker Hub is a popular example. |
| **Tag** | A human-readable label for an image version, such as `react-docker-demo:1.0`. |
| **Layer** | A filesystem change stored as part of an image. Images can reuse layers. |
| **Port mapping** | Connects a host port to a container port, for example `8080:80`. |
| **Volume** | Persistent storage managed by Docker, often used for database data. |
| **Bind mount** | Makes a specified host file or directory available inside a container. |
| **Docker network** | Allows containers to communicate according to the network configuration. |
| **Docker Compose** | Tool for defining and running multi-container applications using a YAML file. |
| **Multi-stage build** | Uses multiple build stages so the final image can contain only the files needed at runtime. |

## 4. Image vs. Container

This is one of the most important Docker concepts.

| Docker Image | Docker Container |
|---|---|
| A template used to create containers. | An instance created from an image. |
| Contains filesystem layers and image configuration. | Uses the image's filesystem and configuration. |
| Does not have a running application process by itself. | Can run the application process. |
| Can be used to create multiple containers. | Has its own lifecycle and runtime state. |
| Built using `docker build`. | Created and started using `docker run`, or separately using `docker create` and `docker start`. |
| Remains available when a container is stopped or removed, unless the image is separately removed. | Can be stopped, started, and removed. |

### Example

Build one image:

```bash
docker build -t react-docker-demo:1.0 .
```

Create and start a container:

```bash
docker run -d --name react-demo-1 -p 8080:80 react-docker-demo:1.0
```

Create another container from the same image:

```bash
docker run -d --name react-demo-2 -p 8081:80 react-docker-demo:1.0
```

Both containers use the same image, but each has its own process, runtime state, and writable container layer.

**Important:** Changes made only in a container's writable layer do not automatically modify the image. If the container is removed, those changes are lost unless they were stored in a volume or elsewhere. A container's lifecycle is separate from the image's lifecycle.

## 5. How Docker Works

### Image creation and container startup flow

```text
React source code + package.json
              |
              v
         Dockerfile
     (build instructions)
              |
              v
       docker build
              |
              v
     Docker Image
  react-docker-demo:1.0
              |
              | docker run
              v
       Docker Container
       (NGINX process)
              |
              v
     Host port 8080
              |
              v
          Browser
```

### What happens during `docker build`?

1. Docker reads the Dockerfile.
2. It obtains the required base images if they are not available locally.
3. It executes build instructions, reusing cached layers when possible.
4. In this project, Node.js installs dependencies and builds the React application.
5. The final image contains NGINX and the generated static files.
6. Docker stores the resulting image locally.

The build command prepares an image; it does not start the website container.

### What happens during `docker run`?

1. Docker finds the requested image locally or pulls it from a configured registry if needed.
2. Docker creates a container from the image.
3. It configures the container's filesystem, networking, and requested port mapping.
4. It starts the process configured by the image.
5. NGINX serves the React production files.
6. The browser accesses the website through the published host port.

---

## 6. Demo Project: React Hello Docker

### What we built

A small React application with:
- A heading: **Hello, Docker!**
- A counter button to verify JavaScript interactivity.
- A production build created by Vite.
- NGINX serving the built static files from a Docker container.

### Architecture

```text
Browser
  |
  | http://localhost:8080
  v
Host port 8080
  |
  | Docker port mapping: 8080:80
  v
NGINX inside container (port 80)
  |
  v
React production files (HTML, CSS, JavaScript)
```

React is built into static files. The browser runs the React JavaScript; NGINX serves those files. The NGINX container is not running a Node.js development server.

### Prerequisites

- Docker Desktop (Windows/macOS) or Docker Engine (Linux)
- Node.js and npm for creating and testing the project locally
- A terminal such as PowerShell, Command Prompt, or Bash

Confirm the tools are available:

```bash
docker --version
docker info
node --version
npm --version
```

`docker info` should work when the Docker Engine is running.

## 7. Run the Project Locally

Create the React app with Vite:

```bash
npm create vite@latest react-docker-demo -- --template react
cd react-docker-demo
npm install
npm run dev
```

Open the local URL shown in the terminal, usually:

```text
http://localhost:5173
```

After confirming it works, stop the development server with `Ctrl+C`.

### `src/App.jsx`

Replace the file contents with:

```jsx
import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="container">
      <h1>Hello, Docker! 🐳</h1>
      <p>My first React application running inside a Docker container.</p>

      <div className="card">
        <h2>Counter: {count}</h2>
        <button onClick={() => setCount(count + 1)}>
          Click Me
        </button>
      </div>

      <p className="status">React + Docker + NGINX</p>
    </main>
  );
}

export default App;
```

### `src/App.css`

```css
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background: #f1f5f9;
}

.container {
  max-width: 650px;
  margin: 100px auto;
  padding: 30px;
  text-align: center;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 25px #00000012;
}

h1 {
  color: #2563eb;
}

.card {
  margin: 30px 0;
  padding: 20px;
  background: #eff6ff;
  border-radius: 12px;
}

button {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: white;
  cursor: pointer;
}

button:hover {
  background: #1d4ed8;
}

.status {
  color: #475569;
}
```

## 8. Dockerize the React App

Create a file named `Dockerfile` in the project root, alongside `package.json`.

### `Dockerfile`

```dockerfile
# Stage 1: Build the React application
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the production files
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Understand the Dockerfile

| Instruction | Purpose |
|---|---|
| `FROM node:22-alpine AS build` | Uses a Node.js image for the build stage. |
| `WORKDIR /app` | Sets the working directory inside the stage. |
| `COPY package*.json ./` | Copies the package manifest and lockfile if present. |
| `RUN npm install` | Installs the npm dependencies. |
| `COPY . .` | Copies the project source into the build stage. |
| `RUN npm run build` | Generates the production files, normally in `dist/` for Vite. |
| `FROM nginx:alpine` | Starts a separate final stage using NGINX. |
| `COPY --from=build ...` | Copies the generated files from the build stage into the NGINX web root. |
| `EXPOSE 80` | Documents the container port used by NGINX. It does not publish the port. |
| `CMD [...]` | Starts NGINX in the foreground so the container remains running. |

### Why use a multi-stage build?

The Node.js stage is used to build React. The final stage only needs NGINX and the production files.

This keeps the final image smaller than an image that includes the entire Node.js build environment and source tree. The exact image size depends on the base images and application.

### `.dockerignore`

Create a `.dockerignore` file in the project root:

```text
node_modules
dist
.git
.vscode
```

This excludes local dependencies, previous build output, Git history, and editor configuration from the Docker build context. Docker installs dependencies and creates the production build inside the build stage.

## 9. Build and Run the Docker Image

Run all Docker commands from the project root.

### Step 1: Build the image

```bash
docker build -t react-docker-demo:1.0 .
```

Meaning:
- `docker build`: Build an image.
- `-t react-docker-demo:1.0`: Assign the image name and tag.
- `.`: Use the current directory as the build context.

List images:

```bash
docker images
```

Expected repository and tag:

```text
REPOSITORY          TAG
react-docker-demo   1.0
```

Image IDs and sizes will differ.

### Step 2: Run a container

```bash
docker run -d --name react-demo-container -p 8080:80 react-docker-demo:1.0
```

Meaning:
- `docker run`: Create and start a container.
- `-d`: Run in detached mode.
- `--name react-demo-container`: Assign a container name.
- `-p 8080:80`: Map host port `8080` to container port `80`.
- `react-docker-demo:1.0`: Use the built image.

### Step 3: Open the website

Visit:

```text
http://localhost:8080
```

The React page should appear. Click the counter button to test its interactivity.

### Step 4: Verify the container

```bash
docker ps
docker logs react-demo-container
```

If the container is not running:

```bash
docker ps -a
docker logs react-demo-container
```

Check the logs for startup errors and confirm that host port 8080 is not already in use.

## 10. Run Two Containers from One Image

Stop and remove the original container:

```bash
docker stop react-demo-container
docker rm react-demo-container
```

Run two containers from the same image:

```bash
docker run -d --name react-demo-1 -p 8080:80 react-docker-demo:1.0
docker run -d --name react-demo-2 -p 8081:80 react-docker-demo:1.0
```

Open both URLs:

- http://localhost:8080
- http://localhost:8081

Both containers serve the same application image, but use different host ports.

Check them:

```bash
docker ps
```

This illustrates the core relationship: **one image can create multiple containers**.

## 11. Docker Ports Explained

The `-p` flag uses this format:

```text
HOST_PORT:CONTAINER_PORT
```

Example:

```bash
docker run -d --name react-demo -p 8080:80 react-docker-demo:1.0
```

- Host port: `8080` — the port used on your computer.
- Container port: `80` — the port NGINX listens on inside the container.

`EXPOSE 80` in the Dockerfile is documentation for the image. It does not publish port 80 to your computer; the `-p` option publishes the port.

## 12. Container Lifecycle and Cleanup

### Create a container without starting it

```bash
docker create --name react-demo react-docker-demo:1.0
```

### Start the existing container

```bash
docker start react-demo
```

### Stop it

```bash
docker stop react-demo
```

### Remove it

```bash
docker rm react-demo
```

### Remove the image

```bash
docker rmi react-docker-demo:1.0
```

Docker may refuse to remove an image while a container references it. Remove the relevant containers first if you intend to remove the image.

**Remember:** Stopping a container does not remove it. Removing a container does not automatically remove its image. Removing a container also discards changes held only in its writable layer.

## 13. Useful Docker Commands

| Command | Purpose |
|---|---|
| `docker --version` | Display the Docker CLI version. |
| `docker info` | Display Docker Engine information. |
| `docker pull nginx:alpine` | Pull an image from a registry. |
| `docker images` | List local images. |
| `docker build -t app:1.0 .` | Build an image. |
| `docker run -d -p 8080:80 app:1.0` | Create and start a container in detached mode. |
| `docker create --name demo app:1.0` | Create a container without starting it. |
| `docker ps` | List running containers. |
| `docker ps -a` | List all containers, including stopped containers. |
| `docker logs demo` | Display container logs. |
| `docker logs -f demo` | Follow container logs. |
| `docker exec -it demo sh` | Open a shell if the image provides one. |
| `docker stop demo` | Stop a running container. |
| `docker start demo` | Start an existing stopped container. |
| `docker rm demo` | Remove a stopped container. |
| `docker rmi app:1.0` | Remove an image if it is not in use. |
| `docker volume ls` | List Docker volumes. |
| `docker network ls` | List Docker networks. |
| `docker system df` | Show Docker disk usage. |

## 14. Common Mistakes

1. **Thinking an image is running:** Building an image does not start a container.
2. **Confusing `EXPOSE` with port publishing:** Use `-p HOST_PORT:CONTAINER_PORT` to publish a port.
3. **Assuming container changes update the image:** They do not update the original image automatically.
4. **Assuming stopped means deleted:** A stopped container still exists until removed.
5. **Using a host port that is already occupied:** Choose a different host port if necessary.
6. **Forgetting the Docker Engine must be running:** `docker info` can help confirm Docker is available.
7. **Sending unnecessary files in the build context:** Use `.dockerignore`.
8. **Storing important data only in the container layer:** Use volumes or an appropriate external storage service for persistent data.
9. **Putting secrets into a Dockerfile:** Use suitable runtime configuration and secret-management mechanisms.
10. **Using development-server assumptions in production:** This demo serves Vite's built static files with NGINX.

## 15. Docker Interview Questions and Answers

### Q1. What is Docker?

Docker is a platform for building, distributing, and running applications in containers. It helps provide consistent application environments across compatible systems.

### Q2. What is a Docker image?

A Docker image is a packaged template containing filesystem layers and configuration metadata used to create containers.

### Q3. What is a Docker container?

A container is an instance created from an image. It has its own runtime state, isolated process environment, and writable container layer.

### Q4. What is the difference between an image and a container?

An image is the template; a container is an instance created from it. One image can be used to create multiple containers. The image and container have separate lifecycles.

### Q5. What is a Dockerfile?

A Dockerfile is a text file containing instructions that Docker uses to build an image.

### Q6. What is the difference between `docker build` and `docker run`?

- `docker build` creates an image from a build context and Dockerfile.
- `docker run` creates a container from an image and starts it.

### Q7. Can multiple containers use the same image?

Yes. Multiple containers can use the same image while maintaining separate runtime state, processes, and writable layers.

### Q8. What happens when a container is stopped?

The container's main process stops. The container remains available and can normally be started again with `docker start`.

### Q9. What happens when a container is removed?

The container is deleted. Changes held only in its writable layer are lost. Its image and separately managed volumes are not automatically removed.

### Q10. What is a Docker registry?

A registry stores and distributes container images. Docker Hub and Amazon Elastic Container Registry (ECR) are examples.

### Q11. What is a Docker tag?

A tag is a label associated with an image reference, such as `react-docker-demo:1.0`. Tags help identify versions, but tags can be moved to point to different image content; image digests identify content more precisely.

### Q12. What is a Docker layer?

A layer is a filesystem change that forms part of an image. Layer reuse and caching can make builds more efficient.

### Q13. What is a multi-stage build?

A multi-stage build uses multiple `FROM` stages in a Dockerfile. Files needed from one stage can be copied into a later stage, allowing the final image to exclude build tools that are not needed at runtime.

**In this project:** Node.js builds the React app, then NGINX serves the output in the final image.

### Q14. What is the difference between `CMD` and `ENTRYPOINT`?

Both define how a container's main process is started. `ENTRYPOINT` specifies the primary executable, while `CMD` supplies default command arguments or a default command. Their interaction depends on their forms and any runtime command overrides.

### Q15. What does `-p 8080:80` mean?

It maps host port 8080 to container port 80. In this project, the browser accesses port 8080 while NGINX listens on port 80 inside the container.

### Q16. What is Docker Compose?

Docker Compose defines and runs multi-container applications using a YAML configuration file. It is useful for local environments containing an API, database, and other dependencies.

### Q17. What is a Docker volume?

A Docker volume provides persistent storage managed by Docker. It is commonly used to keep database data across container replacement. A volume is not, by itself, a backup.

### Q18. What is the difference between a container and a virtual machine?

Containers share the host OS kernel and isolate application processes and resources. Virtual machines generally run a separate guest operating system and kernel. Their resource use and isolation characteristics differ.

### Q19. Why did this React project use NGINX?

Vite produces static production files. NGINX can serve those files efficiently without requiring the Node.js development server to run in the final container.

### Q20. Explain this project's Docker workflow.

1. Create the React project using Vite.
2. Build the production files in the Node.js Docker stage.
3. Copy the generated `dist` files into the NGINX final stage.
4. Build the Docker image with `docker build`.
5. Create and start a container with `docker run`.
6. Publish host port 8080 to container port 80.
7. Open `http://localhost:8080` and test the React application.

## 16. What I Learned

By completing this project, I practised:

- Understanding Docker images and containers.
- Creating a Dockerfile.
- Building a Docker image using `docker build`.
- Running a container using `docker run`.
- Understanding host-to-container port mapping.
- Inspecting containers and logs.
- Running multiple containers from one image.
- Using a multi-stage Docker build.
- Serving a React production build with NGINX.

### Next learning steps

- Add Docker Compose to the project.
- Containerize a Spring Boot REST API.
- Run Spring Boot and PostgreSQL together with Compose.
- Learn Docker volumes and networks through hands-on exercises.
- Build and publish images through a CI/CD pipeline.

## 17. Official Documentation

- [Docker overview](https://docs.docker.com/get-started/docker-overview/)
- [Docker Get Started](https://docs.docker.com/get-started/)
- [Dockerfile reference](https://docs.docker.com/reference/dockerfile/)
- [Docker CLI reference](https://docs.docker.com/reference/cli/docker/)
- [Docker Compose documentation](https://docs.docker.com/compose/)
- [Vite documentation](https://vite.dev/guide/)
- [NGINX documentation](https://nginx.org/en/docs/)

---

**Project:** React Hello Docker  
**Stack:** React, Vite, Docker, NGINX  
**Purpose:** Hands-on Docker fundamentals and interview preparation.
