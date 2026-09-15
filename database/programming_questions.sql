-- Programming Problems for InterviewTwin AI
-- Java/HackerRank-style programming questions

USE interviewtwin_db;

-- JAVA BASICS
INSERT INTO coding_questions (title, question_text, problem_statement, question_type, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags) VALUES
('Hello World', 'Write a program to print "Hello, World!"', 'Write a Java program that prints the text "Hello, World!" to the console.\n\nThis is the classic first program that every programmer writes.\n\nInput: None\nOutput: Hello, World!', 'PROGRAMMING', 'Java Basics', 'EASY', 'REMEMBER', 'JAVA', 'Learn to write your first Java program', 'No input required', 'No input format', 'Hello, World!', 'System.out.println("Hello, World!");', 'Use System.out.println() to print text', '["beginner", "basics", "output"]'),

('Sum of Two Numbers', 'Write a program to add two numbers', 'Write a Java program that takes two integers as input and prints their sum.\n\nInput: Two integers a and b\nOutput: Sum of a and b', 'PROGRAMMING', 'Java Basics', 'EASY', 'APPLY', 'JAVA', 'Learn to take input and perform addition', 'Input numbers can be positive or negative', 'Two space-separated integers', 'Single integer representing the sum', 'Input: 5 3\nOutput: 8', 'Use Scanner class for input', '["beginner", "input", "arithmetic"]'),

('Variable Swap', 'Swap two numbers without using a third variable', 'Write a Java program to swap two numbers without using a temporary variable.\n\nInput: Two integers a and b\nOutput: Swapped values of a and b', 'PROGRAMMING', 'Java Basics', 'EASY', 'ANALYZE', 'JAVA', 'Learn arithmetic operations for swapping', 'Use arithmetic or bitwise operations', 'Two space-separated integers', 'Two integers in swapped order', 'Input: 5 10\nOutput: 10 5', 'Use a = a + b; b = a - b; a = a - b;', '["variables", "arithmetic", "swap"]'),

-- CONDITIONALS
('Even or Odd', 'Check if a number is even or odd', 'Write a Java program to check whether a given number is even or odd.\n\nInput: An integer n\nOutput: "Even" if n is even, "Odd" if n is odd', 'PROGRAMMING', 'Conditionals', 'EASY', 'APPLY', 'JAVA', 'Learn to use if-else statements', 'Number can be positive, negative, or zero', 'Single integer', 'String: "Even" or "Odd"', 'Input: 7\nOutput: Odd', 'Use modulo operator (%) to check divisibility by 2', '["if-else", "modulo", "conditions"]'),

('Largest of Three Numbers', 'Find the largest among three numbers', 'Write a Java program to find the largest among three given numbers.\n\nInput: Three integers a, b, c\nOutput: The largest number', 'PROGRAMMING', 'Conditionals', 'EASY', 'ANALYZE', 'JAVA', 'Learn nested if-else or logical operators', 'Numbers can be equal', 'Three space-separated integers', 'Single integer (largest value)', 'Input: 10 20 15\nOutput: 20', 'Use if-else if-else or Math.max()', '["comparison", "maximum", "conditions"]'),

('Leap Year Checker', 'Check if a year is a leap year', 'Write a Java program to check whether a given year is a leap year.\n\nA year is a leap year if:\n- It is divisible by 4 AND not divisible by 100, OR\n- It is divisible by 400\n\nInput: An integer year\nOutput: "Leap Year" or "Not a Leap Year"', 'PROGRAMMING', 'Conditionals', 'EASY', 'EVALUATE', 'JAVA', 'Learn complex conditional logic', 'Year should be positive', 'Single integer (year)', 'String: "Leap Year" or "Not a Leap Year"', 'Input: 2024\nOutput: Leap Year', 'Use logical operators (&&, ||)', '["leap-year", "logical-operators", "conditions"]'),

