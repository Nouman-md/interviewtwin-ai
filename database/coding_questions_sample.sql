-- Comprehensive Coding Questions for InterviewTwin AI
-- LeetCode/HackerRank Style Questions with Multiple Topics and Difficulty Levels

USE interviewtwin;

-- Clear existing data (optional)
-- DELETE FROM coding_submissions;
-- DELETE FROM coding_questions;

-- ============================================
-- ARRAYS (10 questions)
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
  '["array", "hash-table", "two-pointer"],
  45.5,
  1250,
  568
),
(
  'Three Sum',
  'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.',
  'Find all unique triplets in the array which gives the sum of zero. The solution set must not contain duplicate triplets.',
  'Arrays',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Extended version of two sum - find three numbers that sum to zero',
  '3 <= nums.length <= 3000, -10^5 <= nums[i] <= 10^5',
  'First line: n (size of array)\nSecond line: n space-separated integers',
  'Each line: three space-separated integers (triplet)',
  '[{"input": "6\n-1 0 1 2 -1 -4", "output": "[[-1,-1,2],[-1,0,1]]", "explanation": "Two triplets sum to zero"}]',
  '["Sort the array first", "Use two pointers for each element", "Skip duplicates"]',
  '["array", "two-pointers", "sorting"],
  32.1,
  2100,
  674
),
(
  'Maximum Subarray',
  'Given an integer array nums, find the subarray with the largest sum, and return its sum.',
  'Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.',
  'Arrays',
  'MEDIUM',
  'APPLY',
  'JAVA',
  'Classic Kadane algorithm problem',
  '1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4',
  'First line: n (size of array)\nSecond line: n space-separated integers',
  'Single integer (maximum sum)',
  '[{"input": "8\n-2 1 -3 4 -1 2 1 -5 4", "output": "6", "explanation": "Subarray [4,-1,2,1] has the largest sum 6"}]',
  '["Consider using Kadane algorithm", "Think about what happens when all numbers are negative"]',
  '["array", "dynamic-programming", "divide-and-conquer"],
  48.3,
  1800,
  870
),
(
  'Rotate Array',
  'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.',
  'Rotate the array to the right by k steps. This means each element moves k positions to the right, with the last k elements wrapping around to the beginning.',
  'Arrays',
  'MEDIUM',
  'APPLY',
  'JAVA',
  'Array rotation problem with multiple solution approaches',
  '1 <= nums.length <= 10^5, 0 <= k <= 10^5',
  'First line: n and k\nSecond line: n space-separated integers',
  'n space-separated integers (rotated array)',
  '[{"input": "7 3\n1 2 3 4 5 6 7", "output": "5 6 7 1 2 3 4", "explanation": "Rotated 3 steps to the right"}]',
  '["Try the reversal algorithm", "Consider using extra space", "Think about cyclic replacements"]',
  '["array", "math", "two-pointers"],
  41.2,
  1500,
  618
),
(
  'Merge Sorted Array',
  'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order. Merge them into a single sorted array.',
  'Merge two sorted arrays into nums1 which has enough space to hold the additional elements from nums2.',
  'Arrays',
  'EASY',
  'APPLY',
  'JAVA',
  'Merge two sorted arrays in-place',
  'm == nums1.length, n == nums2.length, 0 <= m, n <= 200, 1 <= m + n <= 200',
  'First line: m and n\nSecond line: m integers (nums1)\nThird line: n integers (nums2)',
  'm+n space-separated integers (merged array)',
  '[{"input": "3 3\n1 2 3 0 0 0\n2 5 6", "output": "1 2 2 3 5 6"}]',
  '["Start from the end to avoid overwriting", "Use three pointers"]',
  '["array", "two-pointers", "sorting"],
  52.4,
  1900,
  995
);

-- ============================================
-- STRINGS (8 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Valid Anagram',
  'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
  'An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.',
  'Strings',
  'EASY',
  'APPLY',
  'JAVA',
  'Check if two strings are anagrams of each other',
  '1 <= s.length, t.length <= 5 * 10^4, s and t consist of lowercase English letters',
  'Two lines: first string s, second string t',
  'true or false',
  '[{"input": "anagram\nnagaram", "output": "true", "explanation": "Both strings contain the same characters"}, {"input": "rat\ncar", "output": "false"}]',
  '["Use a frequency counter", "Consider sorting both strings", "Think about the time and space complexity"]',
  '["string", "hash-table", "sorting"],
  58.7,
  2200,
  1291
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
  '["string", "sliding-window", "hash-table"],
  35.2,
  3100,
  1091
),
(
  'Valid Parentheses',
  'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
  'A valid string has: 1) Open brackets must be closed by the same type of brackets, 2) Open brackets must be closed in the correct order, 3) Every close bracket has a corresponding open bracket of the same type.',
  'Strings',
  'EASY',
  'APPLY',
  'JAVA',
  'Use a stack to validate parentheses',
  '1 <= s.length <= 10^4, s consists of parentheses only',
  'Single line: string s with parentheses',
  'true or false',
  '[{"input": "()", "output": "true"}, {"input": "()[]{}", "output": "true"}, {"input": "(]", "output": "false"}]',
  '["Use a stack data structure", "Push opening brackets, pop when matching closing bracket found", "Check if stack is empty at the end"]',
  '["string", "stack"],
  62.1,
  2800,
  1739
),
(
  'Longest Palindromic Substring',
  'Given a string s, return the longest palindromic substring in s.',
  'A palindrome is a string that reads the same forward and backward. Find the longest such substring.',
  'Strings',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Find longest palindrome in a string',
  '1 <= s.length <= 1000, s consist of only digits and English letters',
  'Single line: string s',
  'Longest palindromic substring',
  '[{"input": "babad", "output": "bab", "explanation": "aba is also a valid answer"}, {"input": "cbbd", "output": "bb"}]',
  '["Consider expand around center approach", "Dynamic programming is also possible", "Think about odd and even length palindromes"]',
  '["string", "dynamic-programming"],
  31.8,
  2500,
  795
),
(
  'String to Integer (atoi)',
  'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.',
  'Convert string to integer following specific rules: skip whitespace, handle optional sign, read digits, clamp to 32-bit integer range.',
  'Strings',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'String parsing with edge cases',
  '0 <= s.length <= 200, s consists of English letters, digits, whitespace, +, -,',
  'Single line: string to convert',
  '32-bit signed integer',
  '[{"input": "42", "output": "42"}, {"input": "   -42", "output": "-42"}, {"input": "4193 with words", "output": "4193"}]',
  '["Handle whitespace carefully", "Consider overflow cases", "Check for invalid characters"]',
  '["string", "parsing"],
  28.5,
  1900,
  542
);

-- ============================================
-- LINKED LISTS (6 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
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
  '["linked-list", "recursion"],
  68.4,
  2400,
  1642
),
(
  'Linked List Cycle',
  'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
  'There is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the next pointer.',
  'Linked Lists',
  'EASY',
  'ANALYZE',
  'JAVA',
  'Floyd cycle detection algorithm (tortoise and hare)',
  'The number of the nodes in the list is in the range [0, 10^4], -10^5 <= Node.val <= 10^5',
  'First line: n (number of nodes)\nSecond line: n space-separated integers\nThird line: position of cycle (-1 if no cycle)',
  'true or false',
  '[{"input": "3\n3 2 0 -4\n1", "output": "true", "explanation": "Tail connects to node index 1"}]',
  '["Use Floyd cycle detection (fast and slow pointers)", "If fast pointer reaches null, no cycle", "If fast and slow meet, there is a cycle"]',
  '["linked-list", "two-pointers", "hash-table"],
  55.2,
  2100,
  1159
),
(
  'Merge Two Sorted Lists',
  'Merge two sorted linked lists and return it as a sorted list. The list should be made by splicing together the nodes of the first two lists.',
  'Merge two sorted linked lists into one sorted list by rearranging the existing nodes.',
  'Linked Lists',
  'EASY',
  'APPLY',
  'JAVA',
  'Merge two sorted linked lists',
  'The number of nodes in both lists is in the range [0, 50], -100 <= Node.val <= 100',
  'First line: n (size of first list)\nSecond line: n integers\nThird line: m (size of second list)\nFourth line: m integers',
  'n+m space-separated integers (merged list)',
  '[{"input": "3\n1 2 4\n3\n1 3 4", "output": "1 1 2 3 4 4"}]',
  '["Use a dummy head node", "Compare values and attach smaller node", "Don''t create new nodes, just rearrange pointers"]',
  '["linked-list", "recursion"],
  61.8,
  2300,
  1415
),
(
  'Remove Nth Node From End of List',
  'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
  'Remove the nth node from the end in a single pass. Can you do it in one pass?',
  'Linked Lists',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Two-pointer technique to remove node in single pass',
  '1 <= sz <= 30, 0 <= n <= sz',
  'First line: n (position from end)\nSecond line: list of values',
  'List after removing nth node from end',
  '[{"input": "2\n1 2 3 4 5", "output": "1 2 3 5", "explanation": "Removed 2nd node from end (4)"}]',
  '["Use two pointers with n nodes apart", "Consider edge case: removing head", "Use a dummy node to simplify edge cases"]',
  '["linked-list", "two-pointers"],
  45.6,
  1800,
  821
);

-- ============================================
-- STACKS (5 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Valid Parentheses',
  'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
  'Use a stack to validate if parentheses are properly matched and nested.',
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
  '["string", "stack"],
  62.1,
  2800,
  1739
),
(
  'Min Stack',
  'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
  'Implement a stack with O(1) time complexity for all operations including getting minimum element.',
  'Stacks',
  'MEDIUM',
  'CREATE',
  'JAVA',
  'Design a min stack with constant time operations',
  'Methods will be called at most 3 * 10^4 times',
  'Series of operations: push, pop, top, getMin',
  'Results of operations',
  '[{"input": "push -2, push 0, push -3, getMin, pop, top, getMin", "output": "-3, 0, -2"}]',
  '["Use two stacks or store pairs", "Maintain minimum in auxiliary stack", "Update minimum on push and pop"]',
  '["stack", "design"],
  48.3,
  1600,
  773
),
(
  'Daily Temperatures',
  'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
  'For each day, find how many days until a warmer temperature. If there is no future day with a warmer temperature, put 0.',
  'Stacks',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Monotonic stack problem',
  '1 <= temperatures.length <= 10^5, 30 <= temperatures[i] <= 100',
  'First line: n\nSecond line: n temperatures',
  'n integers (days to wait)',
  '[{"input": "8\n73 74 75 71 69 72 76 73", "output": "1 1 4 2 1 1 0 0"}]',
  '["Use a monotonic decreasing stack", "Store indices in stack", "Pop when current temp > stack top temp"]',
  '["array", "stack", "monotonic-stack"],
  55.8,
  1400,
  781
);

-- ============================================
-- QUEUES (4 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Implement Queue using Stacks',
  'Implement a first in first out (FIFO) queue using only two stacks.',
  'Implement queue operations (push, pop, peek, empty) using only stack operations. The queue should support all standard queue functions.',
  'Queues',
  'EASY',
  'CREATE',
  'JAVA',
  'Design a queue using two stacks',
  'At most 100 calls will be made to push, pop, peek, and empty',
  'Series of queue operations',
  'Results of operations',
  '[{"input": "push 1, push 2, peek, pop, empty", "output": "1, 1, false"}]',
  '["Use two stacks: input and output", "Amortized O(1) for each operation", "Transfer elements only when output stack is empty"]',
  '["stack", "design", "queue"],
  58.2,
  1200,
  698
),
(
  'Number of Islands',
  'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
  'An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
  'Queues',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'BFS/DFS to count connected components',
  'm == grid.length, n == grid[i].length, 1 <= m, n <= 300',
  'First line: m n\nNext m lines: n characters (0 or 1)',
  'Single integer (number of islands)',
  '[{"input": "2 3\n11110\n11010\n11000\n00000", "output": "1"}]',
  '["Use BFS or DFS", "Mark visited cells", "Count connected components of 1s"]',
  '["array", "depth-first-search", "breadth-first-search"]',
  52.4,
  2600,
  1362
);

