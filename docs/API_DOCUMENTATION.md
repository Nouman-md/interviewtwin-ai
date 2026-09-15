# API Documentation

Complete reference for all InterviewTwin AI REST API endpoints.

## Base URL
```
http://localhost:8080/api
```

## Authentication

All endpoints except `/auth/register` and `/auth/login` require JWT token in header:

```
Authorization: Bearer <token>
```

## Error Response Format

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Error description",
  "path": "/api/endpoint"
}
```

---

## 🔐 Authentication Endpoints

### Register User
**POST** `/auth/register`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "1234567890",
  "currentRole": "Junior Developer",
  "targetRole": "Senior Developer",
  "yearsOfExperience": 2
}
```

Response: `201 Created`
```json
{
  "success": true,
  "message": "User registered successfully",
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response: `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "success": true,
  "message": "Login successful"
}
```

### Logout
**POST** `/auth/logout`

Response: `200 OK`
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## 👤 User Endpoints

### Get Profile
**GET** `/users/profile`

Response: `200 OK`
```json
{
  "userId": 1,
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "fullName": "John Doe",
  "phone": "1234567890",
  "bio": "Software developer",
  "currentRole": "Junior Developer",
  "targetRole": "Senior Developer",
  "yearsOfExperience": 2,
  "isVerified": true,
  "isActive": true,
  "createdAt": "2024-01-01T10:00:00",
  "updatedAt": "2024-01-15T10:00:00",
  "lastLogin": "2024-01-15T09:00:00"
}
```

### Get User by ID
**GET** `/users/{userId}`

Response: `200 OK` - Same as Get Profile

### Update User
**PUT** `/users/{userId}`

Request:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "phone": "9876543210",
  "bio": "Senior Developer",
  "currentRole": "Senior Developer",
  "yearsOfExperience": 5
}
```

Response: `200 OK` - Updated user object

### Change Password
**POST** `/users/{userId}/change-password`

