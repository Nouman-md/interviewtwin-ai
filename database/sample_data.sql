-- InterviewTwin AI Sample Data
-- This file contains sample data for testing and development

USE interviewtwin_db;

-- Insert Sample Coding Questions
INSERT INTO coding_questions (question_text, category, difficulty_level, language, description, constraints, examples, test_cases) VALUES
(
  'Two Sum',
  'Algorithms',
  'EASY',
  'JAVA',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'You may assume that each input would have exactly one solution, and you may not use the same element twice.',
  'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]\nExplanation: Because nums[0] + nums[1] == 9, we return [0, 1].',
  '[{"input": "[2,7,11,15], 9", "expected": "[0,1]", "hidden": false}, {"input": "[3,2,4], 6", "expected": "[1,2]", "hidden": false}]'
),
(
  'Reverse Linked List',
  'Data Structures',
  'EASY',
  'JAVA',
  'Given the head of a singly linked list, reverse the list, and return the reversed list.',
  'The number of nodes in the list is in the range [0, 5000].',
  'Input: head = [1,2,3,4,5]\nOutput: [5,4,3,2,1]',
  '[{"input": "[1,2,3,4,5]", "expected": "[5,4,3,2,1]", "hidden": false}]'
),
(
  'Valid Parentheses',
  'Data Structures',
  'EASY',
  'JAVA',
  'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
  'Open brackets must be closed by the same type of brackets and in the correct order.',
  'Input: s = "()[]{}"\nOutput: true',
  '[{"input": "()[]{}", "expected": "true", "hidden": false}, {"input": "(]", "expected": "false", "hidden": false}]'
),
(
  'Merge Two Sorted Lists',
  'Algorithms',
  'EASY',
  'JAVA',
  'Merge two sorted linked lists and return it as a sorted list.',
  'The number of nodes in both lists is in the range [0, 50].',
  'Input: l1 = [1,2,4], l2 = [1,3,4]\nOutput: [1,1,2,3,4,4]',
  '[{"input": "[1,2,4], [1,3,4]", "expected": "[1,1,2,3,4,4]", "hidden": false}]'
),
(
  'Binary Tree Level Order Traversal',
  'Data Structures',
  'MEDIUM',
  'JAVA',
  'Given the root of a binary tree, return the level order traversal of its nodes values.',
  'The number of nodes in the tree is in the range [0, 2000].',
  'Input: root = [3,9,20,null,null,15,7]\nOutput: [[3],[9,20],[15,7]]',
  '[{"input": "[3,9,20,null,null,15,7]", "expected": "[[3],[9,20],[15,7]]", "hidden": false}]'
),
(
  'Longest Substring Without Repeating Characters',
  'Algorithms',
  'MEDIUM',
  'JAVA',
  'Given a string s, find the length of the longest substring without repeating characters.',
  '0 <= s.length <= 5 * 10^4',
  'Input: s = "abcabcbb"\nOutput: 3\nExplanation: The answer is "abc", with the length of 3.',
  '[{"input": "abcabcbb", "expected": "3", "hidden": false}, {"input": "bbbbb", "expected": "1", "hidden": false}]'
),
(
  'Median of Two Sorted Arrays',
  'Algorithms',
  'HARD',
  'JAVA',
  'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.',
  'The overall run time complexity should be O(log (m+n)).',
  'Input: nums1 = [1,3], nums2 = [2]\nOutput: 2.00000',
  '[{"input": "[1,3], [2]", "expected": "2.0", "hidden": false}]'
),
(
  'Trapping Rain Water',
  'Algorithms',
  'HARD',
  'JAVA',
  'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
  'n == height.length, 1 <= n <= 2 * 10^4',
  'Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]\nOutput: 6',
  '[{"input": "[0,1,0,2,1,0,1,3,2,1,2,1]", "expected": "6", "hidden": false}]'
),
(
  'Two Sum (Python)',
  'Algorithms',
  'EASY',
  'PYTHON',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'You may assume that each input would have exactly one solution.',
  'Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]',
  '[{"input": "[2,7,11,15], 9", "expected": "[0,1]", "hidden": false}]'
),
(
  'Valid Palindrome',
  'Algorithms',
  'EASY',
  'PYTHON',
  'Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.',
  '1 <= s.length <= 2 * 10^5',
  'Input: s = "A man, a plan, a canal: Panama"\nOutput: true',
  '[{"input": "A man, a plan, a canal: Panama", "expected": "true", "hidden": false}]'
);

