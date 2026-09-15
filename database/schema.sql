-- InterviewTwin AI Database Schema
-- MySQL 8.0+

CREATE DATABASE IF NOT EXISTS interviewtwin_db;
USE interviewtwin_db;

-- Users Table
CREATE TABLE users (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    profile_picture_url VARCHAR(500),
    bio TEXT,
    current_role VARCHAR(100),
    target_role VARCHAR(100),
    years_of_experience INT DEFAULT 0,
    is_verified BOOLEAN DEFAULT TRUE,
    verification_token VARCHAR(255),
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles Table
CREATE TABLE roles (
    role_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User Roles (Junction Table)
CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(role_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Resumes Table
CREATE TABLE resumes (
    resume_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_uploaded_at (uploaded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ATS Reports Table
CREATE TABLE ats_reports (
    report_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    resume_id BIGINT,
    ats_score DECIMAL(5,2) DEFAULT 0,
    keyword_score DECIMAL(5,2) DEFAULT 0,
    formatting_score DECIMAL(5,2) DEFAULT 0,
    content_score DECIMAL(5,2) DEFAULT 0,
    missing_keywords JSON,
    found_keywords JSON,
    improvement_suggestions JSON,
    grammar_issues JSON,
    section_analysis JSON,
    report_data JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job Descriptions Table
CREATE TABLE job_descriptions (
    job_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    job_description TEXT NOT NULL,
    required_skills JSON,
    nice_to_have_skills JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Job-Resume Analysis Table
CREATE TABLE job_resume_analysis (
    analysis_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    job_id BIGINT NOT NULL,
    resume_id BIGINT,
    match_percentage DECIMAL(5,2),
    matching_skills JSON,
    missing_skills JSON,
    suggestions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (job_id) REFERENCES job_descriptions(job_id) ON DELETE CASCADE,
    FOREIGN KEY (resume_id) REFERENCES resumes(resume_id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interview Types Table
CREATE TABLE interview_types (
    type_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Interview Sessions Table
CREATE TABLE interview_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    type_id BIGINT NOT NULL,
    session_title VARCHAR(255),
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    duration_minutes INT,
    status VARCHAR(50) DEFAULT 'IN_PROGRESS',
    overall_score DECIMAL(5,2),
    feedback TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (type_id) REFERENCES interview_types(type_id),
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Questions Table
CREATE TABLE questions (
    question_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    type_id BIGINT NOT NULL,
    category VARCHAR(100),
    question_text TEXT NOT NULL,
    difficulty_level VARCHAR(50),
    expected_key_points JSON,
    model_answer TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (type_id) REFERENCES interview_types(type_id),
    INDEX idx_type_id (type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Answers Table
CREATE TABLE answers (
    answer_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    question_id BIGINT NOT NULL,
    user_answer TEXT NOT NULL,
    answer_score DECIMAL(5,2),
    feedback TEXT,
    ai_evaluation JSON,
    strengths JSON,
    improvements JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES interview_sessions(session_id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES questions(question_id),
    INDEX idx_session_id (session_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coding Questions Table
CREATE TABLE coding_questions (
    coding_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    question_text TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    question_type ENUM('DSA', 'PROGRAMMING') NOT NULL DEFAULT 'DSA',
    difficulty_level ENUM('EASY', 'MEDIUM', 'HARD') NOT NULL,
    blooms_level ENUM('REMEMBER', 'UNDERSTAND', 'APPLY', 'ANALYZE', 'EVALUATE', 'CREATE') DEFAULT 'APPLY',
    language VARCHAR(50) DEFAULT 'JAVA',
    description TEXT,
    problem_statement TEXT NOT NULL,
    constraints TEXT,
    input_format TEXT,
    output_format TEXT,
    examples JSON,
    hints JSON,
    tags JSON,
    is_favorite BOOLEAN DEFAULT FALSE,
    acceptance_rate DECIMAL(5,2) DEFAULT 0,
    total_submissions INT DEFAULT 0,
    total_accepted INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_difficulty (difficulty_level),
    INDEX idx_category (category),
    INDEX idx_question_type (question_type),
    INDEX idx_blooms (blooms_level),
    INDEX idx_title (title)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Coding Submissions Table
CREATE TABLE coding_submissions (
    submission_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    coding_id BIGINT NOT NULL,
    code TEXT NOT NULL,
    language VARCHAR(50) DEFAULT 'JAVA',
    status ENUM('ACCEPTED', 'WRONG_ANSWER', 'TIME_LIMIT_EXCEEDED', 'MEMORY_LIMIT_EXCEEDED', 'COMPILATION_ERROR', 'RUNTIME_ERROR', 'PENDING') DEFAULT 'PENDING',
    score DECIMAL(5,2),
    compilation_output TEXT,
    test_results JSON,
    execution_time INT,
    memory_used INT,
    complexity_analysis JSON,
    passed_test_cases INT DEFAULT 0,
    total_test_cases INT DEFAULT 0,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (coding_id) REFERENCES coding_questions(coding_id),
    INDEX idx_user_id (user_id),
    INDEX idx_coding_id (coding_id),
    INDEX idx_submitted_at (submitted_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Performance Table
CREATE TABLE performance (
    performance_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    ats_score DECIMAL(5,2) DEFAULT 0,
    technical_score DECIMAL(5,2) DEFAULT 0,
    hr_score DECIMAL(5,2) DEFAULT 0,
    coding_score DECIMAL(5,2) DEFAULT 0,
    communication_score DECIMAL(5,2) DEFAULT 0,
    overall_placement_readiness DECIMAL(5,2) DEFAULT 0,
    total_interviews INT DEFAULT 0,
    total_coding_problems INT DEFAULT 0,
    weak_topics JSON,
    strong_topics JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_performance (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Learning Roadmap Table
CREATE TABLE learning_roadmap (
    roadmap_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    topic_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    current_level VARCHAR(50),
    target_level VARCHAR(50),
    progress_percentage INT DEFAULT 0,
    suggested_resources JSON,
    practice_problems JSON,
    estimated_hours INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reports Table
CREATE TABLE reports (
    report_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    report_type VARCHAR(100) NOT NULL,
    report_title VARCHAR(255),
    report_data JSON,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Roles
INSERT INTO roles (role_name, description) VALUES
('USER', 'Regular user role'),
('ADMIN', 'Administrator role'),
('MODERATOR', 'Moderator role');

-- Insert Interview Types
INSERT INTO interview_types (type_name, description) VALUES
('TECHNICAL_INTERVIEW', 'Technical interview with coding and system design questions'),
('HR_INTERVIEW', 'HR interview focusing on soft skills and experience'),
('RESUME_BASED_INTERVIEW', 'Interview based on resume content'),
('JAVA_INTERVIEW', 'Java-specific technical interview'),
('SQL_INTERVIEW', 'SQL and database interview'),
('OOP_INTERVIEW', 'Object-Oriented Programming interview'),
('DBMS_INTERVIEW', 'Database Management System interview'),
('OS_INTERVIEW', 'Operating System interview'),
('COMPUTER_NETWORKS_INTERVIEW', 'Computer Networks interview'),
('CASE_INTERVIEW', 'Case study interview for problem-solving and analytical skills');

-- Create Indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_resumes_user ON resumes(user_id);
CREATE INDEX idx_ats_reports_user ON ats_reports(user_id);
CREATE INDEX idx_sessions_user ON interview_sessions(user_id);
CREATE INDEX idx_submissions_user ON coding_submissions(user_id);
CREATE INDEX idx_performance_user ON performance(user_id);
CREATE INDEX idx_roadmap_user ON learning_roadmap(user_id);
CREATE INDEX idx_coding_submissions_user_question ON coding_submissions(user_id, coding_id);

-- Create Views for Dashboard Statistics
CREATE VIEW user_statistics AS
SELECT 
    u.user_id,
    u.email,
    u.first_name,
    u.last_name,
    COALESCE(COUNT(DISTINCT i.session_id), 0) as total_interviews,
    COALESCE(COUNT(DISTINCT cs.submission_id), 0) as total_coding_submissions,
    COALESCE(p.overall_placement_readiness, 0) as placement_readiness,
    u.created_at
FROM users u
LEFT JOIN interview_sessions i ON u.user_id = i.user_id
LEFT JOIN coding_submissions cs ON u.user_id = cs.user_id
LEFT JOIN performance p ON u.user_id = p.user_id
GROUP BY u.user_id, u.email, u.first_name, u.last_name, p.overall_placement_readiness, u.created_at;