('Grade Calculator', 'Calculate grade based on marks', 'Write a Java program to calculate the grade of a student based on their marks.\n\nGrading system:\n- 90-100: A\n- 80-89: B\n- 70-79: C\n- 60-69: D\n- Below 60: F\n\nInput: Integer marks (0-100)\nOutput: Grade (A/B/C/D/F)', 'PROGRAMMING', 'Conditionals', 'EASY', 'CREATE', 'JAVA', 'Learn multiple condition checking', 'Marks should be between 0 and 100', 'Single integer (marks)', 'Single character (grade)', 'Input: 85\nOutput: B', 'Use if-else if-else ladder', '["grading", "marks", "conditions"]'),

-- LOOPS
('Factorial Calculator', 'Calculate factorial of a number', 'Write a Java program to calculate the factorial of a given number.\n\nFactorial of n (n!) = n × (n-1) × (n-2) × ... × 1\n\nInput: An integer n\nOutput: Factorial of n', 'PROGRAMMING', 'Loops', 'EASY', 'APPLY', 'JAVA', 'Learn iterative and recursive approaches', 'n should be non-negative', 'Single integer', 'Integer (factorial value)', 'Input: 5\nOutput: 120', 'Use for loop or recursion', '["factorial", "loops", "recursion"]'),

('Fibonacci Series', 'Generate Fibonacci series up to n terms', 'Write a Java program to generate the Fibonacci series up to n terms.\n\nFibonacci series: 0, 1, 1, 2, 3, 5, 8, 13, ...\n\nInput: Integer n (number of terms)\nOutput: First n terms of Fibonacci series', 'PROGRAMMING', 'Loops', 'EASY', 'REMEMBER', 'JAVA', 'Learn sequence generation', 'n should be positive', 'Single integer', 'Space-separated Fibonacci numbers', 'Input: 8\nOutput: 0 1 1 2 3 5 8 13', 'Use loop to generate series', '["fibonacci", "sequence", "loops"]'),

('Prime Number Checker', 'Check if a number is prime', 'Write a Java program to check whether a given number is prime.\n\nA prime number is divisible only by 1 and itself.\n\nInput: An integer n\nOutput: "Prime" or "Not Prime"', 'PROGRAMMING', 'Loops', 'EASY', 'ANALYZE', 'JAVA', 'Learn prime number logic', 'n should be positive', 'Single integer', 'String: "Prime" or "Not Prime"', 'Input: 17\nOutput: Prime', 'Check divisibility from 2 to n/2', '["prime", "loops", "mathematics"]'),

('Palindrome Number', 'Check if a number is palindrome', 'Write a Java program to check if a given number is a palindrome.\n\nA palindrome number reads the same forwards and backwards.\n\nInput: An integer n\nOutput: "Palindrome" or "Not Palindrome"', 'PROGRAMMING', 'Loops', 'EASY', 'ANALYZE', 'JAVA', 'Learn number reversal', 'Number can be negative', 'Single integer', 'String: "Palindrome" or "Not Palindrome"', 'Input: 121\nOutput: Palindrome', 'Reverse the number and compare', '["palindrome", "reverse", "loops"]'),

('Reverse a Number', 'Reverse the digits of a number', 'Write a Java program to reverse the digits of a given number.\n\nInput: An integer n\nOutput: Reversed number', 'PROGRAMMING', 'Loops', 'EASY', 'APPLY', 'JAVA', 'Learn digit extraction', 'Handle negative numbers', 'Single integer', 'Integer (reversed number)', 'Input: 12345\nOutput: 54321', 'Use modulo and division operators', '["reverse", "digits", "loops"]'),

('Sum of Digits', 'Calculate sum of digits of a number', 'Write a Java program to calculate the sum of digits of a given number.\n\nInput: An integer n\nOutput: Sum of digits', 'PROGRAMMING', 'Loops', 'EASY', 'APPLY', 'JAVA', 'Learn digit manipulation', 'Number can be large', 'Single integer', 'Integer (sum of digits)', 'Input: 12345\nOutput: 15', 'Use modulo 10 to extract digits', '["sum", "digits", "loops"]'),