Request:
```json
{
  "oldPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

Response: `200 OK`
```json
{
  "message": "Password changed successfully",
  "success": true
}
```

### Delete User
**DELETE** `/users/{userId}`

Response: `200 OK`
```json
{
  "message": "User deleted successfully",
  "success": true
}
```

---

## 📄 Resume Endpoints

### Upload Resume
**POST** `/resumes/upload`

Content-Type: `multipart/form-data`

Form Data:
- `file`: Resume file (PDF/DOCX)

Response: `201 Created`
```json
{
  "resumeId": 1,
  "userId": 1,
  "fileName": "resume.pdf",
  "filePath": "uploads/resumes/1/uuid.pdf",
  "fileSize": 102400,
  "fileType": "pdf",
  "isPrimary": false,
  "uploadedAt": "2024-01-15T10:00:00",
  "updatedAt": "2024-01-15T10:00:00"
}
```

### Get User Resumes
**GET** `/resumes`

Response: `200 OK`
```json
[
  {
    "resumeId": 1,
    "userId": 1,
    "fileName": "resume.pdf",
    "filePath": "uploads/resumes/1/uuid.pdf",
    "fileSize": 102400,
    "fileType": "pdf",
    "isPrimary": true,
    "uploadedAt": "2024-01-15T10:00:00",
    "updatedAt": "2024-01-15T10:00:00"
  }
]
```

### Get Specific Resume
**GET** `/resumes/{resumeId}`

Response: `200 OK` - Single resume object

### Set as Primary
**PUT** `/resumes/{resumeId}/set-primary`

Response: `200 OK` - Resume object with `isPrimary: true`

### Delete Resume
**DELETE** `/resumes/{resumeId}`

Response: `200 OK`
```json
{
  "message": "Resume deleted successfully",
  "success": true
}
```

### Download Resume
**GET** `/resumes/{resumeId}/download`

Response: `200 OK` - Binary file download

---

## 🔍 ATS Report Endpoints

### Analyze Resume
**POST** `/ats/analyze/{resumeId}`

Response: `201 Created`
```json
{
  "reportId": 1,
  "userId": 1,
  "resumeId": 1,
  "atsScore": 78.5,
  "keywordScore": 75.0,
  "formattingScore": 82.0,
  "contentScore": 79.0,
  "missingKeywords": ["Kubernetes", "Docker", "AWS"],
  "foundKeywords": ["Java", "Spring Boot", "MySQL"],
  "improvementSuggestions": ["Add cloud technologies"],
  "grammarIssues": [],
  "sectionAnalysis": {...},
  "reportData": {...},
  "createdAt": "2024-01-15T10:00:00",
  "updatedAt": "2024-01-15T10:00:00"
}
```

### Get All ATS Reports
**GET** `/ats/reports`

Response: `200 OK` - Array of ATS report objects

### Get Latest Report
**GET** `/ats/latest`

Response: `200 OK` - Latest ATS report object

### Get Specific Report
**GET** `/ats/{reportId}`

Response: `200 OK` - Single ATS report object

---

## 🎤 Interview Endpoints

### Start Interview
**POST** `/interviews/start/{interviewType}`

URL Parameters:
- `interviewType`: TECHNICAL_INTERVIEW, HR_INTERVIEW, JAVA_INTERVIEW, SQL_INTERVIEW, OOP_INTERVIEW, DBMS_INTERVIEW

Response: `201 Created`
```json
{
  "sessionId": 1,
  "userId": 1,
  "sessionTitle": "TECHNICAL_INTERVIEW - 2024-01-15T10:00:00",
  "startTime": "2024-01-15T10:00:00",
  "status": "IN_PROGRESS",
  "overallScore": null,
  "feedback": null
}
```

### Get Session
**GET** `/interviews/{sessionId}`

Response: `200 OK` - Session object

### Get Next Question
**GET** `/interviews/{sessionId}/next-question`

Response: `200 OK`
```json
{
  "questionId": 1,
  "questionText": "What is polymorphism?",
  "category": "OOP",
  "difficultyLevel": "EASY",
  "expectedKeyPoints": ["Method overriding", "Runtime behavior"],
  "modelAnswer": "Polymorphism is..."
}
```

### Submit Answer
**POST** `/interviews/{sessionId}/submit-answer`

Request:
```json
{
  "questionId": 1,
  "userAnswer": "Polymorphism allows objects to take many forms..."
}
```

Response: `201 Created`
```json
{
  "answerId": 1,
  "sessionId": 1,
  "questionId": 1,
  "userAnswer": "Polymorphism allows...",
  "answerScore": 85.0,
  "feedback": "Great explanation with good examples",
  "aiEvaluation": {...},
  "strengths": ["Clear explanation"],
  "improvements": ["Add more examples"],
  "createdAt": "2024-01-15T10:05:00"
}
```

### End Interview
**POST** `/interviews/{sessionId}/end`

Response: `200 OK` - Completed session with overall score

### Get User Sessions
**GET** `/interviews/user/sessions`

Response: `200 OK` - Array of all user's sessions

### Get Completed Sessions
**GET** `/interviews/user/completed`

Response: `200 OK` - Array of completed sessions

### Get Session Answers
**GET** `/interviews/{sessionId}/answers`

Response: `200 OK` - Array of answer objects for session

---

## 💻 Coding Endpoints

### Get Question
**GET** `/coding/questions/{codingId}`

Response: `200 OK`
```json
{
  "codingId": 1,
  "questionText": "Reverse a string",
  "category": "String",
  "difficultyLevel": "EASY",
  "language": "JAVA",
  "description": "Write a function to reverse a string",
  "constraints": "Length <= 1000",
  "examples": "Input: hello, Output: olleh",
  "testCases": [...]
}
```

### Get Questions by Difficulty
**GET** `/coding/questions/difficulty/{difficulty}`

URL Parameters:
- `difficulty`: EASY, MEDIUM, HARD

Response: `200 OK` - Array of questions

### Get Random Questions
**GET** `/coding/questions/random?count=5`

Query Parameters:
- `count`: Number of questions (default: 5)

Response: `200 OK` - Array of random questions

### Submit Code
**POST** `/coding/submit/{codingId}`

Request:
```json
{
  "code": "public class Solution { ... }",
  "language": "JAVA"
}
```

Response: `201 Created`
```json
{
  "submissionId": 1,
  "userId": 1,
  "codingId": 1,
  "code": "...",
  "language": "JAVA",
  "status": "ACCEPTED",
  "score": 100.0,
  "compilationOutput": "Code compiled successfully",
  "testResults": "All tests passed",
  "executionTime": 250,
  "memoryUsed": 64,
  "complexityAnalysis": {
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)"
  },
  "submittedAt": "2024-01-15T10:00:00"
}
```

### Get Submission
**GET** `/coding/submissions/{submissionId}`

Response: `200 OK` - Submission object

### Get User Submissions
**GET** `/coding/submissions/user`

Response: `200 OK` - Array of user's submissions

### Get Question Submissions
**GET** `/coding/submissions/question/{codingId}`

Response: `200 OK` - Array of submissions for specific question

---

## 📊 Performance Endpoints

### Get Performance Data
**GET** `/performance`

Response: `200 OK`
```json
{
  "performanceId": 1,
  "userId": 1,
  "atsScore": 78.5,
  "technicalScore": 85.0,
  "hrScore": 80.0,
  "codingScore": 90.0,
  "communicationScore": 75.0,
  "overallPlacementReadiness": 82.0,
  "totalInterviews": 5,
  "totalCodingProblems": 10,
  "weakTopics": {"coding": 70},
  "strongTopics": {"technical": 90}
}
```

### Identify Weak Areas
**POST** `/performance/identify-weak-areas`

Response: `200 OK`
```json
{
  "message": "Weak areas identified"
}
```

---

## Status Codes

- `200 OK` - Successful request
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Missing or invalid authentication
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource already exists
- `500 Internal Server Error` - Server error

---

## Rate Limiting

Currently no rate limiting implemented. For production, implement:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

---

## Pagination

Endpoints returning lists support pagination:
- Query Parameters: `page=0&size=20&sort=createdAt,desc`

---

## Filtering

Supported filtering options:
- By date range: `startDate` and `endDate`
- By status: `status=COMPLETED`
- By difficulty: `difficulty=EASY`

---

For more information, refer to the source code and Swagger documentation (when enabled).
