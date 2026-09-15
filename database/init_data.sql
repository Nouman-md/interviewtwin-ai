-- InterviewTwin AI - Complete Data Initialization Script
-- This script creates all necessary data for the application to function
-- Run this AFTER schema.sql or let Hibernate create tables automatically

USE interviewtwin_db;

-- ============================================
-- ROLES
-- ============================================
INSERT IGNORE INTO roles (role_name, description) VALUES
('USER', 'Regular user role'),
('ADMIN', 'Administrator role'),
('MODERATOR', 'Moderator role');

-- ============================================
-- INTERVIEW TYPES
-- ============================================
INSERT IGNORE INTO interview_types (type_name, description) VALUES
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

-- ============================================
-- USERS (with properly hashed passwords using BCrypt)
-- Password for both: user123 / admin123
-- ============================================
-- Admin user (password: admin123)
INSERT IGNORE INTO users (email, password, first_name, last_name, is_active, is_verified) VALUES
('admin@interviewtwin.ai', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq7M7F2uB6v9Z4p5K8uJ3wQ6xY1aB', 'Admin', 'User', TRUE, TRUE);

-- Regular user (password: user123)
INSERT IGNORE INTO users (email, password, first_name, last_name, is_active, is_verified) VALUES
('user@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.Mrq7M7F2uB6v9Z4p5K8uJ3wQ6xY1aB', 'John', 'Doe', TRUE, TRUE);

-- ============================================
-- USER ROLES
-- ============================================
INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'admin@interviewtwin.ai' AND r.role_name = 'ADMIN';

INSERT IGNORE INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'user@example.com' AND r.role_name = 'USER';

-- ============================================
-- PERFORMANCE RECORDS
-- ============================================
INSERT IGNORE INTO performance (user_id, ats_score, technical_score, hr_score, coding_score, communication_score, overall_placement_readiness, total_interviews, total_coding_problems)
SELECT user_id, 75.5, 80.0, 70.0, 65.0, 78.0, 73.0, 5, 10
FROM users WHERE email = 'user@example.com';

INSERT IGNORE INTO performance (user_id, ats_score, technical_score, hr_score, coding_score, communication_score, overall_placement_readiness, total_interviews, total_coding_problems)
SELECT user_id, 90.0, 95.0, 85.0, 90.0, 88.0, 89.6, 10, 20
FROM users WHERE email = 'admin@interviewtwin.ai';

-- ============================================
-- CODING QUESTIONS (corrected columns matching schema)
-- ============================================
INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Two Sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  'Arrays',
  'EASY',
  'APPLY',
  'JAVA',
  'Classic two sum problem - find two numbers that add up to a target',
  '2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9, Only one valid answer exists',
  'First line: n (size of array)\nSecond line: n space-separated integers\nThird line: target',
  'Two space-separated integers (indices)',
  '[{"input": "4\n2 7 11 15\n9", "output": "0 1", "explanation": "nums[0] + nums[1] = 2 + 7 = 9"}, {"input": "3\n3 2 4\n6", "output": "1 2", "explanation": "nums[1] + nums[2] = 2 + 4 = 6"}]',
  '["Use a hash map to store values and their indices", "Consider the time complexity of your solution"]',
  '["array", "hash-table", "two-pointer"]',
  45.5,
  1250,
  568
),
(
  'Reverse Linked List',
  'Given the head of a singly linked list, reverse the list, and return the reversed list.',
  'Reverse a singly linked list. You need to reverse the direction of the pointers in the list.',
  'Linked Lists',
  'EASY',
  'APPLY',
  'JAVA',
  'Classic linked list reversal - iterative and recursive approaches',
  'The number of nodes in the list is in the range [0, 5000], -5000 <= Node.val <= 5000',
  'First line: n (number of nodes)\nSecond line: n space-separated integers (node values)',
  'n space-separated integers (reversed list)',
  '[{"input": "5\n1 2 3 4 5", "output": "5 4 3 2 1", "explanation": "List is reversed"}]',
  '["Use three pointers: prev, current, next", "Can also be solved recursively", "Be careful with edge cases (empty list, single node)"]',
  '["linked-list", "recursion"]',
  68.4,
  2400,
  1642
),
(
  'Valid Parentheses',
  'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
  'A valid string has: 1) Open brackets must be closed by the same type of brackets, 2) Open brackets must be closed in the correct order, 3) Every close bracket has a corresponding open bracket of the same type.',
  'Stacks',
  'EASY',
  'APPLY',
  'JAVA',
  'Stack-based parentheses validation',
  '1 <= s.length <= 10^4, s consists of parentheses only',
  'Single line: string with parentheses',
  'true or false',
  '[{"input": "()", "output": "true"}, {"input": "(]", "output": "false"}]',
  '["Push opening brackets onto stack", "Pop when matching closing bracket found", "Check if stack is empty at end"]',
  '["string", "stack"]',
  62.1,
  2800,
  1739
),
(
  'Longest Substring Without Repeating Characters',
  'Given a string s, find the length of the longest substring without repeating characters.',
  'Find the length of the longest substring without repeating characters. A substring is a contiguous sequence of characters within a string.',
  'Strings',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Classic sliding window problem',
  '0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols and spaces',
  'Single line: string s',
  'Single integer (length of longest substring)',
  '[{"input": "abcabcbb", "output": "3", "explanation": "The answer is abc with length 3"}, {"input": "bbbbb", "output": "1", "explanation": "The answer is b with length 1"}]',
  '["Use sliding window technique", "Maintain a set of characters in current window", "Track the maximum window size"]',
  '["string", "sliding-window", "hash-table"]',
  35.2,
  3100,
  1091
),
(
  'Binary Tree Level Order Traversal',
  'Given the root of a binary tree, return the level order traversal of its nodes values.',
  'BFS traversal - visit nodes level by level from top to bottom, left to right.',
  'Trees',
  'MEDIUM',
  'APPLY',
  'JAVA',
  'BFS level-order traversal',
  'The number of nodes in the tree is in the range [0, 2000], -1000 <= Node.val <= 1000',
  'First line: n\nSecond line: level order traversal',
  'Each level on a new line',
  '[{"input": "3\n3 9 20 null null 15 7", "output": "[[3],[9,20],[15,7]]"}]',
  '["Use BFS with queue", "Process all nodes at current level before moving to next", "Track level size"]',
  '["tree", "breadth-first-search", "binary-tree"]',
  58.6,
  2200,
  1289
),
(
  'Median of Two Sorted Arrays',
  'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
  'Find the median of two sorted arrays in O(log (m+n)) time.',
  'Arrays',
  'HARD',
  'ANALYZE',
  'JAVA',
  'Binary search on the smaller array to find partition',
  '1 <= nums1.length, nums2.length <= 1000, -10^6 <= nums1[i], nums2[i] <= 10^6',
  'Two lines: nums1 and nums2',
  'Single double (median)',
  '[{"input": "2\n1 3\n1\n2", "output": "2.00000"}]',
  '["Use binary search on smaller array", "Partition both arrays", "Handle edge cases for empty arrays"]',
  '["array", "binary-search", "divide-and-conquer"]',
  32.1,
  1900,
  610
),
(
  'Trapping Rain Water',
  'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
  'Compute trapped rainwater using two-pointer or prefix/suffix arrays.',
  'Arrays',
  'HARD',
  'ANALYZE',
  'JAVA',
  'Two-pointer approach for O(n) time and O(1) space',
  '1 <= n <= 2 * 10^4, 0 <= height[i] <= 10^4',
  'First line: n\nSecond line: n heights',
  'Single integer (trapped water)',
  '[{"input": "12\n0 1 0 2 1 0 1 3 2 1 2 1", "output": "6"}]',
  '["Use two pointers from both ends", "Track left and right max heights", "Water at each position = min(leftMax, rightMax) - height"]',
  '["array", "two-pointers", "dynamic-programming"]',
  48.3,
  1800,
  870
),
(
  'Two Sum (Python)',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'Arrays',
  'EASY',
  'APPLY',
  'PYTHON',
  'Hash map solution in Python',
  '2 <= nums.length <= 10^4',
  'First line: n and target\nSecond line: n integers',
  'Two indices',
  '[{"input": "4 9\n2 7 11 15", "output": "0 1"}]',
  '["Use dict to store value->index", "For each num, check if (target - num) exists", "O(n) time, O(n) space"]',
  '["array", "hash-table"]',
  45.5,
  1250,
  568
),
(
  'Valid Palindrome',
  'Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.',
  'Check if a string is a palindrome considering only alphanumeric characters and ignoring cases.',
  'Strings',
  'EASY',
  'APPLY',
  'PYTHON',
  'Two-pointer approach',
  '1 <= s.length <= 2 * 10^5',
  'Single line: string s',
  'true or false',
  '[{"input": "A man, a plan, a canal: Panama", "output": "true"}]',
  '["Use two pointers from both ends", "Skip non-alphanumeric characters", "Compare case-insensitively"]',
  '["string", "two-pointers"]',
  58.7,
  2200,
  1291
),
(
  'Climbing Stairs',
  'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
  'Count the number of distinct ways to climb n stairs when you can take 1 or 2 steps at a time.',
  'Dynamic Programming',
  'EASY',
  'APPLY',
  'JAVA',
  'Classic Fibonacci-like DP problem',
  '1 <= n <= 45',
  'Single integer n (number of stairs)',
  'Single integer (number of ways)',
  '[{"input": "2", "output": "2", "explanation": "Two ways: 1+1 or 2"}, {"input": "3", "output": "3", "explanation": "Three ways: 1+1+1, 1+2, 2+1"}]',
  '["This is similar to Fibonacci", "ways(n) = ways(n-1) + ways(n-2)", "Can be optimized to O(1) space"]',
  '["dynamic-programming", "math"]',
  52.8,
  2800,
  1478
);