-- STRINGS
('Reverse a String', 'Reverse a given string', 'Write a Java program to reverse a given string.\n\nInput: A string s\nOutput: Reversed string', 'PROGRAMMING', 'Strings', 'EASY', 'REMEMBER', 'JAVA', 'Learn string manipulation', 'String can contain spaces', 'Single line string', 'Reversed string', 'Input: Hello World\nOutput: dlroW olleH', 'Use StringBuilder.reverse() or loop', '["string", "reverse", "manipulation"]'),

('Check Palindrome String', 'Check if a string is palindrome', 'Write a Java program to check if a given string is a palindrome.\n\nInput: A string s\nOutput: "Palindrome" or "Not Palindrome"', 'PROGRAMMING', 'Strings', 'EASY', 'ANALYZE', 'JAVA', 'Learn string comparison', 'Ignore case and spaces', 'Single line string', 'String: "Palindrome" or "Not Palindrome"', 'Input: madam\nOutput: Palindrome', 'Compare characters from both ends', '["palindrome", "string", "comparison"]'),

('Count Vowels', 'Count vowels in a string', 'Write a Java program to count the number of vowels in a given string.\n\nVowels: a, e, i, o, u (both uppercase and lowercase)\n\nInput: A string s\nOutput: Count of vowels', 'PROGRAMMING', 'Strings', 'EASY', 'APPLY', 'JAVA', 'Learn character counting', 'String can be empty', 'Single line string', 'Integer (vowel count)', 'Input: Hello World\nOutput: 3', 'Convert to lowercase and check each character', '["vowels", "counting", "string"]'),

('Remove Duplicates', 'Remove duplicate characters from a string', 'Write a Java program to remove duplicate characters from a given string.\n\nInput: A string s\nOutput: String with unique characters', 'PROGRAMMING', 'Strings', 'MEDIUM', 'ANALYZE', 'JAVA', 'Learn character frequency', 'Preserve order of first occurrence', 'Single line string', 'String with unique characters', 'Input: programming\nOutput: progamin', 'Use Set or frequency array', '["duplicates", "unique", "string"]'),

('Anagram Checker', 'Check if two strings are anagrams', 'Write a Java program to check if two strings are anagrams of each other.\n\nTwo strings are anagrams if they contain the same characters with the same frequency.\n\nInput: Two strings s1 and s2\nOutput: "Anagram" or "Not Anagram"', 'PROGRAMMING', 'Strings', 'MEDIUM', 'EVALUATE', 'JAVA', 'Learn character frequency comparison', 'Ignore case', 'Two space-separated strings', 'String: "Anagram" or "Not Anagram"', 'Input: listen silent\nOutput: Anagram', 'Sort both strings and compare', '["anagram", "sorting", "string"]'),

-- ARRAYS
('Largest Element', 'Find the largest element in an array', 'Write a Java program to find the largest element in an array.\n\nInput: Size n followed by n integers\nOutput: Largest element', 'PROGRAMMING', 'Arrays', 'EASY', 'REMEMBER', 'JAVA', 'Learn array traversal', 'Array can have negative numbers', 'First line: n (size)\nSecond line: n space-separated integers', 'Single integer (largest element)', 'Input: 5\n3 1 4 1 5\nOutput: 5', 'Initialize max with first element', '["array", "maximum", "traversal"]'),

('Second Largest Element', 'Find the second largest element', 'Write a Java program to find the second largest element in an array.\n\nInput: Size n followed by n integers\nOutput: Second largest element', 'PROGRAMMING', 'Arrays', 'EASY', 'ANALYZE', 'JAVA', 'Learn to track multiple maximums', 'Handle duplicates', 'First line: n\nSecond line: n integers', 'Single integer (second largest)', 'Input: 5\n3 1 4 1 5\nOutput: 4', 'Track both largest and second largest', '["array", "second-largest", "sorting"]'),

