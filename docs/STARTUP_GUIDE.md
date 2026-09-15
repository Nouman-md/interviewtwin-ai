# InterviewTwin AI - Startup Guide

## Critical Steps to Fix Dashboard Loading Issues

### The #1 Reason Sections Fail to Load:
**The backend server is not running or not properly configured.**

---

## Step 1: Start the Backend Server

### Option A: Using Maven (Recommended)
```bash
cd backend
mvn spring-boot:run
```

### Option B: Using Java
```bash
cd backend
mvn clean package -DskipTests
java -jar target/interviewtwin-ai-1.0.0.jar
```

### What to Look For (Success Indicators):
```
✓ Interview type seed data verified: 10 types present
✓ Coding question seed data verified: 20 questions total
✓ Started InterviewTwinAiApplication in X.XXX seconds
✓ Tomcat started on port 8080
```

### Common Backend Errors:

#### Error: "Database connection refused"
**Solution:**
1. Start MySQL server
2. Create the database:
   ```bash
   mysql -u root -p
   CREATE DATABASE interviewtwin_db;
   exit;
   ```
3. Run the schema:
   ```bash
   mysql -u root -p interviewtwin_db < database/schema.sql
   ```

#### Error: "Port 8080 already in use"
**Solution:**
```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Or change port in application.properties
server.port=8081
```

---

## Step 2: Start the Frontend Server

```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE vX.X.X  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## Step 3: Verify Backend is Running

### Test 1: Check if backend responds
```bash
curl http://localhost:8080/api/auth/register -X POST -H "Content-Type: application/json" -d "{}"
```

**Expected Response:**
```json
{
  "message": "Validation failed",
  "errors": [...]
}
```

**If you get "Connection refused":**
- Backend is NOT running
- Start the backend server (Step 1)

### Test 2: Check database connection
Look at backend console logs for:
```
✓ HikariPool-1 - Started.
✓ Schema update complete
```

**If you see database errors:**
- Verify MySQL is running
- Check database credentials in `application.properties`
- Ensure database `interviewtwin_db` exists

---

## Step 4: Login and Test Dashboard

1. **Open browser:** http://localhost:5173
2. **Login or Register** a new account
3. **Navigate to Dashboard**

### Expected Behavior:
- ✅ Dashboard loads with stats cards showing "0" or actual values
- ✅ Recent Resumes section shows "No resumes uploaded yet" or your resumes
- ✅ Recent Interviews section shows "No interviews yet" or your sessions
- ✅ Quick Actions buttons are visible and clickable

### If Dashboard Shows Error:
Click "Show Debug Info" to see which API calls are failing.

---

## Step 5: Test Each Section

### A. Coding Round (`/coding-round`)
**Expected:**
- ✅ Questions load in left panel (20 questions)
- ✅ Stats bar shows at top (or hidden if no submissions)
- ✅ Can click on questions to view details
- ✅ Code editor displays

**If Failing:**
Check browser console (F12) for errors:
- "Failed to load coding challenges" → Backend not running or no questions in DB
- "Network Error" → Backend not accessible

### B. ATS Checker (`/ats-checker`)
**Expected:**
- ✅ Resume dropdown loads (or "No resumes found")
- ✅ Can select resume
- ✅ Analysis button works

**If Failing:**
- Upload a resume first at `/resume-upload`
- Check if Gemini API key is configured (required for analysis)

### C. Job Description Analyzer (`/job-analyzer`)
**Expected:**
- ✅ Resume dropdown loads
- ✅ Can paste job description
- ✅ Analysis works

**If Failing:**
- Same as ATS Checker - needs resume and Gemini API key

### D. Interview Selection (`/interview-selection`)
**Expected:**
- ✅ 10 interview type cards display
- ✅ Can click "Start Interview"
- ✅ Routes to interview session

**If Failing:**
- Check backend logs for "Interview type seed data verified: 10 types present"
- If missing, restart backend

---

## Common Issues and Solutions

### Issue 1: "All sections show loading spinner forever"
**Cause:** Backend not running or CORS error
**Solution:**
1. Start backend server
2. Check CORS configuration in `application.properties`:
   ```properties
   cors.allowed-origins=http://localhost:5173,http://localhost:3000
   ```
3. Restart backend after changes

### Issue 2: "Dashboard shows 'Unable to connect to server'"
**Cause:** Backend not running on port 8080
**Solution:**
1. Verify backend is running: `netstat -ano | findstr :8080` (Windows) or `lsof -i :8080` (Mac/Linux)
2. If not running, start backend server
3. Check frontend `.env` file has correct API URL

### Issue 3: "Coding Round shows 'No questions found'"
**Cause:** Coding questions not seeded in database
**Solution:**
1. Stop backend
2. Run schema: `mysql -u root -p interviewtwin_db < database/schema.sql`
3. Start backend - DataInitializer will seed questions automatically
4. Check logs for: "Coding question seed data verified: 20 questions total"

### Issue 4: "Interview types not found"
**Cause:** Interview types not seeded
**Solution:**
1. Restart backend
2. Check logs for: "Interview type seed data verified: 10 types present"
3. If not present, manually insert:
   ```sql
   INSERT INTO interview_types (type_name, description) VALUES
   ('TECHNICAL_INTERVIEW', 'Technical interview with coding and system design questions'),
   ('HR_INTERVIEW', 'HR interview focusing on soft skills and experience');
   ```

### Issue 5: "Authentication errors / 401 Unauthorized"
**Cause:** Token expired or invalid
**Solution:**
1. Clear browser localStorage:
   ```javascript
   // In browser console (F12)
   localStorage.clear();
   location.reload();
   ```
2. Login again

---

## Database Setup (First Time Only)

### Complete Database Initialization:

```bash
# 1. Login to MySQL
mysql -u root -p