-- ============================================
-- INTERVIEW QUESTIONS (for each interview type)
-- ============================================

-- Technical Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(1, 'Technical', 'Explain the difference between a stack and a queue. When would you use each?', 'EASY',
 '["Stack: LIFO", "Queue: FIFO", "Use cases for stack", "Use cases for queue"]',
 'A stack follows Last In First Out (LIFO) principle where the last element added is the first to be removed. Use cases include function call management, undo operations, and expression evaluation. A queue follows First In First Out (FIFO) principle where the first element added is the first to be removed. Use cases include task scheduling, breadth-first search, and print job management.'),

(1, 'Technical', 'What is the time complexity of binary search? Explain how it works.', 'EASY',
 '["Time complexity: O(log n)", "Divide and conquer", "Sorted array requirement", "Implementation details"]',
 'Binary search has a time complexity of O(log n). It works by repeatedly dividing the search interval in half. Starting with the middle element, if the target value is less than the middle element, the search continues in the lower half; otherwise, it continues in the upper half. This process repeats until the target is found or the interval is empty.'),

(1, 'Technical', 'Explain the concept of Big O notation and why it is important.', 'MEDIUM',
 '["Definition of Big O", "Worst-case analysis", "Common complexities", "Importance in algorithm design"]',
 'Big O notation describes the upper bound of an algorithm\'s time or space complexity as the input size grows. It helps analyze algorithm efficiency and scalability. Common complexities include O(1), O(log n), O(n), O(n log n), and O(n²). Understanding Big O is crucial for choosing the right algorithm and optimizing performance.'),

