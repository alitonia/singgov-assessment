# React App Singgov

This project is a React application built with React Router, featuring server-side rendering, TypeScript, and
TailwindCSS.

## Getting Started

### Prerequisites

- Node.js (version 22 or later)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/alitonia/frontend-test
   cd frontend-test
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000` (or another port if 3000 is in use).

### Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `build` directory.

## Testing

This project uses Cypress for end-to-end testing.

```bash
npm run cypress:open
```

## Docker Deployment

This project includes a Dockerfile for containerization.

To build and run the Docker container:

```bash
docker build -t frontend-test .
docker run -p 3000:3000 frontend-test
```