('Reverse an Array', 'Reverse the elements of an array', 'Write a Java program to reverse the elements of an array.\n\nInput: Size n followed by n integers\nOutput: Reversed array', 'PROGRAMMING', 'Arrays', 'EASY', 'APPLY', 'JAVA', 'Learn two-pointer technique', 'In-place reversal preferred', 'First line: n\nSecond line: n integers', 'Space-separated integers (reversed)', 'Input: 5\n1 2 3 4 5\nOutput: 5 4 3 2 1', 'Swap elements from both ends', '["array", "reverse", "two-pointer"]'),

('Find Duplicates', 'Find duplicate elements in an array', 'Write a Java program to find all duplicate elements in an array.\n\nInput: Size n followed by n integers\nOutput: List of duplicate elements', 'PROGRAMMING', 'Arrays', 'MEDIUM', 'ANALYZE', 'JAVA', 'Learn frequency counting', 'Print duplicates in sorted order', 'First line: n\nSecond line: n integers', 'Space-separated duplicate elements', 'Input: 6\n1 2 3 2 4 1\nOutput: 1 2', 'Use HashMap or frequency array', '["duplicates", "frequency", "array"]'),

('Missing Number', 'Find the missing number in array 1 to n', 'Write a Java program to find the missing number from an array containing numbers 1 to n.\n\nInput: Size n-1 followed by n-1 distinct integers from 1 to n\nOutput: Missing number', 'PROGRAMMING', 'Arrays', 'EASY', 'APPLY', 'JAVA', 'Learn mathematical approach', 'One number is missing', 'First line: n\nSecond line: n-1 integers', 'Single integer (missing number)', 'Input: 5\n1 2 4 5\nOutput: 3', 'Use sum formula: n*(n+1)/2', '["missing-number", "mathematics", "array"]'),

-- SORTING
('Bubble Sort', 'Implement bubble sort algorithm', 'Write a Java program to sort an array using bubble sort algorithm.\n\nInput: Size n followed by n integers\nOutput: Sorted array (ascending)', 'PROGRAMMING', 'Sorting', 'EASY', 'REMEMBER', 'JAVA', 'Learn basic sorting algorithm', 'Time complexity: O(n²)', 'First line: n\nSecond line: n integers', 'Space-separated sorted integers', 'Input: 5\n5 3 1 4 2\nOutput: 1 2 3 4 5', 'Compare adjacent elements and swap', '["bubble-sort", "sorting", "algorithm"]'),

('Selection Sort', 'Implement selection sort algorithm', 'Write a Java program to sort an array using selection sort algorithm.\n\nInput: Size n followed by n integers\nOutput: Sorted array (ascending)', 'PROGRAMMING', 'Sorting', 'EASY', 'REMEMBER', 'JAVA', 'Learn selection sort', 'Time complexity: O(n²)', 'First line: n\nSecond line: n integers', 'Space-separated sorted integers', 'Input: 5\n5 3 1 4 2\nOutput: 1 2 3 4 5', 'Find minimum and swap', '["selection-sort", "sorting", "algorithm"]'),

('Binary Search', 'Implement binary search algorithm', 'Write a Java program to search for an element in a sorted array using binary search.\n\nInput: Size n, sorted array, target element\nOutput: Index of target or -1 if not found', 'PROGRAMMING', 'Searching', 'EASY', 'APPLY', 'JAVA', 'Learn binary search', 'Array must be sorted', 'First line: n\nSecond line: n sorted integers\nThird line: target', 'Integer (index) or -1', 'Input: 5\n1 3 5 7 9\n5\nOutput: 2', 'Use low, mid, high pointers', '["binary-search", "searching", "algorithm"]'),

