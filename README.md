# InterviewTwin AI - AI-Powered Placement Preparation Platform

A comprehensive full-stack application designed to help students and professionals prepare for job interviews with AI-powered feedback, ATS resume analysis, mock interviews, and coding challenges.

## 🌟 Features

### 1. **Authentication & Profile Management**
- User registration and login with JWT authentication
- Secure password encryption using BCrypt
- Role-based access control
- Profile management with career information

### 2. **Resume Management**
- Upload resumes (PDF/DOCX format)
- Store multiple resumes
- Set primary resume
- Download uploaded resumes

### 3. **ATS Resume Checker**
- Analyze resumes against ATS systems
- ATS compatibility score
- Keyword optimization suggestions
- Formatting and content analysis
- Grammar checking
- Improvement recommendations

### 4. **Job Description Analyzer**
- Paste job descriptions
- Match resumes against job descriptions
- Identify matching skills
- Highlight missing skills
- Get tailored suggestions

### 5. **AI-Powered Mock Interviews**
- Multiple interview categories:
  - Technical Interviews
  - HR Interviews
  - Java Specialized
  - SQL Specialized
  - OOP Concepts
  - DBMS Fundamentals
- AI evaluation using Google Gemini API
- Real-time feedback and scoring
- Transcript of answers

### 6. **Coding Challenges**
- Java and Python code editor
- Multiple difficulty levels
- Test case execution
- Complexity analysis
- Code quality feedback

### 7. **Performance Analytics**
- Comprehensive performance dashboard
- Score tracking across all categories
- Visual analytics with charts
- Weak area identification
- Learning recommendations

### 8. **Reports & Downloads**
- Generate interview reports
- ATS analysis reports
- Performance reports
- PDF download functionality

## 🛠️ Tech Stack

### Frontend
- **React.js** (Vite)
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Chart.js** for analytics
- **Axios** for API calls
- **Lucide React** for icons

### Backend
- **Java 21** with Spring Boot 3.2.0
- **Spring Security** with JWT
- **Spring Data JPA** (Hibernate)
- **MySQL 8.0**
- **Google Gemini API** for AI features

### Database
- **MySQL** with comprehensive schema
- Optimized indexes for performance
- Foreign key constraints

## 📋 Project Structure

```
InterviewTwin-AI/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── context/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── backend/
│   ├── src/main/java/com/interviewtwin/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   ├── dto/
│   │   ├── security/
│   │   ├── exception/
│   │   └── InterviewTwinApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
│
├── database/
│   └── schema.sql
│
├── docs/
│   ├── README.md
│   ├── INSTALLATION.md
│   ├── API_DOCUMENTATION.md
│   └── ARCHITECTURE.md
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Java 21** or higher
- **Node.js 16+** and npm
- **MySQL 8.0+**
- **Git**

### 1. Database Setup

```bash
# Create database
mysql -u root -p < database/schema.sql

# Or manually:
mysql -u root -p
CREATE DATABASE interviewtwin_db;
USE interviewtwin_db;
SOURCE database/schema.sql;
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Configure application.properties
# Update MySQL credentials:
# spring.datasource.username=root
# spring.datasource.password=your_password
# gemini.api.key=your-gemini-api-key

# Build and run
mvn clean install
mvn spring-boot:run

# Backend will be available at http://localhost:8080
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Frontend will be available at http://localhost:5173
```

## 🔑 Environment Variables

### Backend (application.properties)

```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/interviewtwin_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT
jwt.secret=your-very-secure-secret-key-min-256-bits
jwt.expiration=86400000

# Gemini API
gemini.api.key=your-gemini-api-key

# File Upload
file.upload.directory=uploads/resumes/
file.upload.allowed-extensions=pdf,docx

