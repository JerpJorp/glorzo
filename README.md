# Glorzo

This repository contains a full-stack application organized into a monorepo-like structure.

## Project Structure

- **backend**: A Node.js and TypeScript-based REST API using Express.
- **frontend**: An Angular web application.
- **shared**: A TypeScript library containing types, interfaces, and utilities shared between the frontend and backend.

## Setup

Before running the applications, ensure you have installed dependencies and built the shared library.

### 1. Build Shared Library
The `shared` library must be built first as the other projects depend on it.

```bash
cd shared
npm install
npm run build
```

### 2. Install Dependencies
Install dependencies for backend and frontend.

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Running the Application

### Backend
To start the backend development server:

```bash
cd backend
# Windows (PowerShell)
$env:OPENROUTER_API_KEY="your_key_here"; npm start

# Mac/Linux
export OPENROUTER_API_KEY=your_key_here && npm start
```
The server will start at `http://localhost:3000`.

### Frontend
To start the frontend development server:

```bash
cd frontend
npm start
```
The application will be available at `http://localhost:4200`.

## Building for Production

### Backend
```bash
cd backend
npm run build
```

### Frontend
```bash
cd frontend
npm run build
```