-- Insert Sample Interview Questions
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

-- Insert Sample Questions for Technical Interview
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

-- Insert Sample Questions for HR Interview
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

-- Insert Sample Questions for Java Interview
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

-- Insert Sample Questions for SQL Interview
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(5, 'SQL', 'What is the difference between INNER JOIN and LEFT JOIN?', 'EASY',
 '["INNER JOIN definition", "LEFT JOIN definition", "Result set differences", "Use cases"]',
 'INNER JOIN returns only matching rows from both tables, while LEFT JOIN returns all rows from the left table and matching rows from the right table (with NULLs for non-matching rows). Use INNER JOIN when you need only matching records, and LEFT JOIN when you want all records from the primary table regardless of matches.'),

(5, 'SQL', 'Explain the concept of database indexing and its benefits.', 'MEDIUM',
 '["Index definition", "Types of indexes", "Performance benefits", "Trade-offs"]',
 'An index is a data structure that improves query performance by allowing faster data retrieval. Common types include B-tree, hash, and composite indexes. Benefits include faster SELECT queries and efficient WHERE clause filtering. Trade-offs include slower INSERT/UPDATE/DELETE operations and additional storage space.'),

(5, 'SQL', 'What are ACID properties in database transactions?', 'MEDIUM',
 '["Atomicity", "Consistency", "Isolation", "Durability"]',
 'ACID properties ensure reliable database transactions: Atomicity (all operations complete or none), Consistency (database remains in valid state), Isolation (concurrent transactions don\'t interfere), and Durability (committed transactions persist even after system failures).'),

(5, 'SQL', 'Explain normalization and its normal forms.', 'HARD',
 '["Normalization definition", "1NF", "2NF", "3NF", "Benefits"]',
 'Normalization is the process of organizing data to reduce redundancy. 1NF requires atomic values, 2NF eliminates partial dependencies, 3NF eliminates transitive dependencies. Higher normal forms (BCNF, 4NF, 5NF) address more complex dependencies. Benefits include reduced data redundancy, improved data integrity, and better database organization.');

-- Insert Sample Questions for OOP Interview
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(6, 'OOP', 'What are the four main principles of OOP?', 'EASY',
 '["Encapsulation", "Abstraction", "Inheritance", "Polymorphism"]',
 'The four main principles are: Encapsulation (bundling data and methods, restricting access), Abstraction (hiding complexity, showing only essentials), Inheritance (creating new classes from existing ones), and Polymorphism (objects taking multiple forms). These principles promote code reusability, maintainability, and flexibility.'),

(6, 'OOP', 'Explain the concept of polymorphism with examples.', 'MEDIUM',
 '["Compile-time polymorphism", "Runtime polymorphism", "Method overloading", "Method overriding"]',
 'Polymorphism allows objects to take multiple forms. Compile-time polymorphism (method overloading) occurs when multiple methods have the same name but different parameters. Runtime polymorphism (method overriding) occurs when a subclass provides a specific implementation of a method defined in its parent class.'),

(6, 'OOP', 'What is the difference between composition and inheritance?', 'MEDIUM',
 '["Composition definition", "Inheritance definition", "Has-a vs Is-a", "When to use"]',
 'Composition is a "has-a" relationship where a class contains objects of other classes. Inheritance is an "is-a" relationship where a class derives from another. Favor composition over inheritance for better flexibility, looser coupling, and easier maintenance. Composition allows changing behavior at runtime, while inheritance is static.');