(1, 'Technical', 'What is the difference between process and thread?', 'MEDIUM',
 '["Process definition", "Thread definition", "Memory space", "Communication overhead"]',
 'A process is an independent execution unit with its own memory space, while a thread is a lightweight execution unit within a process that shares the same memory space. Processes are isolated from each other, making them more secure but heavier. Threads within the same process can communicate easily but need synchronization to avoid race conditions.'),

(1, 'Technical', 'Explain the CAP theorem in distributed systems.', 'HARD',
 '["Consistency", "Availability", "Partition tolerance", "Trade-offs"]',
 'The CAP theorem states that a distributed system can only provide two out of three guarantees: Consistency (all nodes see the same data), Availability (every request receives a response), and Partition tolerance (system continues despite network failures). In practice, partition tolerance is required, so systems must choose between consistency and availability.');

-- HR Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(2, 'HR', 'Tell me about yourself.', 'EASY',
 '["Professional background", "Key achievements", "Career goals", "Relevance to position"]',
 'Focus on your professional journey, highlighting relevant experiences and achievements. Keep it concise (1-2 minutes), connect your background to the position you are applying for, and mention your career goals that align with the company.'),

(2, 'HR', 'What are your greatest strengths and weaknesses?', 'EASY',
 '["Relevant strengths", "Self-awareness", "Improvement plan", "Honesty"]',
 'For strengths, mention 2-3 relevant skills with specific examples. For weaknesses, be honest but show self-awareness and describe concrete steps you are taking to improve. Avoid clichés like "I am a perfectionist."'),

(2, 'HR', 'Describe a challenging situation and how you handled it.', 'MEDIUM',
 '["STAR method", "Problem description", "Actions taken", "Results achieved"]',
 'Use the STAR method (Situation, Task, Action, Result) to structure your answer. Describe a specific challenging situation, explain your role, detail the actions you took, and highlight the positive outcome or lessons learned.'),

(2, 'HR', 'Why do you want to work for this company?', 'MEDIUM',
 '["Company research", "Cultural fit", "Value alignment", "Career growth"]',
 'Demonstrate that you have researched the company. Mention specific aspects that attract you (culture, products, mission, growth opportunities). Explain how your skills and goals align with what the company offers.'),