-- ============================================
-- TREES (8 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Binary Tree Inorder Traversal',
  'Given the root of a binary tree, return the inorder traversal of its nodes values.',
  'Inorder traversal: left subtree, root, right subtree. Return the values of nodes in this order.',
  'Trees',
  'EASY',
  'APPLY',
  'JAVA',
  'Classic tree traversal - inorder (left, root, right)',
  'The number of nodes in the tree is in the range [0, 100], -100 <= Node.val <= 100',
  'First line: n (number of nodes)\nSecond line: n values in level order (-1 for null)',
  'n integers (inorder traversal)',
  '[{"input": "3\n1 null 2 3", "output": "1 3 2", "explanation": "Inorder: left, root, right"}]',
  '["Recursive solution is straightforward", "Can also be solved iteratively with stack", "Morris traversal for O(1) space"]',
  '["tree", "depth-first-search", "binary-tree"],
  71.3,
  1900,
  1355
),
(
  'Maximum Depth of Binary Tree',
  'Given the root of a binary tree, return its maximum depth. A binary tree maximum depth is the number of nodes along the longest path from root node down to the farthest leaf node.',
  'Find the maximum depth (height) of a binary tree using recursion or iteration.',
  'Trees',
  'EASY',
  'APPLY',
  'JAVA',
  'Find height of binary tree',
  'The number of nodes in the tree is in the range [0, 10^4], -100 <= Node.val <= 100',
  'First line: n\nSecond line: level order traversal',
  'Single integer (maximum depth)',
  '[{"input": "3\n3 9 20 null null 15 7", "output": "3"}]',
  '["Use recursion: 1 + max(left, right)", "Base case: null node has depth 0", "Can also use BFS level-order traversal"]',
  '["tree", "depth-first-search", "breadth-first-search"],
  72.5,
  2100,
  1523
),
(
  'Validate Binary Search Tree',
  'Given the root of a binary tree, determine if it is a valid binary search tree (BST).',
  'A valid BST has: left subtree values < node value, right subtree values > node value, both left and right subtrees must also be BSTs.',
  'Trees',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Validate BST properties with in-order traversal or range checking',
  'The number of nodes in the tree is in the range [1, 10^4], -2^31 <= Node.val <= 2^31 - 1',
  'First line: n\nSecond line: level order traversal',
  'true or false',
  '[{"input": "3\n2 1 3", "output": "true"}, {"input": "5\n5 1 4 null null 3 6", "output": "false"}]',
  '["Use in-order traversal and check if sorted", "Or use range checking with min/max bounds", "Be careful with integer overflow"]',
  '["tree", "depth-first-search", "binary-search-tree"],
  32.1,
  2400,
  770
),
(
  'Binary Tree Level Order Traversal',
  'Given the root of a binary tree, return the level order traversal of its nodes values (i.e., from left to right, level by level).',
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
  '["tree", "breadth-first-search", "binary-tree"],
  58.6,
  2200,
  1289
),
(
  'Construct Binary Tree from Preorder and Inorder Traversal',
  'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.',
  'Reconstruct a binary tree from its preorder and inorder traversal arrays.',
  'Trees',
  'MEDIUM',
  'CREATE',
  'JAVA',
  'Tree construction from traversals',
  '1 <= preorder.length <= 3000, inorder.length == preorder.length',
  'First line: preorder traversal\nSecond line: inorder traversal',
  'Level order traversal of constructed tree',
  '[{"input": "3\n3 9 20 15 7\n9 3 15 20 7", "output": "3 9 20 15 7"}]',
  '["First element in preorder is root", "Find root in inorder to split left/right subtrees", "Use recursion with indices"]',
  '["array", "hash-table", "tree", "divide-and-conquer"],
  52.3,
  1500,
  785
);

-- ============================================
-- DYNAMIC PROGRAMMING (7 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
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
  '["dynamic-programming", "math"],
  52.8,
  2800,
  1478
),
(
  'Longest Increasing Subsequence',
  'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
  'A subsequence is a sequence that can be derived from the array by deleting some or no elements without changing the order of the remaining elements.',
  'Dynamic Programming',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Classic LIS problem with O(n log n) solution',
  '1 <= nums.length <= 2500, -10^4 <= nums[i] <= 10^4',
  'First line: n\nSecond line: n integers',
  'Single integer (length of LIS)',
  '[{"input": "8\n10 9 2 5 3 7 101 18", "output": "4", "explanation": "LIS is [2,3,7,101]"}]',
  '["DP approach: O(n^2)", "Binary search approach: O(n log n)", "Maintain tails array for binary search solution"]',
  '["array", "binary-search", "dynamic-programming"],
  38.5,
  1900,
  732
),
(
  'Coin Change',
  'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins needed to make up that amount.',
  'Find minimum number of coins to make given amount. If impossible, return -1. This is an unbounded knapsack problem.',
  'Dynamic Programming',
  'MEDIUM',
  'CREATE',
  'JAVA',
  'Unbounded knapsack - minimum coins for amount',
  '1 <= coins.length <= 12, 1 <= coins[i] <= 2^31 - 1, 0 <= amount <= 10^4',
  'First line: n (number of coins) and amount\nSecond line: n coin denominations',
  'Single integer (minimum coins) or -1',
  '[{"input": "3 11\n1 2 5", "output": "3", "explanation": "11 = 5 + 5 + 1"}]',
  '["Use DP array of size amount+1", "dp[i] = min(dp[i], dp[i-coin] + 1)", "Initialize dp[0] = 0, others to infinity"]',
  '["array", "dynamic-programming", "breadth-first-search"],
  38.2,
  2100,
  802
),
(
  'Edit Distance',
  'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.',
  'Classic edit distance (Levenshtein distance) problem. Operations: insert, delete, replace a character.',
  'Dynamic Programming',
  'HARD',
  'ANALYZE',
  'JAVA',
  'Levenshtein distance with DP',
  '0 <= word1.length, word2.length <= 500, word1 and word2 consist of lowercase English letters',
  'Two lines: word1 and word2',
  'Single integer (minimum edit distance)',
  '[{"input": "horse\nros", "output": "3", "explanation": "horse -> rorse (replace h with r)\nrorse -> rose (remove r)\nrose -> ros (remove e)"}]',
  '["Create 2D DP table", "If chars match: dp[i][j] = dp[i-1][j-1]", "Else: 1 + min(insert, delete, replace)"]',
  '["string", "dynamic-programming"],
  48.6,
  1700,
  826
);

-- ============================================
-- GRAPHS (6 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Number of Islands',
  'Given an m x n 2D binary grid which represents a map of 1s (land) and 0s (water), return the number of islands.',
  'Count connected components of 1s in a 2D grid using DFS or BFS.',
  'Graphs',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Count connected components in grid',
  'm == grid.length, n == grid[i].length, 1 <= m, n <= 300',
  'First line: m n\nNext m lines: n characters',
  'Single integer (number of islands)',
  '[{"input": "2 3\n11110\n11010\n11000\n00000", "output": "1"}]',
  '["Use DFS or BFS from each unvisited land cell", "Mark visited cells to avoid recounting", "Check all 4 directions"]',
  '["array", "depth-first-search", "breadth-first-search"],
  52.4,
  2600,
  1362
),
(
  'Course Schedule',
  'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
  'Detect cycle in directed graph. If cycle exists, impossible to finish all courses.',
  'Graphs',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Topological sort / cycle detection in directed graph',
  '1 <= numCourses <= 2000, 0 <= prerequisites.length <= 5000',
  'First line: numCourses and prerequisites count\nNext lines: prerequisite pairs',
  'true or false',
  '[{"input": "2 1\n1 0", "output": "true"}, {"input": "2 2\n1 0\n0 1", "output": "false"}]',
  '["Use DFS with coloring (white-gray-black)", "Or use Kahn algorithm (BFS topological sort)", "Cycle detection is key"]',
  '["depth-first-search", "breadth-first-search", "graph", "topological-sort"],
  45.3,
  2300,
  1042
),
(
  'Clone Graph',
  'Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph.',
  'Create a complete copy of the graph with all nodes and edges. Each node contains a value and a list of neighbors.',
  'Graphs',
  'MEDIUM',
  'CREATE',
  'JAVA',
  'Graph cloning with BFS or DFS',
  'The number of nodes in the graph is in the range [0, 100], 1 <= Node.val <= 100',
  'Adjacency list representation',
  'Adjacency list of cloned graph',
  '[{"input": "[[2,4],[1,3],[2,4],[1,3]]", "output": "[[2,4],[1,3],[2,4],[1,3]]"}]',
  '["Use hash map to store original to cloned mapping", "BFS or DFS to traverse and clone", "Avoid cloning same node twice"]',
  '["hash-table", "depth-first-search", "breadth-first-search", "graph"],
  48.7,
  1800,
  876
);

-- ============================================
-- SEARCHING & SORTING (6 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Binary Search',
  'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.',
  'Implement binary search to find target in sorted array. Return index if found, -1 otherwise.',
  'Searching',
  'EASY',
  'APPLY',
  'JAVA',
  'Classic binary search implementation',
  '1 <= nums.length <= 10^4, -10^4 < nums[i], target < 10^4, All integers in nums are unique',
  'First line: n and target\nSecond line: n sorted integers',
  'Single integer (index) or -1',
  '[{"input": "5 -1\n-1 0 3 5 9 12", "output": "0", "explanation": "Target -1 found at index 0"}]',
  '["Use low, mid, high pointers", "Update low = mid + 1 or high = mid - 1", "Avoid infinite loop with mid calculation"]',
  '["array", "binary-search"],
  65.2,
  2000,
  1304
),
(
  'Search in Rotated Sorted Array',
  'There is an integer array nums sorted in ascending order. Given a target value, search for it in nums. The array is rotated at some pivot.',
  'Search in rotated sorted array in O(log n) time. Array was originally sorted but rotated at unknown pivot.',
  'Searching',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Modified binary search for rotated array',
  '1 <= nums.length <= 5000, -10^4 <= nums[i] <= 10^4',
  'First line: n and target\nSecond line: n integers (rotated sorted)',
  'Single integer (index) or -1',
  '[{"input": "7 0\n4 5 6 7 0 1 2", "output": "4"}]',
  '["Determine which half is sorted", "Check if target is in sorted half", "Modified binary search with rotation check"]',
  '["array", "binary-search"],
  42.1,
  2400,
  1010
),
(
  'Sort Colors',
  'Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent.',
  'Dutch national flag problem - sort 0s, 1s, and 2s in single pass with O(1) space.',
  'Sorting',
  'MEDIUM',
  'APPLY',
  'JAVA',
  'Three-way partitioning (Dutch flag algorithm)',
  'n == nums.length, 1 <= n <= 300, nums[i] is 0, 1, or 2',
  'First line: n\nSecond line: n integers (0, 1, or 2)',
  'Sorted array',
  '[{"input": "6\n2 0 2 1 1 0", "output": "0 0 1 1 2 2"}]',
  '["Use three pointers: low, mid, high", "0s go to low region, 2s to high region", "Single pass solution"]',
  '["array", "two-pointers", "sorting"],
  58.3,
  1800,
  1049
),
(
  'Merge Intervals',
  'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
  'Merge overlapping intervals after sorting by start time.',
  'Sorting',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Interval merging after sorting',
  '1 <= intervals.length <= 10^4, intervals[i].length == 2',
  'First line: n\nNext n lines: start end',
  'Merged intervals',
  '[{"input": "3\n1 3\n2 6\n8 10 15 18", "output": "[[1,6],[8,10],[15,18]]"}]',
  '["Sort intervals by start time", "Merge if current.start <= previous.end", "Update end as max of current and previous end"]',
  '["array", "sorting"],
  48.5,
  2100,
  1018
);

-- ============================================
-- BIT MANIPULATION (4 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Single Number',
  'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.',
  'Find the element that appears only once using bit manipulation. All other elements appear exactly twice.',
  'Bit Manipulation',
  'EASY',
  'APPLY',
  'JAVA',
  'XOR property: a ^ a = 0, a ^ 0 = a',
  '1 <= nums.length <= 3 * 10^4, -3 * 10^4 <= nums[i] <= 3 * 10^4',
  'First line: n\nSecond line: n integers',
  'Single integer (the unique number)',
  '[{"input": "5\n2 2 1", "output": "1"}, {"input": "5\n4 1 2 1 2", "output": "4"}]',
  '["Use XOR operation", "a ^ a = 0, a ^ 0 = a", "XOR all numbers, duplicates cancel out"]',
  '["array", "bit-manipulation"],
  71.8,
  1900,
  1364
),
(
  'Number of 1 Bits',
  'Write a function that takes an unsigned integer and returns the number of 1 bits it has (Hamming weight).',
  'Count set bits in binary representation of a number.',
  'Bit Manipulation',
  'EASY',
  'APPLY',
  'JAVA',
  'Brian Kernighan algorithm: n & (n-1) clears the lowest set bit',
  'The input must be a binary string of length 32',
  'Single unsigned integer',
  'Single integer (count of 1 bits)',
  '[{"input": "00000000000000000000000000001011", "output": "3"}]',
  '["Use n & (n-1) to clear lowest set bit", "Count how many times you can do this", "Or use built-in functions"]',
  '["bit-manipulation"],
  68.4,
  1600,
  1094
),
(
  'Reverse Bits',
  'Reverse the bits of a given 32-bit unsigned integer.',
  'Reverse the binary representation of a 32-bit integer.',
  'Bit Manipulation',
  'EASY',
  'APPLY',
  'JAVA',
  'Bit manipulation to reverse bits',
  'The input must be a binary string of length 32',
  'Single 32-bit unsigned integer',
  'Reversed 32-bit unsigned integer',
  '[{"input": "00000010100101000001111010011100", "output": "964176192"}]',
  '["Extract bits from right one by one", "Build result by shifting and OR-ing", "Or use built-in reverse function"]',
  '["bit-manipulation", "divide-and-conquer"],
  52.1,
  1400,
  730
);

