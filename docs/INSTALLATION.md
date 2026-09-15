# Installation Guide

Complete step-by-step instructions to set up InterviewTwin AI locally.

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Java**: JDK 21 or higher
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **MySQL**: v8.0 or higher
- **Git**: Latest version

## Step 1: Clone or Download the Project

```bash
# If using git
git clone <repository-url>
cd InterviewTwin-AI

# Or extract the ZIP file
unzip InterviewTwin-AI.zip
cd InterviewTwin-AI
```

## Step 2: Database Setup

### 2.1 Start MySQL Server

**Windows:**
```bash
# If installed as service, it should start automatically
# Or start from Services app

# Or from command line:
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqld"
```

**macOS (Homebrew):**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

### 2.2 Create Database

```bash
# Connect to MySQL
mysql -u root -p

# Enter your MySQL password when prompted
# Then run:

CREATE DATABASE interviewtwin_db;
USE interviewtwin_db;
SOURCE database/schema.sql;

# Exit MySQL
EXIT;
```

**Or using command line directly:**
```bash
mysql -u root -p < database/schema.sql
```

### 2.3 Verify Database

```bash
mysql -u root -p -e "USE interviewtwin_db; SHOW TABLES;"
```

You should see 12+ tables created.

## Step 3: Backend Setup

### 3.1 Configure Application Properties

Navigate to `backend/src/main/resources/application.properties`

Update these settings:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/interviewtwin_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# JWT Configuration (Generate a secure key)
jwt.secret=your-very-secure-random-key-at-least-256-bits-long
jwt.expiration=86400000

# Gemini API Key (Get from Google AI Studio)
gemini.api.key=your-gemini-api-key-here

# Email Configuration (if using Gmail)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### 3.2 Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com)
2. Click "Get API Key"
3. Create a new API key
4. Copy and paste in application.properties

### 3.3 Build Backend

```bash
cd backend

# On Windows
mvn clean install

# On macOS/Linux
./mvnw clean install
```

Wait for dependencies to download and build to complete.

### 3.4 Run Backend

```bash
# Using Maven
mvn spring-boot:run

# Or run the JAR directly
java -jar target/interviewtwin-ai-1.0.0.jar
```

Backend should start on: `http://localhost:8080`

You should see:
```
InterviewTwinApplication : Started InterviewTwinApplication in X seconds
```

## Step 4: Frontend Setup

### 4.1 Install Dependencies

```bash
cd ../frontend

# Install npm packages
npm install

# This will install:
# - React
# - React Router
# - Axios
# - Tailwind CSS
# - Chart.js
# - And other dependencies
```

### 4.2 Run Frontend

```bash
# Start development server
npm run dev

# Output will show:
# VITE v5.0.0 ready in XXX ms
# ➜  Local:   http://localhost:5173/
```

## Step 5: Verify Installation

### 5.1 Check Backend

```bash
# Terminal 1: Backend is running on 8080
curl http://localhost:8080/api/auth/login

# You should get a response (might be 400 Bad Request, but that's OK)
```

### 5.2 Check Frontend

Open browser and navigate to: `http://localhost:5173`

You should see the InterviewTwin landing page.

### 5.3 Test Authentication

1. Click "Sign Up"
2. Create a new account with:
   - Email: test@example.com
   - Password: Test@123
   - Name: Test User
3. Click "Sign Up"
4. You should be redirected to login
5. Login with your credentials
6. You should see the dashboard

## Troubleshooting

### MySQL Connection Error

**Error:** `Could not connect to database server`

**Solution:**
```bash
# Check MySQL status
# Windows: Services app > MySQL80 (should be running)
# macOS: brew services list
# Linux: sudo systemctl status mysql

# Check credentials in application.properties
# Default: username=root, password=<your_password>

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"
```

### Port Already in Use

**Error:** `Port 8080 already in use`

**Solution:**
```bash
# Windows: Find and kill process on port 8080
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :8080
kill -9 <PID>

# Or change port in application.properties:
server.port=8081
```

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS`

**Solution:**
- Ensure backend is running on `http://localhost:8080`
- Ensure frontend is running on `http://localhost:5173`
- CORS is already configured in SecurityConfig.java
- Restart both servers

### Gemini API Not Working

**Error:** `Failed to call Gemini API`

**Solution:**
- Verify API key is correct in application.properties
- Check internet connection
- Ensure API quota is not exceeded
- Try a different API key

### Maven Build Failure

**Error:** `Failed to build project`

**Solution:**
```bash
# Clean build
mvn clean

# Update dependencies
mvn -U clean install

# Check Java version
java -version

# Should be 21 or higher
```

### NPM Dependencies Issue

**Error:** `npm install fails`

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still fails, update npm
npm install -g npm@latest
```

## IDE Setup

### IntelliJ IDEA (Recommended for Java)

1. Open project: `File > Open` > select backend folder
2. Configure JDK:
   - `File > Project Structure > Project`
   - Set SDK to Java 21
3. Maven projects auto-detect, just right-click `pom.xml > Maven > Reload`
4. Run: Right-click `InterviewTwinApplication.java > Run`

### VS Code (Recommended for Frontend)

1. Install extensions:
   - ES7+ React/Redux/React-Native snippets
   - Tailwind CSS IntelliSense
   - Prettier
   - ESLint

2. Open frontend folder

3. Terminal > New Terminal:
```bash
npm install
npm run dev
```

## Next Steps

After successful installation:

1. **Explore Features**:
   - Upload a resume
   - Analyze with ATS Checker
   - Start a mock interview
   - Try coding challenges

2. **Configure Email** (Optional):
   - Set up Gmail app password
   - Update `spring.mail.*` properties

3. **Deploy** (When ready):
   - Backend: Docker or Cloud Platform
   - Frontend: Netlify, Vercel, or GitHub Pages

4. **Customize**:
   - Add more interview questions to database
   - Add coding problems
   - Customize UI theme

## Getting Help

### Documentation Files
- API_DOCUMENTATION.md - All API endpoints
- ARCHITECTURE.md - System architecture
- DATABASE_DESIGN.md - Database schema details

### Common Resources
- Spring Boot: https://spring.io/projects/spring-boot
- React: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Google Gemini API: https://ai.google.dev

---

**Installation complete! Proceed to use the application.**