(2, 'HR', 'Where do you see yourself in 5 years?', 'MEDIUM',
 '["Career growth", "Skill development", "Company alignment", "Realistic goals"]',
 'Show ambition while being realistic. Mention how you want to grow professionally, develop new skills, and contribute to the company. Align your goals with potential career paths within the organization.');

-- Java Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(4, 'Java', 'What is the difference between an interface and an abstract class in Java?', 'EASY',
 '["Interface definition", "Abstract class definition", "Multiple inheritance", "When to use each"]',
 'An interface defines a contract with only abstract methods (Java 8+ allows default and static methods), while an abstract class can have both abstract and concrete methods. A class can implement multiple interfaces but extend only one abstract class. Use interfaces for defining capabilities and abstract classes for sharing code among related classes.'),

(4, 'Java', 'Explain the concept of multithreading in Java.', 'MEDIUM',
 '["Thread creation", "Thread lifecycle", "Synchronization", "Concurrency issues"]',
 'Multithreading allows concurrent execution of multiple threads. Threads can be created by extending Thread class or implementing Runnable interface. Key concepts include thread lifecycle (new, runnable, blocked, waiting, terminated), synchronization for thread safety, and handling concurrency issues like race conditions and deadlocks.'),

(4, 'Java', 'What is the Spring Framework? Explain its core features.', 'MEDIUM',
 '["IoC container", "Dependency injection", "AOP", "Modules"]',
 'Spring is a comprehensive framework for enterprise Java applications. Core features include Inversion of Control (IoC) container for managing object lifecycle, Dependency Injection for loose coupling, Aspect-Oriented Programming (AOP) for cross-cutting concerns, and various modules for data access, web applications, security, etc.'),

(4, 'Java', 'Explain the differences between HashMap and ConcurrentHashMap.', 'HARD',
 '["Thread safety", "Performance", "Null values", "Locking mechanism"]',
 'HashMap is not thread-safe and allows one null key and multiple null values, while ConcurrentHashMap is thread-safe and does not allow null keys/values. ConcurrentHashMap uses lock striping (segment-level locking) for better performance in concurrent environments compared to Hashtable which uses method-level synchronization.');

-- SQL Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(5, 'SQL', 'What is the difference between INNER JOIN and LEFT JOIN?', 'EASY',
 '["INNER JOIN definition", "LEFT JOIN definition", "Result set differences", "Use cases"]',
 'INNER JOIN returns only matching rows from both tables, while LEFT JOIN returns all rows from the left table and matching rows from the right table (with NULLs for non-matching rows). Use INNER JOIN when you need only matching records, and LEFT JOIN when you want all records from the primary table regardless of matches.'),

(5, 'SQL', 'Explain the concept of database indexing and its benefits.', 'MEDIUM',
 '["Index definition", "Types of indexes", "Performance benefits", "Trade-offs"]',
 'An index is a data structure that improves query performance by allowing faster data retrieval. Common types include B-tree, hash, and composite indexes. Benefits include faster SELECT queries and efficient WHERE clause filtering. Trade-offs include slower INSERT/UPDATE/DELETE operations and additional storage space.'),

(5, 'SQL', 'What are ACID properties in database transactions?', 'MEDIUM',
 '["Atomicity", "Consistency", "Isolation", "Durability"]',
 'ACID properties ensure reliable database transactions: Atomicity (all operations complete or none), Consistency (database remains in valid state), Isolation (concurrent transactions don\'t interfere), and Durability (committed transactions persist even after system failures).');

-- OOP Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(6, 'OOP', 'What are the four main principles of OOP?', 'EASY',
 '["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"]',
 'The four main principles are: Encapsulation (bundling data and methods, restricting access), Abstraction (hiding complexity, showing only essentials), Inheritance (creating new classes from existing ones), and Polymorphism (objects taking multiple forms). These principles promote code reusability, maintainability, and flexibility.'),

(6, 'OOP', 'Explain the concept of polymorphism with examples.', 'MEDIUM',
 '["Compile-time polymorphism", "Runtime polymorphism", "Method overloading", "Method overriding"]',
 'Polymorphism allows objects to take multiple forms. Compile-time polymorphism (method overloading) occurs when multiple methods have the same name but different parameters. Runtime polymorphism (method overriding) occurs when a subclass provides a specific implementation of a method defined in its parent class.');