-- ============================================
-- MATHEMATICS (5 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Fizz Buzz',
  'Given an integer n, return a string array answer where answer[i] is the string representation of (i + 1) with specific rules.',
  'Classic FizzBuzz: multiples of 3 -> "Fizz", multiples of 5 -> "Buzz", multiples of both -> "FizzBuzz", else the number.',
  'Mathematics',
  'EASY',
  'REMEMBER',
  'JAVA',
  'Simple modulo operations and string building',
  '1 <= n <= 10^4',
  'Single integer n',
  'n strings (one per line)',
  '[{"input": "3", "output": "[\"1\",\"2\",\"Fizz\"]"}]',
  '["Use modulo operator %", "Check divisibility by 3 and 5", "Build string conditionally"]',
  '["math", "string"],
  75.2,
  1500,
  1128
),
(
  'Excel Sheet Column Number',
  'Given a string columnTitle that appears in an Excel sheet, return its corresponding column number.',
  'Convert Excel column title to number (A=1, B=2, ..., Z=26, AA=27, AB=28, etc.)',
  'Mathematics',
  'EASY',
  'APPLY',
  'JAVA',
  'Base-26 conversion',
  '1 <= columnTitle.length <= 7, columnTitle consists of only uppercase English letters',
  'Single string (column title)',
  'Single integer (column number)',
  '[{"input": "A", "output": "1"}, {"input": "AB", "output": "28"}, {"input": "ZY", "output": "701"}]',
  '["Treat as base-26 number", "result = result * 26 + (char - ''A'' + 1)", "Be careful with large values"]',
  '["math", "string"]',
  62.5,
  1300,
  813
),
(
  'Pow(x, n)',
  'Implement pow(x, n), which calculates x raised to the power n.',
  'Calculate x^n efficiently. Consider negative exponents and large values of n.',
  'Mathematics',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Fast exponentiation (binary exponentiation)',
  '-100.0 < x < 100.0, -2^31 <= n <= 2^31 - 1, n is an integer',
  'Two values: x and n',
  'Single floating point number (x^n)',
  '[{"input": "2.00000 10", "output": "1024.00000"}, {"input": "2.10000 3", "output": "9.26100"}]',
  '["Use binary exponentiation for O(log n)", "Handle negative exponents", "Consider overflow for large n"]',
  '["math", "recursion"]',
  35.8,
  1700,
  608
);

-- ============================================
-- RECURSION & BACKTRACKING (5 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Subsets',
  'Given an integer array nums of unique elements, return all possible subsets (the power set).',
  'Generate all possible subsets of a set. The solution set must not contain duplicate subsets.',
  'Backtracking',
  'MEDIUM',
  'CREATE',
  'JAVA',
  'Backtracking to generate power set',
  '1 <= nums.length <= 10, -10 <= nums[i] <= 10',
  'First line: n\nSecond line: n integers',
  'All subsets (each on new line)',
  '[{"input": "3\n1 2 3", "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]"}]',
  '["Use backtracking", "At each element, choose to include or exclude", "Sort array first for consistent output"]',
  '["array", "backtracking", "bit-manipulation"],
  72.4,
  1600,
  1159
),
(
  'Permutations',
  'Given an array nums of distinct integers, return all the possible permutations.',
  'Generate all permutations of the input array.',
  'Backtracking',
  'MEDIUM',
  'CREATE',
  'JAVA',
  'Backtracking to generate all permutations',
  '1 <= nums.length <= 6, -10 <= nums[i] <= 10',
  'First line: n\nSecond line: n integers',
  'All permutations',
  '[{"input": "3\n1 2 3", "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]"}]',
  '["Use backtracking with visited array", "Or swap elements in place", "n! permutations for n elements"]',
  '["array", "backtracking"],
  68.5,
  1800,
  1233
),
(
  'N-Queens',
  'The n-queens puzzle is the problem of placing n chess queens on an n x n chessboard such that no two queens attack each other.',
  'Place n queens on n x n board so that no two queens threaten each other. Return all distinct solutions.',
  'Backtracking',
  'HARD',
  'CREATE',
  'JAVA',
  'Classic backtracking problem',
  '1 <= n <= 9',
  'Single integer n',
  'All board configurations (each row as string)',
  '[{"input": "4", "output": "[[.Q.., ...Q, Q..., ..Q.], [..Q., Q..., ...Q, .Q..]]"}]',
  '["Use backtracking row by row", "Check if position is safe (no conflicts)", "Use sets for columns and diagonals"]',
  '["array", "backtracking"],
  58.2,
  1200,
  698
);

-- ============================================
-- GREEDY ALGORITHMS (4 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Jump Game',
  'You are given an integer array nums. You are initially positioned at the array first index, and each element in the array represents your maximum jump length at that position.',
  'Determine if you can reach the last index by jumping. Each element represents max jump length from that position.',
  'Greedy',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Greedy approach - track furthest reachable position',
  '1 <= nums.length <= 10^4, 0 <= nums[i] <= 10^5',
  'First line: n\nSecond line: n integers',
  'true or false',
  '[{"input": "5\n2 3 1 1 4", "output": "true", "explanation": "Can jump to last index"}]',
  '["Track furthest reachable position", "If current index > furthest, return false", "Greedy: always jump to furthest reachable"]',
  '["array", "dynamic-programming", "greedy"],
  38.5,
  2200,
  847
),
(
  'Gas Station',
  'There are n gas stations along a circular route. Your car starts with an empty tank. Given two integer arrays gas and cost, return the starting gas station index if you can travel around the circuit once in the clockwise direction.',
  'Find if there exists a starting point to complete the circuit. If not, return -1.',
  'Greedy',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Greedy algorithm for circular tour',
  'n == gas.length == cost.length, 1 <= n <= 10^5, 0 <= gas[i], cost[i] <= 10^4',
  'First line: n\nSecond line: gas array\nThird line: cost array',
  'Single integer (starting index) or -1',
  '[{"input": "5\n1 2 3 4 5\n3 4 5 1 2", "output": "3"}]',
  '["If total gas < total cost, impossible", "Greedy: if tank becomes negative, start from next station", "Only one valid start if solution exists"]',
  '["array", "greedy"],
  42.3,
  1500,
  635
);

-- ============================================
-- HASHING (5 questions)
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
(
  'Two Sum',
  'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
  'Use hash map to find two numbers that sum to target in single pass.',
  'Hashing',
  'EASY',
  'APPLY',
  'JAVA',
  'Hash map for O(n) solution',
  '2 <= nums.length <= 10^4',
  'First line: n and target\nSecond line: n integers',
  'Two indices',
  '[{"input": "4 9\n2 7 11 15", "output": "0 1"}]',
  '["Use HashMap to store value->index", "For each num, check if (target - num) exists", "O(n) time, O(n) space"]',
  '["array", "hash-table"],
  45.5,
  1250,
  568
),
(
  'Group Anagrams',
  'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
  'Group strings that are anagrams of each other using sorted string as key.',
  'Hashing',
  'MEDIUM',
  'ANALYZE',
  'JAVA',
  'Hash map with sorted string as key',
  '1 <= strs.length <= 10^4, 0 <= strs[i].length <= 100',
  'First line: n\nNext n lines: strings',
  'Grouped anagrams',
  '[{"input": "6\neat\ntea\ntan\nate\nnat\nbat", "output": "[[bat],[nat,tan],[ate,eat,tea]]"}]',
  '["Sort each string to create key", "Use HashMap<String, List<String>>", "Anagrams have same sorted representation"]',
  '["array", "hash-table", "string", "sorting"],
  62.8,
  2000,
  1256
),
(
  'LRU Cache',
  'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
  'Implement LRU cache with O(1) get and put operations using hash map and doubly linked list.',
  'Hashing',
  'MEDIUM',
  'CREATE',
  'JAVA',
  'Design LRU cache with hash map and doubly linked list',
  'At most 2 * 10^5 calls will be made to get and put',
  'Series of operations: get, put',
  'Results of operations',
  '[{"input": "put 1 1, put 2 2, get 1, put 3 3, get 2", "output": "1, -1"}]',
  '["Use HashMap + Doubly Linked List", "Most recently used at front, least at back", "On access, move node to front"]',
  '["hash-table", "linked-list", "design"],
  42.5,
  1800,
  765
);
USE interviewtwin;

-- ============================================================
-- PROGRAMMING QUESTIONS - BATCH 1
-- 25 Java Programming Problems
-- ============================================================

INSERT INTO coding_questions
(
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
    tags,
    acceptance_rate,
    total_submissions,
    total_accepted
)
VALUES

-- ============================================================
-- 1. REVERSE A NUMBER
-- ============================================================

(
    'Reverse a Number',
    'Given an integer n, reverse its digits and return the reversed number.',
    'Write a program to reverse the digits of a given integer. Preserve the sign if the number is negative.',
    'PROGRAMMING',
    'Number Problems',
    'EASY',
    'APPLY',
    'JAVA',
    'Use repeated modulo and integer division operations to extract digits.',
    'n is an integer. -10^9 <= n <= 10^9',
    'A single integer n',
    'The reversed integer',
    '[{"input":"12345","output":"54321"},{"input":"-123","output":"-321"}]',
    '["Extract the last digit using n % 10. Remove it using n / 10."]',
    '["java","numbers","loops","modulo"]',
    70.0,
    0,
    0
),

-- ============================================================
-- 2. PALINDROME NUMBER
-- ============================================================

(
    'Palindrome Number',
    'Given an integer n, determine whether it reads the same forward and backward.',
    'Return true if the number is a palindrome and false otherwise. Negative numbers are not considered palindromes.',
    'PROGRAMMING',
    'Number Problems',
    'EASY',
    'UNDERSTAND',
    'JAVA',
    'Reverse the number and compare it with the original value.',
    'n is an integer. -10^9 <= n <= 10^9',
    'A single integer n',
    'true or false',
    '[{"input":"121","output":"true"},{"input":"123","output":"false"}]',
    '["Store the original number before reversing it."]',
    '["java","numbers","palindrome","loops"]',
    72.0,
    0,
    0
),

-- ============================================================
-- 3. COUNT DIGITS
-- ============================================================

(
    'Count Digits',
    'Given an integer n, count the number of digits in it.',
    'Write a program that counts how many digits are present in the given integer.',
    'PROGRAMMING',
    'Number Problems',
    'EASY',
    'UNDERSTAND',
    'JAVA',
    'Repeatedly divide the number by 10 until it becomes zero.',
    'n is an integer and may be positive, zero, or negative.',
    'A single integer n',
    'Number of digits',
    '[{"input":"12345","output":"5"},{"input":"7","output":"1"},{"input":"0","output":"1"}]',
    '["Use Math.abs() for negative values. Handle zero separately."]',
    '["java","numbers","loops","digit"]',
    78.0,
    0,
    0
),

-- ============================================================
-- 4. SUM OF DIGITS
-- ============================================================

(
    'Sum of Digits',
    'Given an integer n, calculate the sum of all its digits.',
    'Extract every digit from the number and add them together.',
    'PROGRAMMING',
    'Number Problems',
    'EASY',
    'APPLY',
    'JAVA',
    'Use modulo 10 to obtain each digit and divide by 10 to remove it.',
    'n is an integer. -10^9 <= n <= 10^9',
    'A single integer n',
    'The sum of its digits',
    '[{"input":"12345","output":"15"},{"input":"908","output":"17"}]',
    '["digit = n % 10. Add digit to sum and then perform n = n / 10."]',
    '["java","numbers","loops","modulo"]',
    80.0,
    0,
    0
),

-- ============================================================
-- 5. ARMSTRONG NUMBER
-- ============================================================

(
    'Armstrong Number',
    'Determine whether a given number is an Armstrong number.',
    'An Armstrong number is equal to the sum of its digits raised to the power of the number of digits.',
    'PROGRAMMING',
    'Number Problems',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Count the digits first, then calculate the powered sum of every digit.',
    '0 <= n <= 10^9',
    'A single integer n',
    'true or false',
    '[{"input":"153","output":"true"},{"input":"123","output":"false"}]',
    '["First count the digits. Use Math.pow() for each digit."]',
    '["java","numbers","math","loops"]',
    62.0,
    0,
    0
),

-- ============================================================
-- 6. PRIME NUMBER
-- ============================================================

(
    'Check Prime Number',
    'Given an integer n, determine whether it is prime.',
    'A prime number has exactly two positive divisors: 1 and itself.',
    'PROGRAMMING',
    'Number Problems',
    'EASY',
    'APPLY',
    'JAVA',
    'Check divisibility from 2 through the square root of n.',
    '2 <= n <= 10^9',
    'A single integer n',
    'true or false',
    '[{"input":"17","output":"true"},{"input":"20","output":"false"}]',
    '["You only need to check divisors up to sqrt(n)."]',
    '["java","prime","math","loops"]',
    76.0,
    0,
    0
),

-- ============================================================
-- 7. PRINT PRIME NUMBERS
-- ============================================================

(
    'Print Prime Numbers in a Range',
    'Given two integers L and R, print all prime numbers between them.',
    'Find and print every prime number in the inclusive range [L, R].',
    'PROGRAMMING',
    'Number Problems',
    'MEDIUM',
    'APPLY',
    'JAVA',
    'Combine range iteration with a prime-checking method.',
    '1 <= L <= R <= 100000',
    'Two integers L and R',
    'All prime numbers in ascending order',
    '[{"input":"10 20","output":"11 13 17 19"}]',
    '["Create a separate isPrime() method and call it for each number."]',
    '["java","prime","methods","loops"]',
    64.0,
    0,
    0
),

-- ============================================================
-- 8. FACTORIAL
-- ============================================================

(
    'Factorial of a Number',
    'Given n, calculate n factorial.',
    'The factorial of n is the product of all positive integers from 1 to n.',
    'PROGRAMMING',
    'Loops',
    'EASY',
    'APPLY',
    'JAVA',
    'Calculate the factorial using a loop.',
    '0 <= n <= 20',
    'A single integer n',
    'n!',
    '[{"input":"5","output":"120"},{"input":"0","output":"1"}]',
    '["Initialize result to 1 and multiply it by every number from 1 to n."]',
    '["java","loops","factorial","math"]',
    88.0,
    0,
    0
),

-- ============================================================
-- 9. FIBONACCI SERIES
-- ============================================================

(
    'Fibonacci Series',
    'Given n, print the first n Fibonacci numbers.',
    'The Fibonacci sequence starts with 0 and 1, and every next value is the sum of the previous two values.',
    'PROGRAMMING',
    'Loops',
    'EASY',
    'APPLY',
    'JAVA',
    'Generate Fibonacci numbers iteratively.',
    '1 <= n <= 50',
    'A single integer n',
    'First n Fibonacci numbers',
    '[{"input":"7","output":"0 1 1 2 3 5 8"}]',
    '["Maintain two variables representing consecutive Fibonacci numbers."]',
    '["java","fibonacci","loops","series"]',
    82.0,
    0,
    0
),