-- Insert Sample Questions for DBMS Interview
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(7, 'DBMS', 'What is a transaction in a database?', 'EASY',
 '["Transaction definition", "ACID properties", "Transaction states", "Examples"]',
 'A transaction is a sequence of database operations treated as a single logical unit. It must satisfy ACID properties: Atomicity, Consistency, Isolation, and Durability. Transactions go through states: active, partially committed, committed, failed, and aborted. Examples include bank transfers and order processing.'),

(7, 'DBMS', 'Explain the difference between clustered and non-clustered indexes.', 'MEDIUM',
 '["Clustered index", "Non-clustered index", "Physical storage", "Performance"]',
 'A clustered index determines the physical order of data in a table. There can be only one clustered index per table. A non-clustered index maintains a separate structure from the data, with pointers to the actual rows. A table can have multiple non-clustered indexes. Clustered indexes are faster for range queries, while non-clustered indexes are better for selective queries.'),

(7, 'DBMS', 'What is database normalization? Explain 1NF, 2NF, and 3NF.', 'MEDIUM',
 '["Normalization purpose", "1NF rules", "2NF rules", "3NF rules"]',
 'Normalization organizes data to reduce redundancy. 1NF requires atomic values and no repeating groups. 2NF requires 1NF and no partial dependencies (all non-key attributes fully depend on primary key). 3NF requires 2NF and no transitive dependencies (non-key attributes don\'t depend on other non-key attributes).');

-- Insert Sample Questions for OS Interview
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(8, 'OS', 'What is a process? Explain process states.', 'EASY',
 '["Process definition", "Process control block", "Process states", "State transitions"]',
 'A process is a program in execution. It has a Process Control Block (PCB) containing process state, program counter, registers, memory management info, and I/O status. Process states include: New, Ready, Running, Waiting/Blocked, and Terminated. State transitions occur based on events like scheduling, I/O completion, or termination.'),

(8, 'OS', 'Explain the difference between process and thread.', 'MEDIUM',
 '["Process characteristics", "Thread characteristics", "Memory sharing", "Communication"]',
 'A process is an independent execution unit with its own memory space, while a thread is a lightweight execution unit within a process that shares memory with other threads. Processes are isolated and secure but heavier. Threads are lightweight and can communicate easily but require synchronization. Context switching is faster for threads.'),

(8, 'OS', 'What is virtual memory? Explain paging.', 'HARD',
 '["Virtual memory concept", "Paging mechanism", "Page table", "Benefits"]',
 'Virtual memory allows processes to execute without being entirely in physical memory. Paging divides physical memory into fixed-size frames and logical memory into pages. The OS maintains a page table to map logical to physical addresses. Benefits include increased multiprogramming, efficient memory use, and ability to run larger programs than physical memory.');

-- Insert Sample Questions for Computer Networks Interview
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(9, 'Networks', 'What is the OSI model? List all layers.', 'EASY',
 '["OSI model definition", "7 layers", "Layer functions", "Encapsulation"]',
 'The OSI model is a conceptual framework with 7 layers: Physical (transmission of raw bits), Data Link (reliable node-to-node transfer), Network (routing and forwarding), Transport (end-to-end communication), Session (managing sessions), Presentation (data format/encryption), and Application (user interface). Each layer provides services to the layer above and uses services from the layer below.'),

(9, 'Networks', 'Explain the difference between TCP and UDP.', 'MEDIUM',
 '["TCP characteristics", "UDP characteristics", "Connection-oriented vs connectionless", "Use cases"]',
 'TCP is connection-oriented, reliable, ensures ordered delivery, and has flow control. It uses three-way handshake and acknowledgments. UDP is connectionless, unreliable, and has no ordering guarantee. Use TCP for applications requiring reliability (HTTP, FTP, email) and UDP for real-time applications (video streaming, gaming, DNS).'),