-- DBMS Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(7, 'DBMS', 'What is a transaction in a database?', 'EASY',
 '["Transaction definition", "ACID properties", "Transaction states", "Examples"]',
 'A transaction is a sequence of database operations treated as a single logical unit. It must satisfy ACID properties: Atomicity, Consistency, Isolation, and Durability. Transactions go through states: active, partially committed, committed, failed, and aborted. Examples include bank transfers and order processing.'),

(7, 'DBMS', 'Explain the difference between clustered and non-clustered indexes.', 'MEDIUM',
 '["Clustered index", "Non-clustered index", "Physical storage", "Performance"]',
 'A clustered index determines the physical order of data in a table. There can be only one clustered index per table. A non-clustered index maintains a separate structure from the data, with pointers to the actual rows. A table can have multiple non-clustered indexes. Clustered indexes are faster for range queries, while non-clustered indexes are better for selective queries.');

-- OS Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(8, 'OS', 'What is a process? Explain process states.', 'EASY',
 '["Process definition", "Process control block", "Process states", "State transitions"]',
 'A process is a program in execution. It has a Process Control Block (PCB) containing process state, program counter, registers, memory management info, and I/O status. Process states include: New, Ready, Running, Waiting/Blocked, and Terminated. State transitions occur based on events like scheduling, I/O completion, or termination.'),

(8, 'OS', 'Explain the difference between process and thread.', 'MEDIUM',
 '["Process characteristics", "Thread characteristics", "Memory sharing", "Communication"]',
 'A process is an independent execution unit with its own memory space, while a thread is a lightweight execution unit within a process that shares memory with other threads. Processes are isolated and secure but heavier. Threads are lightweight and can communicate easily but require synchronization. Context switching is faster for threads.');

-- Computer Networks Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(9, 'Networks', 'What is the OSI model? List all layers.', 'EASY',
 '["OSI model definition", "7 layers", "Layer functions", "Encapsulation"]',
 'The OSI model is a conceptual framework with 7 layers: Physical (transmission of raw bits), Data Link (reliable node-to-node transfer), Network (routing and forwarding), Transport (end-to-end communication), Session (managing sessions), Presentation (data format/encryption), and Application (user interface). Each layer provides services to the layer above and uses services from the layer below.'),

(9, 'Networks', 'Explain the difference between TCP and UDP.', 'MEDIUM',
 '["TCP characteristics", "UDP characteristics", "Connection-oriented vs connectionless", "Use cases"]',
 'TCP is connection-oriented, reliable, ensures ordered delivery, and has flow control. It uses three-way handshake and acknowledgments. UDP is connectionless, unreliable, and has no ordering guarantee. Use TCP for applications requiring reliability (HTTP, FTP, email) and UDP for real-time applications (video streaming, gaming, DNS).');

-- Case Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(10, 'Case Study', 'A retail company wants to expand online. How would you approach this?', 'MEDIUM',
 '["Problem structuring", "Market analysis", "Technical requirements", "Implementation strategy"]',
 'I would approach this systematically: 1) Analyze current business model and goals, 2) Research market and competitors, 3) Define technical requirements (platform, payment, inventory), 4) Create implementation roadmap with phases, 5) Consider scalability and security, 6) Plan marketing and customer acquisition strategy, 7) Define success metrics and KPIs.'),

(10, 'Case Study', 'Design a URL shortening service like bit.ly', 'HARD',
 '["System design", "Scalability", "Database design", "API design"]',
 'Key components: 1) API for creating short URLs, 2) Database to store mappings (original URL, short code, expiry), 3) Redirect service to handle short URL requests, 4) Analytics service for tracking clicks. Use hash-based or counter-based short code generation. Consider caching (Redis), load balancing, and database sharding for scalability.');

-- Resume-Based Interview Questions
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(11, 'Resume', 'Walk me through your resume.', 'EASY',
 '["Resume structure", "Key experiences", "Achievements", "Career progression"]',
 'Provide a chronological walkthrough of your resume, highlighting key experiences, skills, and achievements. Focus on roles and projects most relevant to the position. Explain your career progression and what you learned from each experience. Be prepared to dive deeper into any project or role mentioned.'),

(11, 'Resume', 'Tell me about a challenging project you worked on.', 'MEDIUM',
 '["Project context", "Challenges faced", "Solutions implemented", "Results achieved"]',
 'Choose a relevant project and describe: 1) The project goal and your role, 2) Specific challenges encountered (technical, team, timeline), 3) How you addressed these challenges, 4) The outcome and impact. Use specific metrics to quantify success. Demonstrate problem-solving skills and learning from challenges.');

-- Success message
SELECT 'Data initialization complete!' AS message;
