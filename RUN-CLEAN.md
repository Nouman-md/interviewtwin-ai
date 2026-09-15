# InterviewTwin AI — Clean Project

This archive intentionally excludes generated/build files, node_modules, old logs,
and uploaded resume files. Those files should be regenerated locally.

## Requirements
- Java 21
- Maven 3.9+
- Node.js 20+ (Node 22 is also fine)
- MySQL 8.x

## Backend — PowerShell

Set your database password for the current terminal:

    $env:DB_PASSWORD="YOUR_MYSQL_PASSWORD"

Set the Gemini key:

    $env:GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

Optional:

    $env:GEMINI_MODEL_NAME="gemini-3.6-flash"

Then:

    cd backend
    mvn clean spring-boot:run

## Frontend — PowerShell

Open a second terminal:

    cd frontend
    npm install
    npm run dev

Open the Vite URL shown in the terminal (normally http://localhost:5173).

## Important
- Do NOT copy the old `target`, `node_modules`, `backend.log`, or `backend.err`
  folders/files back into this clean project.
- The backend source uses `user.userId` in the JPA repository queries, matching
  the User entity field.
- Gemini is configured through environment variables rather than a hard-coded API key.