-- ============================================================
-- 10. GCD OF TWO NUMBERS
-- ============================================================

(
    'Greatest Common Divisor',
    'Given two positive integers a and b, find their greatest common divisor.',
    'Find the largest positive integer that divides both a and b.',
    'PROGRAMMING',
    'Number Problems',
    'EASY',
    'APPLY',
    'JAVA',
    'Use the Euclidean algorithm to efficiently calculate the GCD.',
    '1 <= a, b <= 10^9',
    'Two integers a and b',
    'The GCD',
    '[{"input":"48 18","output":"6"},{"input":"20 8","output":"4"}]',
    '["Repeatedly replace a,b with b,a%b until b becomes zero."]',
    '["java","gcd","euclidean-algorithm","math"]',
    79.0,
    0,
    0
),

-- ============================================================
-- 11. LCM OF TWO NUMBERS
-- ============================================================

(
    'Least Common Multiple',
    'Given two positive integers a and b, find their least common multiple.',
    'Calculate the smallest positive integer that is divisible by both a and b.',
    'PROGRAMMING',
    'Number Problems',
    'EASY',
    'APPLY',
    'JAVA',
    'Use the relationship LCM(a,b) = abs(a*b) / GCD(a,b).',
    '1 <= a, b <= 10^6',
    'Two integers a and b',
    'The LCM',
    '[{"input":"12 18","output":"36"},{"input":"5 7","output":"35"}]',
    '["Calculate GCD first and then use the LCM formula."]',
    '["java","lcm","gcd","math"]',
    77.0,
    0,
    0
),

-- ============================================================
-- 12. EVEN OR ODD
-- ============================================================

(
    'Even or Odd',
    'Determine whether an integer is even or odd.',
    'Print EVEN if the number is divisible by 2, otherwise print ODD.',
    'PROGRAMMING',
    'Conditions',
    'EASY',
    'REMEMBER',
    'JAVA',
    'Use the remainder operator to determine divisibility by 2.',
    'n is an integer.',
    'A single integer n',
    'EVEN or ODD',
    '[{"input":"24","output":"EVEN"},{"input":"17","output":"ODD"}]',
    '["Check n % 2."]',
    '["java","if-else","conditions","modulo"]',
    94.0,
    0,
    0
),

-- ============================================================
-- 13. LARGEST OF THREE NUMBERS
-- ============================================================

(
    'Largest of Three Numbers',
    'Given three integers, find the largest value.',
    'Compare three numbers and return the maximum value.',
    'PROGRAMMING',
    'Conditions',
    'EASY',
    'UNDERSTAND',
    'JAVA',
    'Use if-else conditions or Math.max().',
    '-10^9 <= a,b,c <= 10^9',
    'Three integers a, b and c',
    'The largest integer',
    '[{"input":"10 25 17","output":"25"},{"input":"8 8 3","output":"8"}]',
    '["Start with the first number as maximum and compare the remaining numbers."]',
    '["java","if-else","conditions","maximum"]',
    91.0,
    0,
    0
),

-- ============================================================
-- 14. LEAP YEAR
-- ============================================================

(
    'Leap Year Check',
    'Determine whether a given year is a leap year.',
    'A year is a leap year if it is divisible by 400, or divisible by 4 but not divisible by 100.',
    'PROGRAMMING',
    'Conditions',
    'EASY',
    'UNDERSTAND',
    'JAVA',
    'Implement the complete leap-year condition.',
    '1 <= year <= 9999',
    'A single year',
    'true or false',
    '[{"input":"2024","output":"true"},{"input":"1900","output":"false"},{"input":"2000","output":"true"}]',
    '["Use: year % 400 == 0 OR (year % 4 == 0 AND year % 100 != 0)."]', 
    '["java","conditions","leap-year","if-else"]',
    86.0,
    0,
    0
),

-- ============================================================
-- 15. MULTIPLICATION TABLE
-- ============================================================

(
    'Multiplication Table',
    'Given an integer n, print its multiplication table from 1 to 10.',
    'Generate the multiplication table of n using a loop.',
    'PROGRAMMING',
    'Loops',
    'EASY',
    'REMEMBER',
    'JAVA',
    'Use a for loop from 1 through 10.',
    'n is an integer.',
    'A single integer n',
    'Ten multiplication results',
    '[{"input":"5","output":"5 10 15 20 25 30 35 40 45 50"}]',
    '["The loop variable represents the multiplier."]',
    '["java","for-loop","loops","multiplication"]',
    95.0,
    0,
    0
),

-- ============================================================
-- 16. SUM OF NATURAL NUMBERS
-- ============================================================

(
    'Sum of First N Natural Numbers',
    'Given n, calculate the sum of the first n natural numbers.',
    'Calculate 1 + 2 + 3 + ... + n.',
    'PROGRAMMING',
    'Loops',
    'EASY',
    'APPLY',
    'JAVA',
    'Solve using either a loop or the mathematical formula n*(n+1)/2.',
    '1 <= n <= 10^9',
    'A single integer n',
    'The sum',
    '[{"input":"10","output":"55"},{"input":"100","output":"5050"}]',
    '["The formula provides an O(1) solution."]',
    '["java","loops","math","formula"]',
    89.0,
    0,
    0
),

-- ============================================================
-- 17. REVERSE A STRING
-- ============================================================

(
    'Reverse a String',
    'Given a string, return the string in reverse order.',
    'Reverse all characters of the input string without changing their values.',
    'PROGRAMMING',
    'Strings',
    'EASY',
    'APPLY',
    'JAVA',
    'Solve using a loop, character array, or StringBuilder.',
    '1 <= string length <= 100000',
    'A single string',
    'The reversed string',
    '[{"input":"hello","output":"olleh"},{"input":"Java","output":"avaJ"}]',
    '["StringBuilder.reverse() can solve this directly."]',
    '["java","strings","stringbuilder"]',
    90.0,
    0,
    0
),

-- ============================================================
-- 18. COUNT VOWELS
-- ============================================================

(
    'Count Vowels in a String',
    'Given a string, count the number of vowels in it.',
    'Count occurrences of a, e, i, o and u in both uppercase and lowercase forms.',
    'PROGRAMMING',
    'Strings',
    'EASY',
    'APPLY',
    'JAVA',
    'Traverse the string and check every character against the five vowels.',
    '1 <= string length <= 100000',
    'A single string',
    'Number of vowels',
    '[{"input":"InterviewTwin","output":"5"},{"input":"HELLO","output":"2"}]',
    '["Convert characters to lowercase or check both cases."]',
    '["java","strings","characters","loops"]',
    88.0,
    0,
    0
),

-- ============================================================
-- 19. CHARACTER FREQUENCY
-- ============================================================

(
    'Character Frequency',
    'Given a string, count the frequency of each character.',
    'Print each distinct character and its number of occurrences in the order of first appearance.',
    'PROGRAMMING',
    'Strings',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use a HashMap or an array for ASCII characters.',
    '1 <= string length <= 100000',
    'A single string',
    'Each character followed by its frequency',
    '[{"input":"banana","output":"b 1, a 3, n 2"}]',
    '["A LinkedHashMap preserves insertion order."]',
    '["java","strings","hashmap","frequency"]',
    67.0,
    0,
    0
),

-- ============================================================
-- 20. ANAGRAM CHECK
-- ============================================================

(
    'Anagram Check',
    'Given two strings, determine whether they are anagrams.',
    'Two strings are anagrams if they contain the same characters with the same frequencies.',
    'PROGRAMMING',
    'Strings',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Compare character frequencies in both strings.',
    'Strings contain lowercase English letters and have equal length.',
    'Two strings',
    'true or false',
    '[{"input":"listen silent","output":"true"},{"input":"hello world","output":"false"}]',
    '["Count every character in the first string and subtract counts using the second."]',
    '["java","strings","anagram","frequency"]',
    74.0,
    0,
    0
),

-- ============================================================
-- 21. SECOND LARGEST ARRAY ELEMENT
-- ============================================================

(
    'Second Largest Element',
    'Given an integer array, find the second largest distinct element.',
    'Return the second largest distinct value in the array.',
    'PROGRAMMING',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Track the largest and second largest values in one traversal.',
    '2 <= n <= 100000. The array contains at least two distinct values.',
    'First line: n\nSecond line: n integers',
    'The second largest value',
    '[{"input":"5\n10 5 8 20 15","output":"15"}]',
    '["Update secondLargest whenever a new largest value is found."]',
    '["java","arrays","maximum","one-pass"]',
    81.0,
    0,
    0
),

-- ============================================================
-- 22. ARRAY SUM
-- ============================================================

(
    'Sum of Array Elements',
    'Given an integer array, calculate the sum of all its elements.',
    'Traverse the array and add every element to a running sum.',
    'PROGRAMMING',
    'Arrays',
    'EASY',
    'REMEMBER',
    'JAVA',
    'Use a loop to accumulate the array values.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'The sum of all elements',
    '[{"input":"5\n1 2 3 4 5","output":"15"}]',
    '["Initialize sum to 0 and add each array element to it while traversing the array."]',
    '["java","arrays","loops","sum"]',
    96.0,
    0,
    0
),

-- ============================================================
-- 23. COUNT EVEN AND ODD
-- ============================================================

(
    'Count Even and Odd Elements',
    'Given an integer array, count how many elements are even and how many are odd.',
    'Traverse the array and maintain separate counters for even and odd values.',
    'PROGRAMMING',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Use the modulo operator to classify every element.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Two integers: even count and odd count',
    '[{"input":"6\n1 2 3 4 5 6","output":"3 3"}]',
    '["If value % 2 == 0, increment the even counter."]',
    '["java","arrays","loops","modulo"]',
    92.0,
    0,
    0
),

-- ============================================================
-- 24. REMOVE DUPLICATES FROM SORTED ARRAY
-- ============================================================

(
    'Remove Duplicates from Sorted Array',
    'Given a sorted integer array, remove duplicate values in-place.',
    'Keep only one occurrence of each value and return the number of unique elements.',
    'PROGRAMMING',
    'Arrays',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use two pointers to overwrite duplicate values.',
    '1 <= n <= 100000. The array is sorted in non-decreasing order.',
    'First line: n\nSecond line: sorted integers',
    'Number of unique elements followed by the unique values',
    '[{"input":"7\n1 1 2 2 3 4 4","output":"4\n1 2 3 4"}]',
    '["Keep one pointer for the position of the next unique value."]',
    '["java","arrays","two-pointers","duplicates"]',
    69.0,
    0,
    0
),

-- ============================================================
-- 25. ROTATE ARRAY LEFT BY ONE
-- ============================================================

(
    'Rotate Array Left by One',
    'Given an array, rotate all elements one position to the left.',
    'The first element should move to the end while every other element shifts one position left.',
    'PROGRAMMING',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Store the first element, shift the remaining elements, then place the first element at the end.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'The rotated array',
    '[{"input":"5\n1 2 3 4 5","output":"2 3 4 5 1"}]',
    '["Save arr[0] before shifting the array."]',
    '["java","arrays","rotation","loops"]',
    84.0,
    0,
    0
);

USE interviewtwin;

-- ============================================================
-- PROGRAMMING QUESTIONS - BATCH 2
-- 25 Java Programming Problems
-- ============================================================

INSERT INTO coding_questions
(
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
    tags,
    acceptance_rate,
    total_submissions,
    total_accepted
)
VALUES

-- 26
(
    'Power of a Number',
    'Given two integers base and exponent, calculate base raised to the power exponent.',
    'Write a program to calculate the power of a number without using Math.pow().',
    'PROGRAMMING',
    'Methods',
    'EASY',
    'APPLY',
    'JAVA',
    'Use repeated multiplication inside a method.',
    '0 <= exponent <= 30',
    'Two integers: base and exponent',
    'The calculated power',
    '[{"input":"2 5","output":"32"},{"input":"3 4","output":"81"}]',
    '["Initialize result to 1 and multiply by base exponent times."]',
    '["java","methods","loops","math"]',
    86.0,
    0,
    0
),

-- 27
(
    'Count Factors',
    'Given an integer n, count the number of positive factors of n.',
    'Find how many numbers divide n without leaving a remainder.',
    'PROGRAMMING',
    'Number Problems',
    'EASY',
    'APPLY',
    'JAVA',
    'Check divisibility from 1 through n or optimize using square root.',
    '1 <= n <= 1000000000',
    'A single integer n',
    'Number of factors',
    '[{"input":"12","output":"6"},{"input":"7","output":"2"}]',
    '["A divisor d has a corresponding divisor n/d."]',
    '["java","numbers","factors","math"]',
    82.0,
    0,
    0
),

-- 28
(
    'Perfect Number',
    'Determine whether a number is a perfect number.',
    'A perfect number is equal to the sum of all its positive proper divisors.',
    'PROGRAMMING',
    'Number Problems',
    'EASY',
    'ANALYZE',
    'JAVA',
    'Find proper divisors and calculate their sum.',
    '1 <= n <= 100000000',
    'A single integer n',
    'true or false',
    '[{"input":"28","output":"true"},{"input":"12","output":"false"}]',
    '["Do not include the number itself in the divisor sum."]',
    '["java","numbers","divisors","loops"]',
    73.0,
    0,
    0
),

