-- Verify and Fix Programming Questions
USE interviewtwin_db;

-- Step 1: Check if question_type column exists
SELECT 
    COLUMN_NAME, 
    COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'interviewtwin_db' 
    AND TABLE_NAME = 'coding_questions' 
    AND COLUMN_NAME = 'question_type';

-- Step 2: If no results above, add the column
-- Run this if question_type column doesn't exist:
-- ALTER TABLE coding_questions 
-- ADD COLUMN question_type ENUM('DSA', 'PROGRAMMING') NOT NULL DEFAULT 'DSA' 
-- AFTER category;

-- Step 3: Check current question counts
SELECT 
    question_type, 
    COUNT(*) as count 
FROM coding_questions 
GROUP BY question_type;

-- Step 4: If programming_questions.sql wasn't loaded, load them now
-- The programming questions should have question_type = 'PROGRAMMING'
-- If you see 0 programming questions, run:
-- SOURCE database/programming_questions.sql;

-- Step 5: Verify programming questions exist
SELECT 
    coding_id,
    title,
    question_type,
    difficulty_level,
    category
FROM coding_questions 
WHERE question_type = 'PROGRAMMING'
LIMIT 10;

-- Step 6: If still 0 programming questions, manually insert a test question
INSERT INTO coding_questions (
    title, 
    question_text, 
    problem_statement, 
    question_type, 
    category, 
    difficulty_level, 
    blooms_level, 
    language, 
    description, 
    constraints, 
    input_format, 
    output_format, 
    examples, 
    hints, 
    tags
) VALUES (
    'Hello World',
    'Write a program to print "Hello, World!"',
    'Write a Java program that prints the text "Hello, World!" to the console.\n\nInput: None\nOutput: Hello, World!',
    'PROGRAMMING',
    'Java Basics',
    'EASY',
    'REMEMBER',
    'JAVA',
    'Learn to write your first Java program',
    'No input required',
    'No input format',
    'Hello, World!',
    'System.out.println("Hello, World!");',
    'Use System.out.println() to print text',
    '["beginner", "basics", "output"]'
) ON DUPLICATE KEY UPDATE title = title;

-- Step 7: Final verification
SELECT 
    question_type, 
    COUNT(*) as count 
FROM coding_questions 
GROUP BY question_type;