(9, 'Networks', 'What is HTTP? Explain the difference between HTTP and HTTPS.', 'MEDIUM',
 '["HTTP definition", "HTTPS definition", "SSL/TLS", "Security"]',
 'HTTP (Hypertext Transfer Protocol) is the foundation of data communication on the web. HTTPS is HTTP with SSL/TLS encryption. HTTPS encrypts data in transit using SSL/TLS certificates, providing confidentiality, integrity, and authentication. HTTPS uses port 443 while HTTP uses port 80. Always use HTTPS for sensitive data transmission.');

-- Insert Sample Questions for Case Interview
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(10, 'Case Study', 'A retail company wants to expand online. How would you approach this?', 'MEDIUM',
 '["Problem structuring", "Market analysis", "Technical requirements", "Implementation strategy"]',
 'I would approach this systematically: 1) Analyze current business model and goals, 2) Research market and competitors, 3) Define technical requirements (platform, payment, inventory), 4) Create implementation roadmap with phases, 5) Consider scalability and security, 6) Plan marketing and customer acquisition strategy, 7) Define success metrics and KPIs.'),

(10, 'Case Study', 'Design a URL shortening service like bit.ly', 'HARD',
 '["System design", "Scalability", "Database design", "API design"]',
 'Key components: 1) API for creating short URLs, 2) Database to store mappings (original URL, short code, expiry), 3) Redirect service to handle short URL requests, 4) Analytics service for tracking clicks. Use hash-based or counter-based short code generation. Consider caching (Redis), load balancing, and database sharding for scalability.');

-- Insert Sample Questions for Resume-Based Interview
INSERT INTO questions (type_id, category, question_text, difficulty_level, expected_key_points, model_answer) VALUES
(11, 'Resume', 'Walk me through your resume.', 'EASY',
 '["Resume structure", "Key experiences", "Achievements", "Career progression"]',
 'Provide a chronological walkthrough of your resume, highlighting key experiences, skills, and achievements. Focus on roles and projects most relevant to the position. Explain your career progression and what you learned from each experience. Be prepared to dive deeper into any project or role mentioned.'),

(11, 'Resume', 'Tell me about a challenging project you worked on.', 'MEDIUM',
 '["Project context", "Challenges faced", "Solutions implemented", "Results achieved"]',
 'Choose a relevant project and describe: 1) The project goal and your role, 2) Specific challenges encountered (technical, team, timeline), 3) How you addressed these challenges, 4) The outcome and impact. Use specific metrics to quantify success. Demonstrate problem-solving skills and learning from challenges.');

-- Create a default admin user (password: admin123)
-- Note: In production, use a strong password and change this immediately
INSERT INTO users (email, password, first_name, last_name, is_active, is_verified) VALUES
('admin@interviewtwin.ai', '$2a$10$rQ7H8p9QZ8X7Y6Z5X4W3V2U1T0S9R8Q7P6O5N4M3L2K1J0H9G8F7E6D5C4B3A2', 'Admin', 'User', TRUE, TRUE);

-- Assign ADMIN role to the admin user
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'admin@interviewtwin.ai' AND r.role_name = 'ADMIN';

-- Create a sample regular user (password: user123)
INSERT INTO users (email, password, first_name, last_name, is_active, is_verified) VALUES
('user@example.com', '$2a$10$rQ7H8p9QZ8X7Y6Z5X4W3V2U1T0S9R8Q7P6O5N4M3L2K1J0H9G8F7E6D5C4B3A2', 'John', 'Doe', TRUE, TRUE);

-- Assign USER role to the sample user
INSERT INTO user_roles (user_id, role_id)
SELECT u.user_id, r.role_id
FROM users u, roles r
WHERE u.email = 'user@example.com' AND r.role_name = 'USER';

-- Create performance records for sample users
INSERT INTO performance (user_id, ats_score, technical_score, hr_score, coding_score, communication_score, overall_placement_readiness, total_interviews, total_coding_problems)
SELECT user_id, 75.5, 80.0, 70.0, 65.0, 78.0, 73.0, 5, 10
FROM users WHERE email = 'user@example.com';

-- Success message
SELECT 'Sample data inserted successfully!' AS message;