-- 29
(
    'Strong Number',
    'Determine whether a number is a strong number.',
    'A number is strong if the sum of factorials of its digits equals the original number.',
    'PROGRAMMING',
    'Number Problems',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Extract each digit and calculate its factorial.',
    '0 <= n <= 100000000',
    'A single integer n',
    'true or false',
    '[{"input":"145","output":"true"},{"input":"123","output":"false"}]',
    '["For 145: 1! + 4! + 5! = 145."]',
    '["java","numbers","factorial","loops"]',
    68.0,
    0,
    0
),

-- 30
(
    'Decimal to Binary',
    'Convert a positive decimal integer to its binary representation.',
    'Convert the given decimal number to binary without using Integer.toBinaryString().',
    'PROGRAMMING',
    'Number Systems',
    'EASY',
    'APPLY',
    'JAVA',
    'Repeatedly divide the number by 2 and collect the remainders.',
    '0 <= n <= 1000000000',
    'A single integer n',
    'Binary representation',
    '[{"input":"10","output":"1010"},{"input":"7","output":"111"}]',
    '["The remainders appear in reverse order."]',
    '["java","number-system","binary","loops"]',
    79.0,
    0,
    0
),

-- 31
(
    'Binary to Decimal',
    'Convert a binary number represented as a string into decimal.',
    'Calculate the decimal value of the given binary string.',
    'PROGRAMMING',
    'Number Systems',
    'EASY',
    'APPLY',
    'JAVA',
    'Process the binary digits from left to right.',
    '1 <= length <= 30',
    'A binary string',
    'Decimal integer',
    '[{"input":"1010","output":"10"},{"input":"1111","output":"15"}]',
    '["result = result * 2 + currentDigit."]',
    '["java","binary","number-system","strings"]',
    84.0,
    0,
    0
),

-- 32
(
    'Decimal to Binary Using Recursion',
    'Convert a decimal integer to binary using recursion.',
    'Write a recursive method that prints or returns the binary representation.',
    'PROGRAMMING',
    'Recursion',
    'MEDIUM',
    'APPLY',
    'JAVA',
    'Use division by 2 recursively and print the remainder while returning.',
    '0 <= n <= 1000000000',
    'A single integer n',
    'Binary representation',
    '[{"input":"13","output":"1101"}]',
    '["The recursive call should process n / 2 before printing n % 2."]',
    '["java","recursion","binary","methods"]',
    61.0,
    0,
    0
),

-- 33
(
    'Recursive Factorial',
    'Calculate factorial of n using recursion.',
    'Implement factorial using a recursive method instead of a loop.',
    'PROGRAMMING',
    'Recursion',
    'EASY',
    'APPLY',
    'JAVA',
    'Define factorial(n) as n multiplied by factorial(n-1).',
    '0 <= n <= 20',
    'A single integer n',
    'n!',
    '[{"input":"5","output":"120"},{"input":"0","output":"1"}]',
    '["Base case: factorial(0) = 1."]',
    '["java","recursion","factorial","methods"]',
    87.0,
    0,
    0
),

-- 34
(
    'Recursive Fibonacci',
    'Find the nth Fibonacci number using recursion.',
    'Implement a recursive method that returns the nth Fibonacci number.',
    'PROGRAMMING',
    'Recursion',
    'MEDIUM',
    'UNDERSTAND',
    'JAVA',
    'Use fib(n) = fib(n-1) + fib(n-2).',
    '0 <= n <= 30',
    'A single integer n',
    'The nth Fibonacci number',
    '[{"input":"7","output":"13"},{"input":"10","output":"55"}]',
    '["Base cases are fib(0)=0 and fib(1)=1."]',
    '["java","recursion","fibonacci","methods"]',
    64.0,
    0,
    0
),

-- 35
(
    'Sum of Array Using Recursion',
    'Find the sum of all array elements using recursion.',
    'Write a recursive method that calculates the sum of an integer array.',
    'PROGRAMMING',
    'Recursion',
    'MEDIUM',
    'APPLY',
    'JAVA',
    'Pass the current array index to the recursive method.',
    '1 <= n <= 10000',
    'First line: n\nSecond line: n integers',
    'Sum of elements',
    '[{"input":"5\n1 2 3 4 5","output":"15"}]',
    '["Base case occurs when the index reaches the array length."]',
    '["java","recursion","arrays","methods"]',
    70.0,
    0,
    0
),

-- 36
(
    'Find Maximum in Array',
    'Given an integer array, find its maximum element.',
    'Traverse the array and determine the largest value.',
    'PROGRAMMING',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Maintain a maximum value while traversing.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Maximum element',
    '[{"input":"5\n4 9 2 15 6","output":"15"}]',
    '["Initialize max with the first element."]',
    '["java","arrays","loops","maximum"]',
    94.0,
    0,
    0
),

-- 37
(
    'Find Minimum in Array',
    'Given an integer array, find its minimum element.',
    'Traverse the array and determine the smallest value.',
    'PROGRAMMING',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Maintain a minimum value while traversing.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Minimum element',
    '[{"input":"5\n4 9 2 15 6","output":"2"}]',
    '["Initialize min with the first element."]',
    '["java","arrays","loops","minimum"]',
    94.0,
    0,
    0
),

-- 38
(
    'Reverse an Array',
    'Reverse the elements of an integer array.',
    'Modify the array so that its elements appear in reverse order.',
    'PROGRAMMING',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Use two pointers from the beginning and end.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Reversed array',
    '[{"input":"5\n1 2 3 4 5","output":"5 4 3 2 1"}]',
    '["Swap arr[left] and arr[right] and move both pointers."]',
    '["java","arrays","two-pointers","reversal"]',
    89.0,
    0,
    0
),

-- 39
(
    'Linear Search',
    'Given an array and a target value, find the index of the target.',
    'Search for the first occurrence of the target using linear traversal.',
    'PROGRAMMING',
    'Searching',
    'EASY',
    'APPLY',
    'JAVA',
    'Check every element until the target is found.',
    '1 <= n <= 100000',
    'First line: n and target\nSecond line: n integers',
    'Index of target or -1',
    '[{"input":"5 8\n4 8 2 9 1","output":"1"}]',
    '["Return immediately when the target is found."]',
    '["java","arrays","searching","linear-search"]',
    91.0,
    0,
    0
),

-- 40
(
    'Binary Search',
    'Given a sorted array and a target, find the target index using binary search.',
    'Implement binary search iteratively.',
    'PROGRAMMING',
    'Searching',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Repeatedly divide the search range into two halves.',
    '1 <= n <= 100000. Array is sorted.',
    'First line: n and target\nSecond line: n sorted integers',
    'Index of target or -1',
    '[{"input":"6 7\n1 3 5 7 9 11","output":"3"}]',
    '["Calculate mid and eliminate half of the search range each iteration."]',
    '["java","binary-search","arrays","searching"]',
    76.0,
    0,
    0
),

-- 41
(
    'Sort Array Without Library',
    'Given an integer array, sort it in ascending order without using Arrays.sort().',
    'Implement a basic sorting algorithm manually.',
    'PROGRAMMING',
    'Sorting',
    'MEDIUM',
    'APPLY',
    'JAVA',
    'Selection sort or bubble sort can be used.',
    '1 <= n <= 1000',
    'First line: n\nSecond line: n integers',
    'Sorted array',
    '[{"input":"5\n5 2 4 1 3","output":"1 2 3 4 5"}]',
    '["Try implementing selection sort first."]',
    '["java","arrays","sorting","selection-sort"]',
    72.0,
    0,
    0
),

-- 42
(
    'Bubble Sort',
    'Sort an integer array using bubble sort.',
    'Repeatedly compare adjacent elements and swap them when they are in the wrong order.',
    'PROGRAMMING',
    'Sorting',
    'EASY',
    'UNDERSTAND',
    'JAVA',
    'Implement bubble sort using nested loops.',
    '1 <= n <= 1000',
    'First line: n\nSecond line: n integers',
    'Sorted array',
    '[{"input":"5\n5 1 4 2 8","output":"1 2 4 5 8"}]',
    '["After every pass, the largest remaining element reaches the end."]',
    '["java","sorting","bubble-sort","arrays"]',
    83.0,
    0,
    0
),

-- 43
(
    'Selection Sort',
    'Sort an array using selection sort.',
    'Find the minimum element from the unsorted portion and place it at the beginning.',
    'PROGRAMMING',
    'Sorting',
    'EASY',
    'UNDERSTAND',
    'JAVA',
    'Use nested loops to find the minimum element.',
    '1 <= n <= 1000',
    'First line: n\nSecond line: n integers',
    'Sorted array',
    '[{"input":"5\n64 25 12 22 11","output":"11 12 22 25 64"}]',
    '["Maintain the index of the minimum element."]',
    '["java","sorting","selection-sort","arrays"]',
    85.0,
    0,
    0
),

-- 44
(
    'Insertion Sort',
    'Sort an integer array using insertion sort.',
    'Build the sorted portion of the array one element at a time.',
    'PROGRAMMING',
    'Sorting',
    'MEDIUM',
    'APPLY',
    'JAVA',
    'Shift larger elements and insert the current value into its correct position.',
    '1 <= n <= 1000',
    'First line: n\nSecond line: n integers',
    'Sorted array',
    '[{"input":"5\n12 11 13 5 6","output":"5 6 11 12 13"}]',
    '["Consider the left side sorted while processing each new element."]',
    '["java","sorting","insertion-sort","arrays"]',
    78.0,
    0,
    0
),

-- 45
(
    'Remove Spaces from String',
    'Given a string, remove all whitespace characters from it.',
    'Return a string containing all non-space characters in their original order.',
    'PROGRAMMING',
    'Strings',
    'EASY',
    'APPLY',
    'JAVA',
    'Traverse the string and append non-whitespace characters.',
    '1 <= length <= 100000',
    'A single string',
    'String without spaces',
    '[{"input":"hello world java","output":"helloworldjava"}]',
    '["Use Character.isWhitespace() or check for spaces."]',
    '["java","strings","characters","stringbuilder"]',
    87.0,
    0,
    0
),

-- 46
(
    'Toggle Character Case',
    'Given a string, change lowercase characters to uppercase and uppercase characters to lowercase.',
    'Return the string with every alphabetic character having its case toggled.',
    'PROGRAMMING',
    'Strings',
    'EASY',
    'APPLY',
    'JAVA',
    'Use Character methods to identify and convert character case.',
    '1 <= length <= 100000',
    'A single string',
    'String with toggled case',
    '[{"input":"Java Programming","output":"jAVA pROGRAMMING"}]',
    '["Check Character.isUpperCase() and Character.isLowerCase()."]',
    '["java","strings","characters","case"]',
    84.0,
    0,
    0
),

-- 47
(
    'First Non-Repeating Character',
    'Given a string, find the first character that appears exactly once.',
    'Return the first non-repeating character or -1 if every character repeats.',
    'PROGRAMMING',
    'Strings',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Count frequencies first and then scan the string again.',
    '1 <= length <= 100000',
    'A single string',
    'First non-repeating character or -1',
    '[{"input":"swiss","output":"w"},{"input":"aabb","output":"-1"}]',
    '["Use a frequency array or HashMap."]',
    '["java","strings","hashmap","frequency"]',
    65.0,
    0,
    0
),

-- 48
(
    'Remove Duplicate Characters',
    'Given a string, remove repeated characters while preserving the first occurrence.',
    'Return a string containing only the first occurrence of each character.',
    'PROGRAMMING',
    'Strings',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use a HashSet to track characters already seen.',
    '1 <= length <= 100000',
    'A single string',
    'String with duplicates removed',
    '[{"input":"programming","output":"progamin"}]',
    '["Use a frequency array or HashMap."]',
    '["java","strings","hashset","duplicates"]',
    71.0,
    0,
    0
),

-- 49
(
    'Check String Rotation',
    'Given two strings, determine whether one string is a rotation of the other.',
    'String b is a rotation of string a if it can be obtained by moving characters from one end to the other.',
    'PROGRAMMING',
    'Strings',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'If lengths are equal, check whether b occurs inside a+a.',
    '1 <= string length <= 100000',
    'Two strings',
    'true or false',
    '[{"input":"abcd cdab","output":"true"},{"input":"abcd acbd","output":"false"}]',
    '["Create a+a and search for the second string."]',
    '["java","strings","rotation","string-search"]',
    69.0,
    0,
    0
),

-- 50
(
    'Count Words in a Sentence',
    'Given a sentence, count the number of words it contains.',
    'Words are separated by one or more whitespace characters.',
    'PROGRAMMING',
    'Strings',
    'EASY',
    'APPLY',
    'JAVA',
    'Trim the sentence and split using whitespace.',
    '1 <= sentence length <= 100000',
    'A complete sentence',
    'Number of words',
    '[{"input":"Java is easy to learn","output":"5"},{"input":"Hello World","output":"2"}]',
    '["Handle leading, trailing, and multiple spaces carefully."]',
     '["java","strings","split","whitespace"]',
    90.0,
    0,
    0
);
USE interviewtwin;

INSERT IGNORE INTO coding_questions
(
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
    tags,
    acceptance_rate,
    total_submissions,
    total_accepted
)
VALUES

-- 1
(
    'Two Sum',
    'Given an integer array and a target value, find two distinct elements whose sum equals the target.',
    'Return the indices of the two elements whose values add up to the target.',
    'DSA',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Use a hash map to store previously seen values and their indices.',
    '2 <= n <= 100000',
    'First line: n and target\nSecond line: n integers',
    'Two indices',
    '[{"input":"5 9\n2 7 11 15 3","output":"0 1"}]',
    '["For each value, check whether target - value was already seen."]',
    '["java","arrays","hashing","two-sum"]',
    88.0, 0, 0
),

