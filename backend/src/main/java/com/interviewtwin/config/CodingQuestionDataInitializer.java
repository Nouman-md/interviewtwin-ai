package com.interviewtwin.config;

import com.interviewtwin.entity.CodingQuestion;
import com.interviewtwin.repository.CodingQuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds the coding_questions table with sample coding challenges.
 *
 * Root cause this fixes: application.properties uses ddl-auto=update which
 * creates tables but does NOT seed data. The coding_questions table was empty,
 * so codingAPI.getRandomQuestions(50) returned [] -> the CodingRound page
 * showed "Failed to load coding challenges" / "No questions found".
 *
 * Seeding is idempotent: questions are only inserted if the table is empty.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Order(3)
public class CodingQuestionDataInitializer implements CommandLineRunner {

    private final CodingQuestionRepository codingQuestionRepository;

    @Override
    public void run(String... args) {
System.out.println("RUN METHOD STARTED");

long dsaCount = codingQuestionRepository.countByQuestionType(
    CodingQuestion.QuestionType.DSA
);

long programmingCount = codingQuestionRepository.countByQuestionType(
    CodingQuestion.QuestionType.PROGRAMMING
);

log.info("Coding question counts: DSA={}, PROGRAMMING={}",
    dsaCount, programmingCount);

        log.info("Seeding coding questions...");
        List<CodingQuestion> questions = List.of(
            codingQuestion("Two Sum",
                "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
              CodingQuestion.QuestionType.DSA, "Arrays", CodingQuestion.DifficultyLevel.EASY, CodingQuestion.BloomsLevel.APPLY,
                "Find two numbers in an array that sum to a target value and return their indices.",
                "2 <= nums.length <= 10^4, -10^9 <= nums[i] <= 10^9, -10^9 <= target <= 10^9",
                "{\"input\": \"4\\n2 7 11 15\\n9\", \"output\": \"0 1\"}",
                "[\"Use a hash map to store values and their indices\", \"Consider the time complexity\"]",
                "[\"array\", \"hash-table\", \"two-pointer\"]"),
            codingQuestion("Maximum Subarray",
                "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
                "Find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.",
                CodingQuestion.QuestionType.DSA, "Arrays", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.APPLY,
                "Find the maximum sum of a contiguous subarray.",
                "1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4",
                "{\"input\": \"8\\n-2 1 -3 4 -1 2 1 -5 4\", \"output\": \"6\"}",
                "[\"Use Kadane's algorithm\", \"Handle all-negative arrays\"]",
                "[\"array\", \"dynamic-programming\", \"divide-and-conquer\"]"),
            codingQuestion("Valid Parentheses",
                "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
                "An input string is valid if open brackets are closed by the same type of brackets and in the correct order.",
              CodingQuestion.QuestionType.DSA,  "Strings", CodingQuestion.DifficultyLevel.EASY, CodingQuestion.BloomsLevel.APPLY,
                "Check if a string of brackets is well-formed.",
                "1 <= s.length <= 10^4, s consists of parentheses only",
                "{\"input\": \"()[]{}\", \"output\": \"true\"}",
                "[\"Use a stack data structure\", \"Map closing brackets to opening brackets\"]",
                "[\"string\", \"stack\"]"),
            codingQuestion("Reverse Linked List",
                "Given the head of a singly linked list, reverse the list, and return the reversed list.",
                "Reverse a singly linked list. The reversal should be done in-place.",
                CodingQuestion.QuestionType.DSA, "Linked Lists", CodingQuestion.DifficultyLevel.EASY, CodingQuestion.BloomsLevel.APPLY,
                "Reverse a singly linked list.",
                "The number of nodes in the list is in the range [0, 5000]",
                "{\"input\": \"1->2->3->4->5\", \"output\": \"5->4->3->2->1\"}",
                "[\"Use three pointers\", \"Iterative approach\"]",
                "[\"linked-list\", \"recursion\"]"),
            codingQuestion("Binary Tree Level Order Traversal",
                "Given the root of a binary tree, return the level order traversal of its nodes' values.",
                "Traverse the binary tree level by level from left to right and return the values at each level.",
             CodingQuestion.QuestionType.DSA,   "Trees", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.ANALYZE,
                "Perform a BFS level-order traversal of a binary tree.",
                "The number of nodes in the tree is in the range [0, 2000], -1000 <= Node.val <= 1000",
                "{\"input\": \"[3,9,20,null,null,15,7]\", \"output\": \"[[3],[9,20],[15,7]]\"}",
                "[\"Use a queue for BFS\", \"Process nodes level by level\"]",
                "[\"tree\", \"breadth-first-search\", \"binary-tree\"]"),
            codingQuestion("Clone Graph",
                "Given a reference of a node in a connected undirected graph, return a deep copy of the graph.",
                "Return a deep copy (clone) of the graph. Each node in the graph contains a value and a list of its neighbors.",
                CodingQuestion.QuestionType.DSA, "Graphs", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.ANALYZE,
                "Clone an undirected graph using BFS/DFS with a hash map.",
                "The number of nodes in the graph is in the range [0, 100]",
                "{\"input\": \"adjList = [[2,4],[1,3],[2,4],[1,3]]\", \"output\": \"[[2,4],[1,3],[2,4],[1,3]]\"}",
                "[\"Use a hash map to track cloned nodes\", \"Use BFS or DFS traversal\"]",
                "[\"graph\", \"depth-first-search\", \"breadth-first-search\"]"),
            codingQuestion("Climbing Stairs",
                "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
                "Count the number of distinct ways to reach the top of a staircase with n steps, where you can take 1 or 2 steps at a time.",
            CodingQuestion.QuestionType.DSA,    "Dynamic Programming", CodingQuestion.DifficultyLevel.EASY, CodingQuestion.BloomsLevel.APPLY,
                "Count distinct ways to climb n stairs taking 1 or 2 steps at a time (Fibonacci).",
                "1 <= n <= 45",
                "{\"input\": \"2\", \"output\": \"2\"}",
                "[\"The answer is the n-th Fibonacci number\", \"Use DP with memoization\"]",
                "[\"math\", \"dynamic-programming\", \"memoization\"]"),
            codingQuestion("Permutations",
                "Given an array nums of distinct integers, return all the possible permutations.",
                "Return all possible permutations of the given array. The answer can be returned in any order.",
                CodingQuestion.QuestionType.DSA, "Backtracking", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.CREATE,
                "Generate all permutations of an array of distinct integers.",
                "1 <= nums.length <= 6, -10 <= nums[i] <= 10, all integers are unique",
                "{\"input\": \"[1,2,3]\", \"output\": \"[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\"}",
                "[\"Use backtracking with a visited array\", \"Swap-based approach\"]",
                "[\"array\", \"backtracking\"]"),
            codingQuestion("Coin Change",
                "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount.",
                "Determine the minimum number of coins needed to make up a given amount. Return -1 if the amount cannot be made up.",
              CodingQuestion.QuestionType.DSA,  "Dynamic Programming", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.ANALYZE,
                "Find the minimum number of coins to make a given amount using unlimited coins.",
                "1 <= coins.length <= 12, 1 <= coins[i] <= 2^31 - 1, 0 <= amount <= 10^4",
                "{\"input\": \"coins = [1,2,5], amount = 11\", \"output\": \"3\"}",
                "[\"Think bottom-up DP\", \"dp[i] = min coins to make amount i\"]",
                "[\"array\", \"dynamic-programming\", \"breadth-first-search\"]"),
            codingQuestion("Longest Substring Without Repeating Characters",
                "Given a string s, find the length of the longest substring without repeating characters.",
                "Find the length of the longest substring that contains no repeating characters.",
              CodingQuestion.QuestionType.DSA,  "Strings", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.APPLY,
                "Find the longest substring without repeating characters using a sliding window.",
                "0 <= s.length <= 5 * 10^4, s consists of English letters, digits, symbols and spaces",
                "{\"input\": \"abcabcbb\", \"output\": \"3\"}",
                "[\"Use a sliding window with a hash set\", \"Track left and right pointers\"]",
                "[\"hash-table\", \"string\", \"sliding-window\"]"),
            codingQuestion("Merge Intervals",
                "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals.",
                "Merge all overlapping intervals and return an array of the non-overlapping intervals that cover all the intervals in the input.",
              CodingQuestion.QuestionType.DSA,  "Arrays", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.ANALYZE,
                "Merge all overlapping intervals.",
                "1 <= intervals.length <= 10^4, intervals[i].length == 2, 0 <= starti <= endi <= 10^4",
                "{\"input\": \"[[1,3],[2,6],[8,10],[15,18]]\", \"output\": \"[[1,6],[8,10],[15,18]]\"}",
                "[\"Sort intervals by start time\", \"Merge if current.start <= previous.end\"]",
                "[\"array\", \"sorting\", \"interval\"]"),
            codingQuestion("Word Search",
                "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
                "The word can be constructed from letters of sequentially adjacent cells (horizontal or vertical). The same letter cell may not be used more than once.",
             CodingQuestion.QuestionType.DSA,   "Backtracking", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.CREATE,
                "Check if a word exists in a 2D character grid.",
                "m == board.length, n == board[i].length, 1 <= m, n <= 6, 1 <= word.length <= 15",
                "{\"input\": \"board = [[\\\"A\\\",\\\"B\\\",\\\"C\\\",\\\"E\\\"],[\\\"S\\\",\\\"F\\\",\\\"C\\\",\\\"S\\\"],[\\\"A\\\",\\\"D\\\",\\\"E\\\",\\\"E\\\"]], word = \\\"ABCCED\\\"\", \"output\": \"true\"}",
                "[\"Use DFS with backtracking\", \"Mark visited cells\"]",
                "[\"array\", \"backtracking\", \"matrix\"]"),
            codingQuestion("LRU Cache",
                "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.",
                "Implement LRUCache with get and put methods. When the cache reaches capacity, evict the least recently used key.",
               CodingQuestion.QuestionType.DSA, "Design", CodingQuestion.DifficultyLevel.HARD, CodingQuestion.BloomsLevel.CREATE,
                "Implement an LRU Cache with O(1) get and put operations.",
                "1 <= capacity <= 3000, 0 <= key <= 10^4",
                "{\"input\": \"[\\\"LRUCache\\\",\\\"put\\\",\\\"get\\\",\\\"put\\\",\\\"get\\\",\\\"put\\\",\\\"get\\\",\\\"get\\\"]\", \"output\": \"[null,null,1,null,-1,null,-1,3]\"}",
                "[\"Use a hash map + doubly linked list\", \"Move accessed nodes to front\"]",
                "[\"hash-table\", \"linked-list\", \"design\", \"doubly-linked-list\"]"),
            codingQuestion("Kth Largest Element in an Array",
                "Given an integer array nums and an integer k, return the kth largest element in the array.",
                "Find the kth largest element without necessarily sorting the entire array.",
              CodingQuestion.QuestionType.DSA,  "Sorting", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.ANALYZE,
                "Find the kth largest element in an unsorted array.",
                "1 <= k <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4",
                "{\"input\": \"[3,2,1,5,6,4], k = 2\", \"output\": \"5\"}",
                "[\"Use a min-heap of size k\", \"Use QuickSelect algorithm\"]",
                "[\"array\", \"divide-and-conquer\", \"sorting\", \"heap-priority-queue\", \"quickselect\"]"),
            codingQuestion("Edit Distance",
                "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
                "Operations allowed: Insert a character, Delete a character, Replace a character.",
                CodingQuestion.QuestionType.DSA, "Dynamic Programming", CodingQuestion.DifficultyLevel.HARD, CodingQuestion.BloomsLevel.ANALYZE,
                "Compute the minimum edit distance between two strings.",
                "0 <= word1.length, word2.length <= 500, word1 and word2 consist of lowercase English letters",
                "{\"input\": \"word1 = \\\"horse\\\", word2 = \\\"ros\\\"\", \"output\": \"3\"}",
                "[\"Use a 2D DP table\", \"dp[i][j] = min ops for word1[:i] to word2[:j]\"]",
                "[\"string\", \"dynamic-programming\"]"),
            codingQuestion("Top K Frequent Elements",
                "Given an integer array nums and an integer k, return the k most frequent elements.",
                "Return the k most frequent elements in any order. The answer is guaranteed to be unique.",
                CodingQuestion.QuestionType.DSA,"Hashing", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.ANALYZE,
                "Find the k most frequent elements in an array.",
                "1 <= nums.length <= 10^5, -10^4 <= nums[i] <= 10^4, 1 <= k <= number of distinct elements",
                "{\"input\": \"nums = [1,1,1,2,2,3], k = 2\", \"output\": \"[1,2]\"}",
                "[\"Count frequencies with a hash map\", \"Use a min-heap or bucket sort\"]",
                "[\"array\", \"hash-table\", \"sorting\", \"heap-priority-queue\"]"),
            codingQuestion("Validate Binary Search Tree",
                "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
                "A valid BST has: left subtree < node, right subtree > node, both subtrees are also BSTs.",
             CodingQuestion.QuestionType.DSA,   "Trees", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.EVALUATE,
                "Validate if a binary tree is a valid BST.",
                "The number of nodes in the tree is in the range [1, 10^4], -2^31 <= Node.val <= 2^31 - 1",
                "{\"input\": \"root = [2,1,3]\", \"output\": \"true\"}",
                "[\"Use range validation (min, max)\", \"In-order traversal must be sorted\"]",
                "[\"tree\", \"binary-search-tree\", \"depth-first-search\"]"),
            codingQuestion("Queue Reconstruction by Height",
                "You are given an array of people, people, which are the attributes of some people in a queue (not necessarily in order). Each people[i] = [hi, ki] represents the ith person of height hi with exactly ki people in front who have a height greater than or equal to hi.",
                "Reconstruct the queue. The number of people in front of this person who have a height greater than or equal to hi is ki.",
           CodingQuestion.QuestionType.DSA,     "Greedy", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.ANALYZE,
                "Reconstruct a queue from given height and in-front-count pairs.",
                "1 <= people.length <= 2000, 0 <= hi <= 10^6, 0 <= ki < people.length",
                "{\"input\": \"people = [[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]\", \"output\": \"[[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]]\"}",
                "[\"Sort by height descending, k ascending\", \"Insert at index k with ArrayList\"]",
                "[\"array\", \"greedy\", \"sorting\"]"),
            codingQuestion("Insert Delete GetRandom O(1)",
                "Implement the RandomizedSet class with insert, remove, and getRandom methods, all in O(1) average time.",
                "Design a data structure that supports insert, remove, and getRandom in O(1) average time.",
                CodingQuestion.QuestionType.DSA, "Design", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.CREATE,
                "Design a RandomizedSet with O(1) insert, remove, and getRandom.",
                "-2^31 <= val <= 2^31 - 1, at most 2 * 10^5 calls",
                "{\"input\": \"[\\\"RandomizedSet\\\",\\\"insert\\\",\\\"remove\\\",\\\"insert\\\",\\\"getRandom\\\",\\\"remove\\\",\\\"insert\\\",\\\"getRandom\\\"]\", \"output\": \"[null,true,false,true,1,true,false,2]\"}",
                "[\"Use a hash map for value->index\", \"Use an array list for random access\"]",
                "[\"array\", \"hash-table\", \"math\", \"design\", \"randomized\"]"),
            codingQuestion("House Robber",
                "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. You cannot rob two adjacent houses. What is the maximum amount of money you can rob tonight?",
                "Determine the maximum amount of money you can rob without robbing adjacent houses.",
           CodingQuestion.QuestionType.DSA,     "Dynamic Programming", CodingQuestion.DifficultyLevel.MEDIUM, CodingQuestion.BloomsLevel.ANALYZE,
                "Find the maximum sum of non-adjacent elements in an array.",
                "1 <= nums.length <= 100, 0 <= nums[i] <= 400",
                "{\"input\": \"nums = [2,7,9,3,1]\", \"output\": \"12\"}",
                "[\"dp[i] = max(dp[i-1], dp[i-2] + nums[i])\", \"Think of rob vs skip\"]",
                "[\"array\", \"dynamic-programming\"]")
        );
if (dsaCount == 0) {
    for (CodingQuestion q : questions) {
        System.out.println("Hints = " + q.getHints());
        System.out.println("Examples = " + q.getExamples());
        System.out.println("Tags = " + q.getTags());

        codingQuestionRepository.save(q);
    }

    log.info("DSA coding questions seeded successfully.");
} else {
    log.info("DSA coding questions already exist ({}), skipping DSA seed.", dsaCount);
}
if (programmingCount == 0) {

    List<CodingQuestion> programmingQuestions = List.of(

        codingQuestion(
            "Reverse a String",
            "Write a Java program to reverse a given string without using the built-in reverse() method.",
            "Given a string, reverse its characters and print the reversed string.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Strings",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.APPLY,
            "Reverse a string using Java programming constructs.",
            "1 <= string.length() <= 10000",
            "{\"input\":\"hello\",\"output\":\"olleh\"}",
            "[\"Use a character array\", \"Traverse from the end to the beginning\"]",
            "[\"string\",\"loops\",\"character-array\"]"
        ),

        codingQuestion(
            "Find Largest Element",
            "Write a Java program to find the largest element in an integer array.",
            "Given an integer array, find and print its maximum element.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Arrays",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.APPLY,
            "Find the maximum value in an integer array.",
            "1 <= array.length <= 10000",
            "{\"input\":\"5\\n10 25 7 40 15\",\"output\":\"40\"}",
            "[\"Initialize maximum with the first element\", \"Traverse the array once\"]",
            "[\"array\",\"loops\"]"
        ),

        codingQuestion(
            "Check Palindrome",
            "Write a Java program to determine whether a given string is a palindrome.",
            "A palindrome reads the same forward and backward.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Strings",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.APPLY,
            "Check whether a string is a palindrome.",
            "1 <= string.length() <= 10000",
            "{\"input\":\"madam\",\"output\":\"true\"}",
            "[\"Compare characters from both ends\", \"Use two pointers\"]",
            "[\"string\",\"two-pointers\"]"
        ),

        codingQuestion(
            "Count Vowels",
            "Write a Java program to count the number of vowels in a given string.",
            "Count a, e, i, o, and u in the supplied string.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Strings",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.APPLY,
            "Count vowels in a string.",
            "1 <= string.length() <= 10000",
            "{\"input\":\"interview\",\"output\":\"4\"}",
            "[\"Convert characters to lowercase\", \"Check each character against the vowels\"]",
            "[\"string\",\"loops\"]"
        ),

        codingQuestion(
            "Sum of Array Elements",
            "Write a Java program to calculate the sum of all elements in an integer array.",
            "Read an integer array and calculate the sum of its elements.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Arrays",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.APPLY,
            "Calculate the sum of all array elements.",
            "1 <= array.length <= 10000",
            "{\"input\":\"4\\n1 2 3 4\",\"output\":\"10\"}",
            "[\"Initialize sum to zero\", \"Add every element to sum\"]",
            "[\"array\",\"loops\"]"
        ),

        codingQuestion(
            "Count Digits",
            "Write a Java program to count the number of digits in an integer.",
            "Given an integer, determine how many digits it contains.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Numbers",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.APPLY,
            "Count the digits of an integer.",
            "-10^9 <= n <= 10^9",
            "{\"input\":\"2026\",\"output\":\"4\"}",
            "[\"Repeatedly divide the number by 10\", \"Handle zero separately\"]",
            "[\"math\",\"loops\"]"
        ),

        codingQuestion(
            "Reverse a Number",
            "Write a Java program to reverse the digits of an integer.",
            "Given an integer, print its digits in reverse order.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Numbers",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.APPLY,
            "Reverse the digits of an integer.",
            "-10^9 <= n <= 10^9",
            "{\"input\":\"12345\",\"output\":\"54321\"}",
            "[\"Use modulo 10 to obtain the last digit\", \"Divide the number by 10 after each iteration\"]",
            "[\"math\",\"loops\"]"
        ),

        codingQuestion(
            "Check Prime Number",
            "Write a Java program to check whether a given number is prime.",
            "A prime number has exactly two positive divisors: 1 and itself.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Numbers",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.ANALYZE,
            "Determine whether a number is prime.",
            "2 <= n <= 10^9",
            "{\"input\":\"17\",\"output\":\"true\"}",
            "[\"Check divisors up to the square root\", \"Numbers less than 2 are not prime\"]",
            "[\"math\",\"loops\",\"prime\"]"
        ),

        codingQuestion(
            "Fibonacci Series",
            "Write a Java program to print the first N numbers of the Fibonacci sequence.",
            "Each Fibonacci number is the sum of the previous two numbers.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Loops",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.APPLY,
            "Generate Fibonacci numbers using iteration.",
            "1 <= n <= 50",
            "{\"input\":\"7\",\"output\":\"0 1 1 2 3 5 8\"}",
            "[\"Maintain two previous values\", \"Generate the next value using their sum\"]",
            "[\"loops\",\"math\"]"
        ),

        codingQuestion(
            "Factorial of a Number",
            "Write a Java program to calculate the factorial of a given number.",
            "The factorial of n is the product of all positive integers from 1 to n.",
            CodingQuestion.QuestionType.PROGRAMMING,
            "Recursion",
            CodingQuestion.DifficultyLevel.EASY,
            CodingQuestion.BloomsLevel.APPLY,
            "Calculate factorial using iteration or recursion.",
            "0 <= n <= 20",
            "{\"input\":\"5\",\"output\":\"120\"}",
            "[\"Initialize result to 1\", \"Multiply result by each number\"]",
            "[\"math\",\"loops\",\"recursion\"]"
        )
    );

    for (CodingQuestion q : programmingQuestions) {
        codingQuestionRepository.save(q);
    }

    log.info("Programming coding questions seeded successfully: {} questions.",
        programmingQuestions.size());

} else {
    log.info("Programming coding questions already exist ({}), skipping Programming seed.",
        programmingCount);
}
        log.info("Coding question seed data verified: {} questions total", codingQuestionRepository.count());
    }
private CodingQuestion codingQuestion(
        String title,
        String questionText,
        String problemStatement,
        CodingQuestion.QuestionType questionType,
        String category,
        CodingQuestion.DifficultyLevel difficulty,
        CodingQuestion.BloomsLevel bloomsLevel,
        String description,
        String constraints,
        String examples,
        String hints,
        String tags) {
        return CodingQuestion.builder()
            .title(title)
            .questionText(questionText)
            .problemStatement(problemStatement)
            .questionType(questionType)
            .category(category)
            .difficultyLevel(difficulty)
            .bloomsLevel(bloomsLevel)
            .description(description)
            .constraints(constraints)
            .examples(examples)
            .hints(hints)
            .tags(tags)
            .language("JAVA")
            .isFavorite(false)
            .acceptanceRate(0.0)
            .totalSubmissions(0)
            .totalAccepted(0)
            .build();
    }
}