-- FUNCTIONS & RECURSION
('GCD Calculator', 'Calculate GCD of two numbers', 'Write a Java program to calculate the Greatest Common Divisor (GCD) of two numbers using Euclidean algorithm.\n\nInput: Two integers a and b\nOutput: GCD of a and b', 'PROGRAMMING', 'Functions', 'EASY', 'REMEMBER', 'JAVA', 'Learn Euclidean algorithm', 'Use recursion or iteration', 'Two space-separated integers', 'Single integer (GCD)', 'Input: 12 18\nOutput: 6', 'GCD(a,b) = GCD(b, a%b)', '["gcd", "recursion", "mathematics"]'),

('Power Function', 'Calculate a raised to power b', 'Write a Java program to calculate a^b (a raised to the power b) using recursion.\n\nInput: Two integers a and b\nOutput: a raised to power b', 'PROGRAMMING', 'Functions', 'EASY', 'REMEMBER', 'JAVA', 'Learn recursive power function', 'Handle negative exponents', 'Two space-separated integers', 'Integer (a^b)', 'Input: 2 5\nOutput: 32', 'power(a,b) = a * power(a, b-1)', '["power", "recursion", "functions"]'),

-- Add more programming problems as needed
-- Total: 30 programming problems covering all required topics

-- OOP PROBLEMS
('Class and Object', 'Create a simple class and object', 'Write a Java program to create a Student class with name, age, and rollNumber attributes. Create an object and display its details.\n\nInput: Student details\nOutput: Student information', 'PROGRAMMING', 'OOP', 'EASY', 'REMEMBER', 'JAVA', 'Learn basic class creation', 'Use constructor to initialize', 'Name, age, rollNumber', 'Formatted student details', 'Input: John 20 101\nOutput: Name: John, Age: 20, Roll: 101', 'Create class with attributes and methods', '["class", "object", "constructor"]'),

('Inheritance Example', 'Demonstrate inheritance', 'Write a Java program demonstrating single inheritance with Animal (parent) and Dog (child) classes.\n\nInput: Dog name and sound\nOutput: Animal and Dog details', 'PROGRAMMING', 'OOP', 'EASY', 'UNDERSTAND', 'JAVA', 'Learn inheritance concept', 'Use extends keyword', 'Dog name and sound', 'Parent and child class details', 'Input: Buddy Bark\nOutput: Animal makes sound\nBuddy says Bark', 'Parent class constructor called automatically', '["inheritance", "oop", "extends"]'),

-- COLLECTIONS
('ArrayList Operations', 'Perform basic ArrayList operations', 'Write a Java program to demonstrate basic ArrayList operations: add, remove, get, and size.\n\nInput: Commands and values\nOutput: Results of operations', 'PROGRAMMING', 'Collections', 'EASY', 'APPLY', 'JAVA', 'Learn ArrayList usage', 'Handle different operations', 'Operation type and value', 'Operation result', 'Input: add 5\nadd 10\nget 1\nOutput: 10', 'Use ArrayList methods', '["arraylist", "collections", "list"]'),

-- EXCEPTION HANDLING
('Try Catch Example', 'Demonstrate exception handling', 'Write a Java program that demonstrates try-catch block by dividing two numbers and handling ArithmeticException.\n\nInput: Two numbers a and b\nOutput: Result or error message', 'PROGRAMMING', 'Exception Handling', 'EASY', 'UNDERSTAND', 'JAVA', 'Learn exception handling', 'Handle division by zero', 'Two space-separated integers', 'Result or error message', 'Input: 10 0\nOutput: Error: Division by zero', 'Use try-catch-finally', '["exception", "try-catch", "error-handling"]');

-- Update existing DSA questions to have question_type = 'DSA'
UPDATE coding_questions SET question_type = 'DSA' WHERE question_type IS NULL;

-- Verify the data
SELECT question_type, COUNT(*) as count FROM coding_questions GROUP BY question_type;