-- 2
(
    'Contains Duplicate',
    'Given an integer array, determine whether any value appears more than once.',
    'Return true if at least one duplicate exists; otherwise return false.',
    'DSA',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Use a HashSet to track values already encountered.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'true or false',
    '[{"input":"5\n1 2 3 1 5","output":"true"},{"input":"4\n1 2 3 4","output":"false"}]',
    '["If an element is already in the set, a duplicate exists."]',
    '["java","arrays","hashing","set"]',
    91.0, 0, 0
),

-- 3
(
    'Move Zeroes',
    'Given an integer array, move all zero values to the end while maintaining the relative order of non-zero elements.',
    'Modify the array in-place so that all zeroes appear at the end.',
    'DSA',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Use a pointer to place each non-zero element in its correct position.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Modified array',
    '[{"input":"5\n0 1 0 3 12","output":"1 3 12 0 0"}]',
    '["Place non-zero elements from left to right, then fill remaining positions with zeroes."]',
    '["java","arrays","two-pointers","in-place"]',
    86.0, 0, 0
),

-- 4
(
    'Find Missing Number',
    'Given an array containing n distinct numbers from 0 to n, find the missing number.',
    'Return the only number in the range 0 through n that does not appear in the array.',
    'DSA',
    'Arrays',
    'EASY',
    'ANALYZE',
    'JAVA',
    'Use the XOR property or the expected sum of numbers from 0 to n.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'The missing number',
    '[{"input":"3\n3 0 1","output":"2"}]',
    '["XORing equal numbers cancels them because x XOR x = 0."]',
    '["java","arrays","xor","math"]',
    84.0, 0, 0
),

-- 5
(
    'Majority Element',
    'Given an integer array, find the element that appears more than n/2 times.',
    'Return the majority element of the array.',
    'DSA',
    'Arrays',
    'EASY',
    'ANALYZE',
    'JAVA',
    'Use the Boyer-Moore Voting Algorithm.',
    '1 <= n <= 100000. A majority element always exists.',
    'First line: n\nSecond line: n integers',
    'The majority element',
    '[{"input":"7\n2 2 1 1 1 2 2","output":"2"}]',
    '["Maintain a candidate and a count; matching values increase count and different values decrease it."]',
    '["java","arrays","boyer-moore","majority-element"]',
    78.0, 0, 0
),

-- 6
(
    'Maximum Subarray Sum',
    'Given an integer array, find the contiguous subarray with the largest sum.',
    'Return the maximum possible sum of any contiguous subarray.',
    'DSA',
    'Arrays',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use Kadane’s algorithm to maintain the best sum ending at the current position.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Maximum subarray sum',
    '[{"input":"9\n-2 1 -3 4 -1 2 1 -5 4","output":"6"}]',
    '["At each element decide whether to extend the current subarray or start a new one."]',
    '["java","arrays","kadane","dynamic-programming"]',
    74.0, 0, 0
),

-- 7
(
    'Best Time to Buy and Sell Stock',
    'Given daily stock prices, find the maximum profit from one buy and one later sell.',
    'Return the maximum possible profit.',
    'DSA',
    'Arrays',
    'EASY',
    'ANALYZE',
    'JAVA',
    'Track the minimum price seen so far and the best profit.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n prices',
    'Maximum profit',
    '[{"input":"6\n7 1 5 3 6 4","output":"5"}]',
    '["For each price, calculate profit using the minimum price seen before it."]',
    '["java","arrays","greedy","stock"]',
    89.0, 0, 0
),

-- 8
(
    'Intersection of Two Arrays',
    'Given two integer arrays, find the distinct values that appear in both arrays.',
    'Return the intersection of the two arrays without duplicate values.',
    'DSA',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Use sets to store and compare the elements.',
    '1 <= n,m <= 100000',
    'Sizes and elements of two arrays',
    'Distinct common elements',
    '[{"input":"4 5\n1 2 2 1\n2 2 3 4 5","output":"2"}]',
    '["Store one array in a set and check the elements of the other array."]',
    '["java","arrays","hashing","set"]',
    82.0, 0, 0
),

-- 9
(
    'Product of Array Except Self',
    'Given an integer array, return an array where each position contains the product of all elements except itself.',
    'Solve the problem without using division.',
    'DSA',
    'Arrays',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use prefix products and suffix products.',
    '2 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Resulting array',
    '[{"input":"4\n1 2 3 4","output":"24 12 8 6"}]',
    '["Store prefix products first, then multiply by suffix products while traversing backward."]',
    '["java","arrays","prefix","suffix"]',
    69.0, 0, 0
),

-- 10
(
    'Merge Two Sorted Arrays',
    'Given two sorted integer arrays, merge them into one sorted array.',
    'Combine both arrays while preserving sorted order.',
    'DSA',
    'Arrays',
    'EASY',
    'APPLY',
    'JAVA',
    'Use two pointers to compare the current elements of both arrays.',
    '1 <= n,m <= 100000',
    'Two array sizes followed by their sorted elements',
    'One sorted merged array',
    '[{"input":"3 3\n1 3 5\n2 4 6","output":"1 2 3 4 5 6"}]',
    '["Always take the smaller current element and advance its pointer."]',
    '["java","arrays","two-pointers","merge"]',
    87.0, 0, 0
),

-- 11
(
    'Valid Parentheses',
    'Given a string containing brackets, determine whether the brackets are correctly matched.',
    'Every opening bracket must have the correct closing bracket in the correct order.',
    'DSA',
    'Stacks',
    'EASY',
    'ANALYZE',
    'JAVA',
    'Use a stack to store opening brackets.',
    '1 <= length <= 100000',
    'A string containing parentheses, braces, and brackets',
    'true or false',
    '[{"input":"()[]{}","output":"true"},{"input":"([)]","output":"false"}]',
    '["Push opening brackets and match each closing bracket with the stack top."]',
    '["java","stack","strings","parentheses"]',
    90.0, 0, 0
),

-- 12
(
    'Min Stack',
    'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
    'Implement a stack with an additional operation that returns the minimum value.',
    'DSA',
    'Stacks',
    'MEDIUM',
    'CREATE',
    'JAVA',
    'Maintain a second stack containing the minimum value at each level.',
    'Number of operations <= 100000',
    'A sequence of stack operations',
    'Results of requested operations',
    '[{"input":"push 5\npush 3\npush 7\ngetMin","output":"3"}]',
    '["The auxiliary stack should track the minimum after every push."]',
    '["java","stack","design","minimum"]',
    72.0, 0, 0
),

-- 13
(
    'Next Greater Element',
    'For every element in an array, find the first greater element appearing to its right.',
    'Return -1 when no greater element exists.',
    'DSA',
    'Stacks',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use a monotonic stack while traversing from right to left.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Array of next greater elements',
    '[{"input":"4\n4 5 2 25","output":"5 25 25 -1"}]',
    '["Remove stack elements that are smaller than or equal to the current value."]',
    '["java","stack","monotonic-stack","arrays"]',
    68.0, 0, 0
),

-- 14
(
    'Longest Common Prefix',
    'Given an array of strings, find the longest common prefix shared by all strings.',
    'Return the longest prefix that appears at the beginning of every string.',
    'DSA',
    'Strings',
    'EASY',
    'APPLY',
    'JAVA',
    'Compare characters column by column across all strings.',
    '1 <= number of strings <= 200',
    'Number of strings followed by the strings',
    'Longest common prefix',
    '[{"input":"3\nflower\nflow\nflight","output":"fl"}]',
    '["Start with the first string as the prefix and shorten it when necessary."]',
    '["java","strings","prefix","comparison"]',
    88.0, 0, 0
),

-- 15
(
    'Is Subsequence',
    'Given two strings s and t, determine whether s is a subsequence of t.',
    'Characters of s must appear in t in the same order but not necessarily consecutively.',
    'DSA',
    'Strings',
    'EASY',
    'APPLY',
    'JAVA',
    'Use two pointers to scan both strings.',
    '0 <= s.length <= 100000, s.length <= t.length',
    'Two strings',
    'true or false',
    '[{"input":"abc ahbgdc","output":"true"},{"input":"axc ahbgdc","output":"false"}]',
    '["Advance the pointer of s only when its character matches the current character of t."]',
    '["java","strings","two-pointers","subsequence"]',
    92.0, 0, 0
),

-- 16
(
    'Longest Substring Without Repeating Characters',
    'Given a string, find the length of the longest substring without repeated characters.',
    'Return the maximum length of a substring containing no duplicate characters.',
    'DSA',
    'Strings',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use a sliding window with a set or map.',
    '0 <= length <= 100000',
    'A single string',
    'Maximum substring length',
    '[{"input":"abcabcbb","output":"3"},{"input":"bbbbb","output":"1"}]',
    '["Expand the window with the right pointer and move the left pointer when a duplicate appears."]',
    '["java","strings","sliding-window","hashing"]',
    70.0, 0, 0
),

-- 17
(
    'Group Anagrams',
    'Given an array of strings, group strings that are anagrams of each other.',
    'Return groups containing strings with identical character frequencies.',
    'DSA',
    'Hashing',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use a sorted representation or character-frequency key as the hash map key.',
    '1 <= number of strings <= 10000',
    'Number of strings followed by the strings',
    'Groups of anagrams',
    '[{"input":"6\nate eat tea bat tab tan","output":"[ate, eat, tea] [bat, tab] [tan]"}]',
    '["Strings with the same character-frequency signature belong to the same group."]',
    '["java","hashing","strings","anagrams"]',
    63.0, 0, 0
),

-- 18
(
    'Top K Frequent Elements',
    'Given an integer array and an integer k, return the k most frequent elements.',
    'Find the elements with the highest frequencies.',
    'DSA',
    'Hashing',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Count frequencies using a hash map and use buckets or a priority queue.',
    '1 <= n <= 100000, 1 <= k <= number of distinct elements',
    'First line: n and k\nSecond line: n integers',
    'The k most frequent elements',
    '[{"input":"6 2\n1 1 1 2 2 3","output":"1 2"}]',
    '["First build a frequency map, then select elements with the largest counts."]',
    '["java","hashing","heap","frequency"]',
    61.0, 0, 0
),

-- 19
(
    'Merge Intervals',
    'Given a collection of intervals, merge all overlapping intervals.',
    'Return a set of non-overlapping intervals covering the same ranges.',
    'DSA',
    'Arrays',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Sort intervals by starting value and merge overlapping ranges.',
    '1 <= n <= 10000',
    'Number of intervals followed by start and end values',
    'Merged intervals',
    '[{"input":"4\n1 3\n2 6\n8 10\n9 12","output":"[1,6] [8,12]"}]',
    '["After sorting, compare the next start with the current interval end."]',
    '["java","arrays","sorting","intervals"]',
    66.0, 0, 0
),

-- 20
(
    'Search in Rotated Sorted Array',
    'Given a sorted array rotated at an unknown position, search for a target value.',
    'Return the index of the target or -1 if it is not present.',
    'DSA',
    'Searching',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use modified binary search to determine which half is sorted.',
    '1 <= n <= 100000. All values are distinct.',
    'First line: n and target\nSecond line: rotated sorted integers',
    'Target index or -1',
    '[{"input":"7 0\n4 5 6 7 0 1 2","output":"4"}]',
    '["At every step, determine whether the left or right half is sorted."]',
    '["java","arrays","binary-search","rotation"]',
    64.0, 0, 0
),

-- 21
(
    'Find Peak Element',
    'Given an array, find an element that is greater than its neighboring elements.',
    'Return the index of any peak element.',
    'DSA',
    'Searching',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use binary search by comparing the middle element with its right neighbor.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Index of a peak element',
    '[{"input":"4\n1 2 3 1","output":"2"}]',
    '["If nums[mid] < nums[mid+1], a peak must exist on the right side."]',
    '["java","binary-search","arrays","peak"]',
    67.0, 0, 0
),

-- 22
(
    'Implement Stack Using Array',
    'Implement a stack using a fixed-size array.',
    'Support push, pop, peek, and checking whether the stack is empty.',
    'DSA',
    'Stack',
    'EASY',
    'CREATE',
    'JAVA',
    'Maintain a top index to represent the current stack position.',
    '1 <= capacity <= 10000',
    'Stack capacity followed by operations',
    'Results of operations',
    '[{"input":"5\npush 10\npush 20\npeek\npop","output":"20\n20"}]',
    '["top should point to the most recently inserted element."]',
    '["java","stack","array","data-structure"]',
    85.0, 0, 0
),

-- 23
(
    'Implement Queue Using Array',
    'Implement a queue using an array.',
    'Support enqueue, dequeue, peek, and empty operations.',
    'DSA',
    'Queue',
    'EASY',
    'CREATE',
    'JAVA',
    'Maintain front and rear positions to implement FIFO behavior.',
    '1 <= capacity <= 10000',
    'Queue capacity followed by operations',
    'Results of operations',
    '[{"input":"5\nenqueue 10\nenqueue 20\npeek\ndequeue","output":"10\n10"}]',
    '["A queue follows FIFO: the first inserted element is removed first."]',
    '["java","queue","array","data-structure"]',
    83.0, 0, 0
),

-- 24
(
    'Reverse a Linked List',
    'Given the head of a singly linked list, reverse the list.',
    'Return the new head after reversing all links.',
    'DSA',
    'Linked List',
    'EASY',
    'APPLY',
    'JAVA',
    'Use three pointers: previous, current, and next.',
    '0 <= number of nodes <= 100000',
    'Number of nodes followed by node values',
    'Reversed linked list',
    '[{"input":"5\n1 2 3 4 5","output":"5 4 3 2 1"}]',
    '["Save current.next before changing the link to previous."]',
    '["java","linked-list","pointers","reversal"]',
    88.0, 0, 0
),

