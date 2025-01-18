# Football Manager Transfer Market

## Description

This project is a full-stack application for managing a football transfer market. It consists of a Node.js backend and a React frontend, utilizing TypeScript for type safety. The application is containerized using Docker and served with Nginx.

## Technologies Used

- **Backend**: Node.js, Express, TypeScript, MongoDB
- **Frontend**: React, Vite, TypeScript
- **Containerization**: Docker
- **Web Server**: Nginx
- **Code Quality**: ESLint, Prettier

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (for local development)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/idrsdev/transfer-market.git
cd transfer-market
```

### 2. Set Up Environment Variables

Copy the example environment file for the backend:

```bash
cp backend/.env.example backend/.env
```

Edit the `.env` file to configure your environment variables, such as database connection strings and secrets.

### 3. Install Dependencies (Optional for Local Development)

If you want to run the backend or frontend locally without Docker, install the necessary dependencies:

#### Backend

```bash
cd backend
npm install
```

#### Frontend

```bash
cd frontend
npm install
```

### 4. Running the Application Locally

To run the backend and frontend locally, you can use the following commands:

#### Start the Backend

```bash
cd backend
npm run dev # or npm run build && npm start
```

#### Start the Frontend

```bash
cd frontend
npm run dev # or npm run build && npm run preview
```

### 5. Running the Application with Docker

To run the application using Docker, follow these steps:

#### Build and Start Containers

```bash
docker-compose up --build # or docker compose up (depending upon your compose installation)
```

This command will:

- Build the Docker images for the frontend and backend.
- Start the containers and set up the network.

#### Access the Application

- The frontend will be accessible at `http://localhost:80`.
- The backend API will be accessible at `http://localhost:5000/api`.

### 6. Stopping the Application

To stop the running containers, use:

```bash
docker-compose down
```

### 7. Cleaning Up

To remove all stopped containers and unused images, you can run:

```bash
docker system prune
```

## Additional Notes

- Ensure that MongoDB is running if you are not using a Dockerized version.
- You can run MongoDB locally or use a cloud service like MongoDB Atlas.
- Make sure you can access your MongoDB instance from the backend service.
