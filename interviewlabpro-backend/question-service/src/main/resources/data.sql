-- Idempotent seed data for InterviewLabPro question catalog

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'Two Sum', 'Return indices of two numbers that add up to target.', 'EASY', 'ARRAYS', 'Google, Amazon, Facebook', 'Use a hash map for complements.', '[2,7,11,15], target=9', '[0,1]', '2 <= n <= 10^4', 'function twoSum(nums, target) {\n  // Your code here\n}', 30, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'Two Sum');

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'Reverse Linked List', 'Reverse a singly linked list and return the new head.', 'EASY', 'LINKED_LISTS', 'Microsoft, Apple', 'Iterative pointer reversal works well.', 'head=[1,2,3,4,5]', '[5,4,3,2,1]', '0 <= nodes <= 5000', 'function reverseList(head) {\n  // Your code here\n}', 30, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'Reverse Linked List');

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'Valid Parentheses', 'Check whether brackets are closed in the correct order.', 'EASY', 'STACKS', 'Google, Bloomberg', 'Use a stack and match closing brackets.', 's="()[]{}"', 'true', '1 <= |s| <= 10^4', 'function isValid(s) {\n  // Your code here\n}', 30, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'Valid Parentheses');

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'Maximum Subarray', 'Find the contiguous subarray with the largest sum.', 'MEDIUM', 'DYNAMIC_PROGRAMMING', 'Amazon, Netflix', 'Kadane''s algorithm gives O(n).', 'nums=[-2,1,-3,4,-1,2,1,-5,4]', '6', '-10^4 <= nums[i] <= 10^4', 'function maxSubArray(nums) {\n  // Your code here\n}', 45, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'Maximum Subarray');

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'Binary Tree Level Order Traversal', 'Return node values level by level using BFS.', 'MEDIUM', 'TREES', 'Facebook, Microsoft', 'Queue-based BFS.', 'root=[3,9,20,null,null,15,7]', '[[3],[9,20],[15,7]]', '0 <= nodes <= 2000', 'function levelOrder(root) {\n  // Your code here\n}', 45, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'Binary Tree Level Order Traversal');

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'Merge Intervals', 'Merge overlapping intervals after sorting by start.', 'MEDIUM', 'ARRAYS', 'Google, Facebook', 'Sort by start then merge greedily.', '[[1,3],[2,6],[8,10],[15,18]]', '[[1,6],[8,10],[15,18]]', '1 <= intervals.length <= 10^4', 'function merge(intervals) {\n  // Your code here\n}', 45, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'Merge Intervals');

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'Longest Palindromic Substring', 'Find the longest palindromic substring in s.', 'MEDIUM', 'STRINGS', 'Amazon, Apple', 'Expand around centers.', 's="babad"', '"bab" or "aba"', '1 <= |s| <= 1000', 'function longestPalindrome(s) {\n  // Your code here\n}', 45, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'Longest Palindromic Substring');

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'Word Ladder', 'Find shortest transformation steps between beginWord and endWord.', 'HARD', 'GRAPHS', 'Google, Amazon', 'BFS over wildcard states.', 'begin="hit", end="cog"', '5', 'All words same length.', 'function ladderLength(beginWord, endWord, wordList) {\n  // Your code here\n}', 60, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'Word Ladder');

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'Median of Two Sorted Arrays', 'Find median in O(log(m+n)) time.', 'HARD', 'SEARCHING', 'Google, Microsoft', 'Binary search partitioning.', 'nums1=[1,3], nums2=[2]', '2.0', 'nums1.length == m, nums2.length == n', 'function findMedianSortedArrays(nums1, nums2) {\n  // Your code here\n}', 60, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'Median of Two Sorted Arrays');

INSERT INTO questions (title, description, difficulty, category, company, hints, sample_input, sample_output, constraints, starter_code, time_limit, created_at)
SELECT 'LRU Cache', 'Design an LRU cache with O(1) get and put.', 'HARD', 'DESIGN', 'Amazon, Facebook, Google', 'HashMap + Doubly Linked List.', 'capacity=2; put/get sequence', '1', 'capacity > 0', 'class LRUCache {\n  constructor(capacity) {\n    // Your code here\n  }\n}', 60, CURRENT_TIMESTAMP
WHERE NOT EXISTS (SELECT 1 FROM questions WHERE title = 'LRU Cache');