-- 25
(
    'Detect Cycle in Linked List',
    'Given a singly linked list, determine whether it contains a cycle.',
    'Return true if following next pointers eventually revisits a node.',
    'DSA',
    'Linked List',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use Floyd’s slow and fast pointer algorithm.',
    '0 <= number of nodes <= 100000',
    'Linked list representation',
    'true or false',
    '[{"input":"4\n3 2 0 -4\ncycle=1","output":"true"},{"input":"2\n1 2\ncycle=-1","output":"false"}]',
    '["Move slow one step and fast two steps; if they meet, a cycle exists."]',
    '["java","linked-list","two-pointers","floyd-cycle"]',
    76.0, 0, 0
);
USE interviewtwin;

INSERT IGNORE INTO coding_questions
(
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
    tags,
    acceptance_rate,
    total_submissions,
    total_accepted
)
VALUES

(
    'Binary Tree Inorder Traversal',
    'Given the root of a binary tree, return its inorder traversal.',
    'Visit the nodes of a binary tree in left, root, right order.',
    'DSA',
    'Trees',
    'EASY',
    'APPLY',
    'JAVA',
    'Traverse the left subtree, process the current node, then traverse the right subtree.',
    '0 <= number of nodes <= 100000',
    'Binary tree representation',
    'Inorder traversal',
    '[{"input":"1 null 2 3","output":"1 3 2"}]',
    '["Inorder means left -> root -> right."]',
    '["java","trees","binary-tree","traversal"]',
    89.0, 0, 0
),

(
    'Binary Tree Preorder Traversal',
    'Given the root of a binary tree, return its preorder traversal.',
    'Visit the nodes in root, left, right order.',
    'DSA',
    'Trees',
    'EASY',
    'APPLY',
    'JAVA',
    'Process the root before recursively processing its children.',
    '0 <= number of nodes <= 100000',
    'Binary tree representation',
    'Preorder traversal',
    '[{"input":"1 null 2 3","output":"1 2 3"}]',
    '["Preorder means root -> left -> right."]',
    '["java","trees","binary-tree","traversal"]',
    90.0, 0, 0
),

(
    'Binary Tree Postorder Traversal',
    'Given the root of a binary tree, return its postorder traversal.',
    'Visit the nodes in left, right, root order.',
    'DSA',
    'Trees',
    'EASY',
    'APPLY',
    'JAVA',
    'Process both children before processing the current node.',
    '0 <= number of nodes <= 100000',
    'Binary tree representation',
    'Postorder traversal',
    '[{"input":"1 null 2 3","output":"3 2 1"}]',
    '["Postorder means left -> right -> root."]',
    '["java","trees","binary-tree","traversal"]',
    89.0, 0, 0
),

(
    'Maximum Depth of Binary Tree',
    'Given a binary tree, find its maximum depth.',
    'Return the number of nodes along the longest path from the root to a leaf.',
    'DSA',
    'Trees',
    'EASY',
    'APPLY',
    'JAVA',
    'The depth is one plus the maximum depth of the left and right subtrees.',
    '0 <= number of nodes <= 100000',
    'Binary tree representation',
    'Maximum depth',
    '[{"input":"3 9 20 null null 15 7","output":"3"}]',
    '["For each node, calculate 1 + max(leftDepth, rightDepth)."]',
    '["java","trees","binary-tree","recursion"]',
    91.0, 0, 0
),

(
    'Count Nodes in Binary Tree',
    'Given the root of a binary tree, count the total number of nodes.',
    'Return the number of nodes present in the binary tree.',
    'DSA',
    'Trees',
    'EASY',
    'APPLY',
    'JAVA',
    'Recursively count nodes in both subtrees.',
    '0 <= number of nodes <= 100000',
    'Binary tree representation',
    'Number of nodes',
    '[{"input":"1 2 3 4 5","output":"5"}]',
    '["Count the current node plus nodes in both subtrees."]',
    '["java","trees","binary-tree","recursion"]',
    93.0, 0, 0
),

(
    'Same Binary Tree',
    'Given two binary trees, determine whether they are structurally identical and contain the same values.',
    'Return true if both trees are the same; otherwise return false.',
    'DSA',
    'Trees',
    'EASY',
    'ANALYZE',
    'JAVA',
    'Compare corresponding nodes recursively.',
    '0 <= number of nodes <= 100000',
    'Two binary trees',
    'true or false',
    '[{"input":"1 2 3 | 1 2 3","output":"true"}]',
    '["Both nodes must have equal values and matching left and right subtrees."]',
    '["java","trees","binary-tree","recursion"]',
    87.0, 0, 0
),

(
    'Symmetric Binary Tree',
    'Given a binary tree, determine whether it is symmetric around its center.',
    'Return true if the left and right subtrees are mirror images.',
    'DSA',
    'Trees',
    'EASY',
    'ANALYZE',
    'JAVA',
    'Compare the left subtree of one node with the right subtree of the other.',
    '1 <= number of nodes <= 100000',
    'Binary tree representation',
    'true or false',
    '[{"input":"1 2 2 3 4 4 3","output":"true"}]',
    '["Mirror comparison swaps the left and right children."]',
    '["java","trees","binary-tree","recursion"]',
    84.0, 0, 0
),

(
    'Lowest Common Ancestor of Binary Tree',
    'Given a binary tree and two nodes, find their lowest common ancestor.',
    'Return the deepest node that has both given nodes in its subtree.',
    'DSA',
    'Trees',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Search both subtrees recursively and combine the results.',
    '2 <= number of nodes <= 100000',
    'Binary tree and two target values',
    'Lowest common ancestor',
    '[{"input":"3 5 1 6 2 0 8 null null 7 4 | 5 1","output":"3"}]',
    '["If one target is found in each subtree, the current node is the ancestor."]',
    '["java","trees","binary-tree","lca"]',
    72.0, 0, 0
),

(
    'Binary Tree Right Side View',
    'Given a binary tree, return the values visible when viewing the tree from the right side.',
    'Return the rightmost node at every tree level.',
    'DSA',
    'Trees',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use level-order traversal and record the last node of each level.',
    '0 <= number of nodes <= 100000',
    'Binary tree representation',
    'Right side view',
    '[{"input":"1 2 3 null 5 null 4","output":"1 3 4"}]',
    '["The last node processed at each level is visible from the right."]',
    '["java","trees","bfs","binary-tree"]',
    75.0, 0, 0
),

(
    'Diameter of Binary Tree',
    'Given a binary tree, find the length of the longest path between any two nodes.',
    'Return the diameter measured as the number of edges in the longest path.',
    'DSA',
    'Trees',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Calculate subtree heights and update the maximum diameter.',
    '1 <= number of nodes <= 100000',
    'Binary tree representation',
    'Diameter',
    '[{"input":"1 2 3 4 5","output":"3"}]',
    '["At every node, a possible diameter is leftHeight + rightHeight."]',
    '["java","trees","binary-tree","recursion"]',
    70.0, 0, 0
),

(
    'Kth Smallest Element in BST',
    'Given a binary search tree, find the kth smallest element.',
    'Return the value that appears in the kth position of inorder traversal.',
    'DSA',
    'Trees',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Inorder traversal of a BST visits values in sorted order.',
    '1 <= k <= number of nodes <= 100000',
    'BST and integer k',
    'Kth smallest value',
    '[{"input":"3 1 4 null 2 | 1","output":"1"}]',
    '["Perform inorder traversal and count visited nodes."]',
    '["java","bst","trees","inorder"]',
    68.0, 0, 0
),

(
    'Heap Sort',
    'Given an integer array, sort it using heap sort.',
    'Build a heap and repeatedly move the largest element to its final position.',
    'DSA',
    'Heaps',
    'MEDIUM',
    'APPLY',
    'JAVA',
    'Build a max heap and repeatedly perform heapify.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: n integers',
    'Sorted array',
    '[{"input":"5\n4 10 3 5 1","output":"1 3 4 5 10"}]',
    '["Build a max heap before repeatedly extracting the maximum."]',
    '["java","heap","sorting","arrays"]',
    67.0, 0, 0
),

(
    'Kth Smallest Element in an Array',
    'Given an unsorted integer array, find the kth smallest element.',
    'Return the element that would appear at position k after sorting.',
    'DSA',
    'Heaps',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use a max heap of size k or another selection technique.',
    '1 <= k <= n <= 100000',
    'First line: n and k\nSecond line: n integers',
    'Kth smallest element',
    '[{"input":"6 3\n7 10 4 3 20 15","output":"7"}]',
    '["Maintain only the k smallest values using a heap."]',
    '["java","heap","arrays","selection"]',
    71.0, 0, 0
),

(
    'Merge K Sorted Arrays',
    'Given k sorted arrays, merge them into one sorted array.',
    'Combine all sorted arrays while preserving ascending order.',
    'DSA',
    'Heaps',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use a min heap containing the current smallest element from each array.',
    '1 <= total elements <= 100000',
    'Number of arrays followed by sorted arrays',
    'Merged sorted array',
    '[{"input":"3\n1 4 7\n2 5 8\n3 6 9","output":"1 2 3 4 5 6 7 8 9"}]',
    '["Keep one candidate from each array in the min heap."]',
    '["java","heap","priority-queue","arrays"]',
    65.0, 0, 0
),

(
    'Implement Min Heap',
    'Implement a min heap supporting insertion and extraction of the minimum value.',
    'Maintain the heap property after every operation.',
    'DSA',
    'Heaps',
    'MEDIUM',
    'CREATE',
    'JAVA',
    'Use an array and bubble elements upward or downward as needed.',
    '1 <= number of operations <= 100000',
    'A sequence of heap operations',
    'Results of extraction operations',
    '[{"input":"insert 5\ninsert 2\ninsert 8\nextractMin","output":"2"}]',
    '["For an element at index i, its children are at 2*i+1 and 2*i+2."]',
    '["java","heap","priority-queue","data-structure"]',
    73.0, 0, 0
),

(
    'Generate Parentheses',
    'Given n pairs of parentheses, generate all combinations of well-formed parentheses.',
    'Return every valid arrangement containing exactly n opening and n closing parentheses.',
    'DSA',
    'Backtracking',
    'MEDIUM',
    'CREATE',
    'JAVA',
    'Use backtracking while tracking the number of open and closed parentheses.',
    '1 <= n <= 8',
    'A single integer n',
    'All valid combinations',
    '[{"input":"3","output":"((())) (()()) (())() ()(()) ()()()"}]',
    '["Never add a closing parenthesis if it would make closing count greater than opening count."]',
    '["java","backtracking","recursion","parentheses"]',
    66.0, 0, 0
),

(
    'Subsets',
    'Given an integer array, return all possible subsets.',
    'Generate the power set of the given array.',
    'DSA',
    'Backtracking',
    'MEDIUM',
    'CREATE',
    'JAVA',
    'At every element, choose whether to include it or exclude it.',
    '1 <= n <= 15',
    'First line: n\nSecond line: n integers',
    'All subsets',
    '[{"input":"3\n1 2 3","output":"[] [1] [2] [3] [1,2] [1,3] [2,3] [1,2,3]"}]',
    '["Each element creates two choices: include or skip."]',
    '["java","backtracking","recursion","arrays"]',
    74.0, 0, 0
),

(
    'Combination Sum',
    'Given an array of distinct positive integers and a target, find combinations whose values sum to the target.',
    'Each candidate number may be selected multiple times.',
    'DSA',
    'Backtracking',
    'MEDIUM',
    'CREATE',
    'JAVA',
    'Use recursive backtracking and reduce the remaining target.',
    '1 <= n <= 30, target <= 100',
    'Array of candidates and target',
    'All valid combinations',
    '[{"input":"4 7\n2 3 6 7","output":"[2,2,3] [7]"}]',
    '["Continue with the same candidate when repeated use is allowed."]',
    '["java","backtracking","recursion","arrays"]',
    62.0, 0, 0
),

(
    'N-Queens',
    'Place n queens on an n x n chessboard so that no two queens attack each other.',
    'Return the number of valid arrangements.',
    'DSA',
    'Backtracking',
    'HARD',
    'CREATE',
    'JAVA',
    'Place one queen per row and check columns and diagonals.',
    '1 <= n <= 14',
    'A single integer n',
    'Number of valid solutions',
    '[{"input":"4","output":"2"}]',
    '["Track occupied columns and both diagonal directions."]',
    '["java","backtracking","recursion","n-queens"]',
    54.0, 0, 0
),

(
    'Number of Islands',
    'Given a grid containing land and water, count the number of connected islands.',
    'An island consists of horizontally or vertically connected land cells.',
    'DSA',
    'Graphs',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use DFS or BFS to visit every connected group of land cells.',
    '1 <= rows, columns <= 300',
    'Grid of 0 and 1 values',
    'Number of islands',
    '[{"input":"3 4\n1 1 0 0\n1 0 0 1\n0 0 1 1","output":"3"}]',
    '["When an unvisited land cell is found, start a traversal and count one island."]',
    '["java","graphs","dfs","bfs","grid"]',
    77.0, 0, 0
),

(
    'Flood Fill',
    'Given an image grid, replace the color of a connected region starting from a given cell.',
    'Change the starting cell and all connected cells with the same original color.',
    'DSA',
    'Graphs',
    'EASY',
    'APPLY',
    'JAVA',
    'Use DFS or BFS to explore four neighboring cells.',
    '1 <= rows, columns <= 100',
    'Grid, starting row, starting column, and new color',
    'Modified grid',
    '[{"input":"2 3\n1 1 1\n1 1 0\n0 0 2","output":"2 2 2\n2 2 0"}]',
    '["Only visit neighbors having the original starting color."]',
    '["java","graphs","dfs","bfs","grid"]',
    83.0, 0, 0
),

