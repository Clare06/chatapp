# ChatApp

Nish's chat app.

## Project Structure

This project follows an industry-standard monolithic repository structure containing both the frontend and backend applications.

- `/frontend` - Angular frontend application.
- `/backend`  - Spring Boot backend application.

## Setup

### Backend
1. Navigate to the `/backend` directory.
2. Ensure you have a `.env` file in the `/backend` directory with your database and mail credentials. You can copy the structure from `.env.example` if available.
3. Run the application using Maven: `./mvnw spring-boot:run`.

### Frontend
1. Navigate to the `/frontend` directory.
2. Install dependencies: `npm install`.
3. Run the development server: `npm start` or `ng serve`.

## Environment Variables
Credentials should be supplied in a `.env` file within the `backend/` directory. These are automatically picked up by Spring Boot via `spring-dotenv`.