# Email (Gmail SMTP)
spring.mail.username=your-email@gmail.com
spring.mail.password=your-app-password
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:8080/api
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/{userId}` - Update profile
- `POST /api/users/{userId}/change-password` - Change password

### Resumes
- `POST /api/resumes/upload` - Upload resume
- `GET /api/resumes` - Get user's resumes
- `DELETE /api/resumes/{resumeId}` - Delete resume
- `PUT /api/resumes/{resumeId}/set-primary` - Set as primary

### ATS Reports
- `POST /api/ats/analyze/{resumeId}` - Analyze resume
- `GET /api/ats/reports` - Get all reports
- `GET /api/ats/{reportId}` - Get specific report

### Interviews
- `POST /api/interviews/start/{type}` - Start interview
- `GET /api/interviews/{sessionId}` - Get session
- `GET /api/interviews/{sessionId}/next-question` - Get next question
- `POST /api/interviews/{sessionId}/submit-answer` - Submit answer
- `POST /api/interviews/{sessionId}/end` - End interview

### Coding
- `GET /api/coding/questions/{codingId}` - Get question
- `POST /api/coding/submit/{codingId}` - Submit code
- `GET /api/coding/submissions/user` - Get submissions

### Performance
- `GET /api/performance` - Get performance data
- `POST /api/performance/identify-weak-areas` - Identify weak areas

## 🔐 Security Features

- **JWT Authentication**: Stateless token-based authentication
- **Password Encryption**: BCrypt for secure password storage
- **CORS Configuration**: Configured for frontend domain
- **Role-Based Access**: USER and ADMIN roles
- **Input Validation**: Comprehensive validation on all inputs
- **Exception Handling**: Global exception handler for consistent error responses

## 📊 Database Schema

The application includes 12+ tables with proper relationships:

- `users` - User accounts
- `roles` - User roles
- `user_roles` - Role assignments
- `resumes` - Uploaded resumes
- `ats_reports` - ATS analysis results
- `job_descriptions` - Saved job descriptions
- `interview_sessions` - Interview sessions
- `questions` - Interview questions
- `answers` - User answers
- `coding_questions` - Coding problems
- `coding_submissions` - Code submissions
- `performance` - Performance metrics
- `learning_roadmap` - Personalized learning plans
- `reports` - Generated reports

## 🎯 Key Functionalities

### Resume Analysis
- Extracts and analyzes resume content
- Checks ATS compatibility
- Identifies missing keywords
- Suggests improvements
- Analyzes formatting quality

### Interview System
- Fetches questions from database
- AI evaluates answers using Gemini API
- Provides detailed feedback
- Tracks performance metrics
- Identifies weak areas

### Coding Platform
- Supports Java and Python
- Real-time code compilation
- Test case execution
- Complexity analysis
- Score calculation

### Analytics Dashboard
- Radar charts for score comparison
- Bar charts for category analysis
- Doughnut charts for progress
- Key metrics display
- Performance trends

## 🚢 Deployment

### Backend Deployment (using Docker)

```dockerfile
FROM openjdk:21-slim
COPY target/interviewtwin-ai-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Frontend Deployment

```bash
# Build production version
npm run build

# Deploy the dist/ folder to:
# - Vercel
# - Netlify
# - AWS S3
# - GitHub Pages
```

## 📚 Documentation

- [Installation Guide](docs/INSTALLATION.md)
- [API Documentation](docs/API_DOCUMENTATION.md)
- [Architecture Guide](docs/ARCHITECTURE.md)
- [Database Design](docs/DATABASE_DESIGN.md)

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use**
```bash
# Backend (8080)
lsof -i :8080
kill -9 <PID>

# Frontend (5173)
lsof -i :5173
kill -9 <PID>
```

**Database Connection Failed**
```bash
# Check MySQL is running
mysql -u root -p -e "SELECT 1"

# Verify credentials in application.properties
```

**CORS Error**
```bash
# Ensure backend CORS is configured for frontend URL
# Check SecurityConfig.java corsConfigurationSource()
```

## 📈 Performance Optimization

- **Database Indexing**: Optimized indexes on frequently queried columns
- **Connection Pooling**: HikariCP for efficient database connections
- **API Caching**: Responses cached where appropriate
- **Code Splitting**: Frontend code split for faster loading
- **Image Optimization**: Compressed images in assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📧 Support

For support, email support@interviewtwin.com or open an issue on GitHub.

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- Spring Boot team for excellent framework
- React community for amazing libraries
- All contributors and users

---

**Made with ❤️ by InterviewTwin Team**

Last Updated: 2024
Version: 1.0.0
