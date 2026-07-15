# ChatApp

Nish's Chat App - A modern real-time chat application.

## Technologies Used

*   **Backend:** Spring Boot 3.3.4, Spring Security, Spring Websockets, Spring Data JPA
*   **Frontend:** Angular 22, Bootstrap, Angular Material
*   **Database:** MySQL

## Getting Started

### Prerequisites

*   Node.js (v22+)
*   npm (v10+)
*   Java Development Kit (JDK) 17+
*   MySQL Server

### Backend Setup (Spring Boot)

1. Navigate to the root directory of the project.
2. Ensure you have a running MySQL database. Update the `src/main/resources/application.properties` (or equivalent) with your database credentials if necessary.
3. Build the backend using Maven:
   ```
   ./mvnw clean install -DskipTests
   ```
4. Run the Spring Boot application:
   ```
   ./mvnw spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### Frontend Setup (Angular)

1. Navigate to the frontend directory:
   ```
   cd chatFrontEnd
   ```
2. Install the necessary dependencies:
   ```
   npm install
   ```
3. Build the frontend:
   ```
   npm run build
   ```
4. To start the development server, run:
   ```
   ng serve
   ```
   The frontend will be available at `http://localhost:4200`.

### Environment Variables for Backend

The backend expects certain environment variables to be set for the database and email configuration. You can see `application.properties.example` for details.

When running the app, you can pass them as such:

```bash
DB_PASSWORD=yourpassword MAIL_USERNAME=youremail@gmail.com MAIL_PASSWORD=your_app_password ./mvnw spring-boot:run
```