# 2. Create database
CREATE DATABASE IF NOT EXISTS interviewtwin_db;

# 3. Use the database
USE interviewtwin_db;

# 4. Run schema
source database/schema.sql;

# 5. (Optional) Load sample data
source database/sample_data.sql;
source database/coding_questions_sample.sql;

# 6. Verify tables created
SHOW TABLES;

# 7. Exit
exit;
```

### Verify Data Seeding:

```bash
# Check interview types
mysql -u root -p interviewtwin_db -e "SELECT * FROM interview_types;"

# Check coding questions
mysql -u root -p interviewtwin_db -e "SELECT COUNT(*) FROM coding_questions;"
```

**Expected:**
- 10 interview types
- 20 coding questions (after backend starts)

---

## Environment Configuration

### Backend (`backend/src/main/resources/application.properties`):

```properties
# Database (MUST match database name from schema.sql)
spring.datasource.url=jdbc:mysql://localhost:3306/interviewtwin_db
spring.datasource.username=root
spring.datasource.password=your_password

# JWT (use a secure secret in production)
jwt.secret=your-very-secure-secret-key

# Gemini AI (required for ATS analysis)
gemini.api.key=your_gemini_api_key_here

# CORS (allow your frontend URL)
cors.allowed-origins=http://localhost:5173
```

### Frontend (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:8080/api
```

---

## Testing Checklist

Use this checklist to verify everything works:

### Backend Tests:
- [ ] Backend starts without errors
- [ ] Logs show: "Interview type seed data verified: 10 types present"
- [ ] Logs show: "Coding question seed data verified: 20 questions total"
- [ ] Can access: http://localhost:8080/api/auth/register (returns 400, not connection refused)

### Frontend Tests:
- [ ] Frontend starts on http://localhost:5173
- [ ] Can register new user
- [ ] Can login
- [ ] Dashboard loads without errors
- [ ] Browser console (F12) shows no red errors

### Section Tests:
- [ ] Dashboard shows stats (even if 0)
- [ ] Dashboard shows "No resumes uploaded yet" or resumes list
- [ ] Dashboard shows "No interviews yet" or sessions list
- [ ] Coding Round loads questions
- [ ] ATS Checker loads resume dropdown
- [ ] Job Analyzer loads resume dropdown
- [ ] Interview Selection shows 10 interview types

---

## Debug Mode

### Enable Detailed Logging:

In `application.properties`:
```properties
logging.level.com.interviewtwin=DEBUG
logging.level.org.springframework.web=DEBUG
```

### Browser Console:
Press F12 to open DevTools:
- **Console tab:** Check for errors
- **Network tab:** Check API calls (should be 200 status)
- **Application tab:** Check localStorage for token

### Backend Console:
Look for these log messages:
```
✓ Interview type seed data verified: 10 types present
✓ Coding question seed data verified: 20 questions total
✓ Started InterviewTwinAiApplication
✓ HikariPool-1 - Started
```

---

## Quick Fixes Summary

| Problem | Solution |
|---------|----------|
| All sections fail to load | Start backend server |
| "Connection refused" | Backend not running - start it |
| "No questions found" | Restart backend to seed questions |
| "Interview type not found" | Restart backend to seed interview types |
| 401 Unauthorized | Clear localStorage and login again |
| CORS errors | Check `cors.allowed-origins` in application.properties |
| Database errors | Create database and run schema.sql |

---

## Still Not Working?

### Check These in Order:

1. **Is MySQL running?**
   ```bash
   mysql -u root -p
   ```

2. **Does database exist?**
   ```bash   mysql -u root -p -e "SHOW DATABASES;"
   ```

3. **Is backend running?**
   ```bash
   curl http://localhost:8080/api/auth/register
   ```

4. **Is frontend running?**
   ```bash
   curl http://localhost:5173
   ```

5. **Check browser console (F12)**
   - Look for red errors
   - Check Network tab for failed API calls
   - Use "Show Debug Info" on dashboard

6. **Check backend logs**
   - Look for error messages
   - Verify data seeding completed
   - Check database connection success

---

## Important Notes

1. **Backend MUST be running before frontend**
   - Backend: Port 8080
   - Frontend: Port 5173

2. **Database MUST be initialized**
   - Run `database/schema.sql` first
   - Backend will auto-seed data on first run

3. **Gemini API key is optional**
   - Required only for ATS analysis and job matching
   - Get key from: https://makersuite.google.com/app/apikey

4. **First load may be slow**
   - Backend initialization takes 10-30 seconds
   - Data seeding happens on first run

---

## Success Indicators

✅ Backend console shows successful startup messages
✅ Frontend loads without errors
✅ Dashboard displays with stats (even if 0)
✅ All sections load independently
✅ Browser console shows no red errors
✅ Network tab shows all API calls returning 200

---

**Last Updated:** 2026-08-09
**Status:** This guide should resolve all dashboard loading issues