(
    'Graph BFS Traversal',
    'Given an undirected graph and a starting vertex, perform breadth-first traversal.',
    'Visit vertices level by level starting from the given vertex.',
    'DSA',
    'Graphs',
    'EASY',
    'APPLY',
    'JAVA',
    'Use a queue and a visited array.',
    '1 <= vertices <= 100000',
    'Number of vertices, edges, and adjacency information',
    'BFS traversal order',
    '[{"input":"5 4\n0 1\n0 2\n1 3\n2 4\n0","output":"0 1 2 3 4"}]',
    '["Mark a vertex visited when adding it to the queue."]',
    '["java","graphs","bfs","queue"]',
    86.0, 0, 0
),

(
    'Graph DFS Traversal',
    'Given an undirected graph and a starting vertex, perform depth-first traversal.',
    'Visit vertices by exploring as deeply as possible before backtracking.',
    'DSA',
    'Graphs',
    'EASY',
    'APPLY',
    'JAVA',
    'Use recursion or an explicit stack with a visited array.',
    '1 <= vertices <= 100000',
    'Number of vertices, edges, and adjacency information',
    'DFS traversal order',
    '[{"input":"5 4\n0 1\n0 2\n1 3\n2 4\n0","output":"0 1 3 2 4"}]',
    '["Mark each vertex visited before exploring its neighbors."]',
    '["java","graphs","dfs","stack"]',
    85.0, 0, 0
),

(
    'Shortest Path in Unweighted Graph',
    'Given an unweighted graph and two vertices, find the shortest number of edges between them.',
    'Return the minimum number of edges required to reach the destination.',
    'DSA',
    'Graphs',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Use BFS because every edge has equal weight.',
    '1 <= vertices <= 100000',
    'Number of vertices, edges, source, destination, and edges',
    'Shortest distance or -1',
    '[{"input":"5 4 0 4\n0 1\n1 2\n2 4\n0 3","output":"3"}]',
    '["BFS visits vertices in increasing distance from the source."]',
    '["java","graphs","bfs","shortest-path"]',
    69.0, 0, 0
),

(
    'House Robber II',
    'Given houses arranged in a circle, find the maximum money that can be robbed without robbing adjacent houses.',
    'The first and last houses are also considered adjacent.',
    'DSA',
    'Dynamic Programming',
    'MEDIUM',
    'ANALYZE',
    'JAVA',
    'Solve two linear cases: exclude the first house or exclude the last house.',
    '1 <= n <= 100000',
    'First line: n\nSecond line: money in each house',
    'Maximum amount',
    '[{"input":"4\n2 3 2 3","output":"6"}]',
    '["Because the houses form a circle, first and last cannot both be selected."]',
    '["java","dynamic-programming","arrays","house-robber"]',
    63.0, 0, 0
);
-- ============================================
-- Add more questions to reach 50+ total
-- ============================================

INSERT INTO coding_questions (title, question_text, problem_statement, category, difficulty_level, blooms_level, language, description, constraints, input_format, output_format, examples, hints, tags, acceptance_rate, total_submissions, total_accepted) VALUES
('Contains Duplicate', 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.', 'Check for duplicates using set or sorting.', 'Arrays', 'EASY', 'APPLY', 'JAVA', 'Use hash set to detect duplicates', '1 <= nums.length <= 10^5', 'First line: n\nSecond line: n integers', 'true or false', '[{"input": "3\n1 2 3 1", "output": "true"}]', '["Use HashSet", "Or sort and check adjacent"]', '["array", "hash-table"]', 58.3, 2200, 1283),
('Best Time to Buy and Sell Stock', 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Find the maximum profit you can achieve.', 'Track minimum price and maximum profit.', 'Arrays', 'EASY', 'APPLY', 'JAVA', 'Single pass to track min and max profit', '1 <= prices.length <= 10^5', 'First line: n\nSecond line: n prices', 'Single integer (max profit)', '[{"input": "6\n7 1 5 3 6 4", "output": "5"}]', '["Track min price so far", "Calculate profit at each day"]', '["array", "dynamic-programming"]', 55.2, 2400, 1325),
('Product of Array Except Self', 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].', 'Calculate product without division using prefix and suffix products.', 'Arrays', 'MEDIUM', 'ANALYZE', 'JAVA', 'Two-pass solution with O(1) extra space', '2 <= nums.length <= 10^5', 'First line: n\nSecond line: n integers', 'n integers (products)', '[{"input": "4\n1 2 3 4", "output": "24 12 8 6"}]', '["Left pass then right pass", "Use output array to store intermediate results"]', '["array", "prefix-sum"]', 62.1, 1900, 1180),
('Container With Most Water', 'You are given an integer array height of length n. Find two lines that together with the x-axis form a container that holds the most water.', 'Two-pointer technique to maximize area.', 'Arrays', 'MEDIUM', 'ANALYZE', 'JAVA', 'Two pointers from both ends', 'n == height.length, 2 <= n <= 10^5', 'First line: n\nSecond line: n heights', 'Single integer (max area)', '[{"input": "9\n1 8 6 2 5 4 8 3 7", "output": "49"}]', '["Two pointers from both ends", "Move pointer with smaller height", "Area = min(height[left], height[right]) * width"]', '["array", "two-pointers", "greedy"]', 52.8, 2100, 1109),
('3Sum', 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.', 'Find all unique triplets that sum to zero.', 'Arrays', 'MEDIUM', 'ANALYZE', 'JAVA', 'Sort and use two pointers for each element', '3 <= nums.length <= 3000', 'First line: n\nSecond line: n integers', 'Triplets that sum to 0', '[{"input": "6\n-1 0 1 2 -1 -4", "output": "[[-1,-1,2],[-1,0,1]]"}]', '["Sort array first", "For each i, use two pointers for j and k", "Skip duplicates"]', '["array", "two-pointers", "sorting"]', 32.1, 3100, 995),
('Letter Combinations of a Phone Number', 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.', 'Backtracking to generate all combinations.', 'Backtracking', 'MEDIUM', 'CREATE', 'JAVA', 'Map digits to letters and backtrack', '0 <= digits.length <= 4', 'Single string (digits)', 'All combinations', '[{"input": "23", "output": "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]"}]', '["Create digit to letters mapping", "Backtrack for each digit", "Base case: processed all digits"]', '["hash-table", "string", "backtracking"]', 58.4, 1800, 1051),
('Combination Sum', 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target.', 'Backtracking to find all combinations that sum to target. Same number can be used multiple times.', 'Backtracking', 'MEDIUM', 'CREATE', 'JAVA', 'Backtrack with index to allow reuse', '1 <= candidates.length <= 30, 2 <= candidates[i] <= 40', 'First line: n and target\nSecond line: n integers', 'All combinations', '[{"input": "3 7\n2 3 6 7", "output": "[[2,2,3],[7]]"}]', '["Sort candidates", "Backtrack with current index (not i+1)", "Track remaining target"]', '["array", "backtracking"]', 65.2, 1600, 1043),
('Word Search', 'Given an m x n grid of characters board and a string word, return true if word exists in the grid.', 'DFS backtracking in 2D grid to find word.', 'Backtracking', 'MEDIUM', 'ANALYZE', 'JAVA', 'DFS with backtracking in grid', 'm == board.length, n == board[i].length', 'First line: m n\nNext m lines: n characters\nThen: word', 'true or false', '[{"input": "3 4\nABCE\nSFCS\nADEE\nABCCED", "output": "true"}]', '["DFS from each cell matching first char", "Mark visited, backtrack on failure", "Check all 4 directions"]', '["array", "backtracking", "matrix"]', 42.5, 2000, 851),
('House Robber', 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. You cannot rob adjacent houses.', 'DP: dp[i] = max(dp[i-1], dp[i-2] + nums[i])', 'Dynamic Programming', 'MEDIUM', 'ANALYZE', 'JAVA', 'Classic house robber DP', '1 <= nums.length <= 100', 'First line: n\nSecond line: n integers', 'Single integer (max money)', '[{"input": "4\n1 2 3 1", "output": "4"}]', '["DP: rob or skip current house", "dp[i] = max(dp[i-1], dp[i-2] + nums[i])", "Can optimize to O(1) space"]', '["array", "dynamic-programming"]', 52.3, 1800, 941),
('Maximum Product Subarray', 'Given an integer array nums, find a subarray that has the largest product, and return the product.', 'Track both max and min products due to negative numbers.', 'Dynamic Programming', 'MEDIUM', 'ANALYZE', 'JAVA', 'Track max and min at each position', '1 <= nums.length <= 2 * 10^4', 'First line: n\nSecond line: n integers', 'Single integer (max product)', '[{"input": "5\n2 3 -2 4", "output": "6"}]', '["Track both max and min products", "Negative number flips max and min", "Consider zero resets"]', '["array", "dynamic-programming"]', 33.5, 1900, 637),
('Decode Ways', 'A message containing letters from A-Z can be encoded into numbers. Given a string of digits, count the number of ways to decode it.', 'DP with multiple cases: single digit, two digits.', 'Dynamic Programming', 'MEDIUM', 'ANALYZE', 'JAVA', 'DP with careful handling of edge cases', '1 <= s.length <= 100', 'Single string of digits', 'Single integer (number of ways)', '[{"input": "12", "output": "2", "explanation": "AB (1 2) or L (12)"}]', '["dp[i] depends on dp[i-1] and dp[i-2]", "Check if single digit is valid (1-9)", "Check if two digits form valid number (10-26)"]', '["string", "dynamic-programming"]', 28.4, 2100, 596),
('Unique Paths', 'There is a robot on an m x n grid. The robot starts at the top-left corner and tries to reach the bottom-right corner. The robot can only move down or right.', 'DP: dp[i][j] = dp[i-1][j] + dp[i][j-1]', 'Dynamic Programming', 'MEDIUM', 'APPLY', 'JAVA', 'Grid DP with combinatorial solution', '1 <= m, n <= 100', 'First line: m n', 'Single integer (number of paths)', '[{"input": "3 7", "output": "28"}]', '["DP: paths[i][j] = paths[i-1][j] + paths[i][j-1]", "Or use combinatorics: (m+n-2) choose (m-1)", "Can optimize to O(min(m,n)) space"]', '["math", "dynamic-programming", "combinatorics"]', 62.5, 1700, 1063),
('Longest Palindromic Substring', 'Given a string s, return the longest palindromic substring in s.', 'Expand around center or DP approach.', 'Strings', 'MEDIUM', 'ANALYZE', 'JAVA', 'Expand around each possible center', '1 <= s.length <= 1000', 'Single string', 'Longest palindromic substring', '[{"input": "babad", "output": "bab"}]', '["Expand around each center", "2n-1 centers (odd and even length)", "Or use Manacher algorithm for O(n)"]', '["string", "dynamic-programming"]', 31.8, 2500, 795),
('Wildcard Matching', 'Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for ? and *.', 'DP or greedy approach for pattern matching.', 'Greedy', 'HARD', 'EVALUATE', 'JAVA', 'Pattern matching with wildcards', 's length <= 2000, p length <= 2000', 'Two lines: string and pattern', 'true or false', '[{"input": "aa\na?", "output": "true"}]', '["? matches single char, * matches any sequence", "DP or greedy with backtracking", "Consider edge cases with multiple *"]', '["string", "dynamic-programming", "greedy"]', 28.2, 1400, 395),
('Trapping Rain Water', 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.', 'Two-pointer approach tracking left and right max.', 'Arrays', 'HARD', 'ANALYZE', 'JAVA', 'Two pointers with left and right max tracking', 'n == height.length, 1 <= n <= 2 * 10^4', 'First line: n\nSecond line: n heights', 'Single integer (trapped water)', '[{"input": "12\n0 1 0 2 1 0 1 3 2 1 2 1", "output": "6"}]', '["Track left_max and right_max", "Water at i = min(left_max, right_max) - height[i]", "Move pointer with smaller max"]', '["array", "two-pointers", "dynamic-programming", "stack"]', 58.3, 2200, 1282),
('Median of Two Sorted Arrays', 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.', 'Binary search on smaller array to find partition.', 'Binary Search', 'HARD', 'ANALYZE', 'JAVA', 'Binary search on partition', 'nums1.length <= 1000', 'First line: m n\nSecond line: m integers\nThird line: n integers', 'Median value', '[{"input": "2 1\n1 3\n2", "output": "2.0"}]', '["Binary search on smaller array", "Find correct partition", "Handle odd and even total lengths"]', '["array", "binary-search", "divide-and-conquer"]', 35.2, 1800, 634),
('Regular Expression Matching', 'Given an input string s and a pattern p, implement regular expression matching with support for . and *.', 'Complex DP with pattern matching.', 'Dynamic Programming', 'HARD', 'EVALUATE', 'JAVA', '2D DP for pattern matching', '1 <= s.length <= 20, 1 <= p.length <= 30', 'Two lines: string and pattern', 'true or false', '[{"input": "aa\na*", "output": "true"}]', '["DP[i][j] depends on characters and next pattern char", "Handle * specially (zero or more)", "Consider empty string cases"]', '["string", "dynamic-programming", "recursion"]', 28.5, 1600, 456);

-- Success message
SELECT CONCAT('Total coding questions inserted: ', COUNT(*), ' questions') AS message
FROM coding_questions;