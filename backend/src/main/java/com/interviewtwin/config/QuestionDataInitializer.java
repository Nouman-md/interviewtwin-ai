package com.interviewtwin.config;

import com.interviewtwin.entity.InterviewType;
import com.interviewtwin.entity.Question;
import com.interviewtwin.repository.InterviewTypeRepository;
import com.interviewtwin.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Seeds the questions table with interview questions for every interview type.
 *
 * Root cause this fixes: application.properties uses ddl-auto=update which
 * creates tables but does NOT seed data. The questions table was empty, so
 * questionRepository.findByInterviewTypeTypeId(...) returned empty -> 404 on
 * next-question -> frontend showed "Failed to load interview" /
 * "No more questions available".
 *
 * This runs AFTER DataInitializer (which seeds interview_types) so that the
 * type lookups by typeName succeed. Seeding is idempotent: a type's questions
 * are only inserted if that type currently has zero questions.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Order(2)
@Transactional
public class QuestionDataInitializer implements CommandLineRunner {

    private final InterviewTypeRepository interviewTypeRepository;
    private final QuestionRepository questionRepository;

    @Override
    public void run(String... args) {
        seedQuestionsForType("TECHNICAL_INTERVIEW", List.of(
            question("Technical", "Explain the difference between a stack and a queue. When would you use each?", "EASY",
                "[\"Stack: LIFO\",\"Queue: FIFO\",\"Use cases for stack\",\"Use cases for queue\"]",
                "A stack follows Last In First Out (LIFO) principle where the last element added is the first to be removed. Use cases include function call management, undo operations, and expression evaluation. A queue follows First In First Out (FIFO) principle where the first element added is the first to be removed. Use cases include task scheduling, breadth-first search, and print job management."),
            question("Technical", "What is the time complexity of binary search? Explain how it works.", "EASY",
                "[\"Time complexity: O(log n)\",\"Divide and conquer\",\"Sorted array requirement\",\"Implementation details\"]",
                "Binary search has a time complexity of O(log n). It works by repeatedly dividing the search interval in half. Starting with the middle element, if the target value is less than the middle element, the search continues in the lower half; otherwise, it continues in the upper half. This process repeats until the target is found or the interval is empty."),
            question("Technical", "Explain the concept of Big O notation and why it is important.", "MEDIUM",
                "[\"Definition of Big O\",\"Worst-case analysis\",\"Common complexities\",\"Importance in algorithm design\"]",
                "Big O notation describes the upper bound of an algorithm's time or space complexity as the input size grows. It helps analyze algorithm efficiency and scalability. Common complexities include O(1), O(log n), O(n), O(n log n), and O(n^2). Understanding Big O is crucial for choosing the right algorithm and optimizing performance."),
            question("Technical", "What is the difference between process and thread?", "MEDIUM",
                "[\"Process definition\",\"Thread definition\",\"Memory space\",\"Communication overhead\"]",
                "A process is an independent execution unit with its own memory space, while a thread is a lightweight execution unit within a process that shares the same memory space. Processes are isolated from each other, making them more secure but heavier. Threads within the same process can communicate easily but need synchronization to avoid race conditions."),
            question("Technical", "Explain the CAP theorem in distributed systems.", "HARD",
                "[\"Consistency\",\"Availability\",\"Partition tolerance\",\"Trade-offs\"]",
                "The CAP theorem states that a distributed system can only provide two out of three guarantees: Consistency (all nodes see the same data), Availability (every request receives a response), and Partition tolerance (system continues despite network failures). In practice, partition tolerance is required, so systems must choose between consistency and availability.")
        ));

        seedQuestionsForType("HR_INTERVIEW", List.of(
            question("HR", "Tell me about yourself.", "EASY",
                "[\"Professional background\",\"Key achievements\",\"Career goals\",\"Relevance to position\"]",
                "Focus on your professional journey, highlighting relevant experiences and achievements. Keep it concise (1-2 minutes), connect your background to the position you are applying for, and mention your career goals that align with the company."),
            question("HR", "What are your greatest strengths and weaknesses?", "EASY",
                "[\"Relevant strengths\",\"Self-awareness\",\"Improvement plan\",\"Honesty\"]",
                "For strengths, mention 2-3 relevant skills with specific examples. For weaknesses, be honest but show self-awareness and describe concrete steps you are taking to improve. Avoid cliches like 'I am a perfectionist.'"),
            question("HR", "Describe a challenging situation and how you handled it.", "MEDIUM",
                "[\"STAR method\",\"Problem description\",\"Actions taken\",\"Results achieved\"]",
                "Use the STAR method (Situation, Task, Action, Result) to structure your answer. Describe a specific challenging situation, explain your role, detail the actions you took, and highlight the positive outcome or lessons learned."),
            question("HR", "Why do you want to work for this company?", "MEDIUM",
                "[\"Company research\",\"Cultural fit\",\"Value alignment\",\"Career growth\"]",
                "Demonstrate that you have researched the company. Mention specific aspects that attract you (culture, products, mission, growth opportunities). Explain how your skills and goals align with what the company offers."),
            question("HR", "Where do you see yourself in 5 years?", "MEDIUM",
                "[\"Career growth\",\"Skill development\",\"Company alignment\",\"Realistic goals\"]",
                "Show ambition while being realistic. Mention how you want to grow professionally, develop new skills, and contribute to the company. Align your goals with potential career paths within the organization.")
        ));

        seedQuestionsForType("RESUME_BASED_INTERVIEW", List.of(
            question("Resume", "Walk me through your resume.", "EASY",
                "[\"Resume structure\",\"Key experiences\",\"Achievements\",\"Career progression\"]",
                "Provide a chronological walkthrough of your resume, highlighting key experiences, skills, and achievements. Focus on roles and projects most relevant to the position. Explain your career progression and what you learned from each experience. Be prepared to dive deeper into any project or role mentioned."),
            question("Resume", "Tell me about a challenging project you worked on.", "MEDIUM",
                "[\"Project context\",\"Challenges faced\",\"Solutions implemented\",\"Results achieved\"]",
                "Choose a relevant project and describe: 1) The project goal and your role, 2) Specific challenges encountered (technical, team, timeline), 3) How you addressed these challenges, 4) The outcome and impact. Use specific metrics to quantify success. Demonstrate problem-solving skills and learning from challenges."),
            question("Resume", "What is your biggest professional achievement?", "MEDIUM",
                "[\"Specific achievement\",\"Your role\",\"Impact/measurable results\",\"Skills demonstrated\"]",
                "Describe a specific achievement that had measurable impact. Explain your role, the actions you took, and the results. Quantify the impact where possible (e.g., improved performance by 30%, saved $50k, led a team of 5). Connect the achievement to the skills required for the role you are applying for.")
        ));

        seedQuestionsForType("JAVA_INTERVIEW", List.of(
            question("Java", "What is the difference between an interface and an abstract class in Java?", "EASY",
                "[\"Interface definition\",\"Abstract class definition\",\"Multiple inheritance\",\"When to use each\"]",
                "An interface defines a contract with only abstract methods (Java 8+ allows default and static methods), while an abstract class can have both abstract and concrete methods. A class can implement multiple interfaces but extend only one abstract class. Use interfaces for defining capabilities and abstract classes for sharing code among related classes."),
            question("Java", "Explain the concept of multithreading in Java.", "MEDIUM",
                "[\"Thread creation\",\"Thread lifecycle\",\"Synchronization\",\"Concurrency issues\"]",
                "Multithreading allows concurrent execution of multiple threads. Threads can be created by extending Thread class or implementing Runnable interface. Key concepts include thread lifecycle (new, runnable, blocked, waiting, terminated), synchronization for thread safety, and handling concurrency issues like race conditions and deadlocks."),
            question("Java", "What is the Spring Framework? Explain its core features.", "MEDIUM",
                "[\"IoC container\",\"Dependency injection\",\"AOP\",\"Modules\"]",
                "Spring is a comprehensive framework for enterprise Java applications. Core features include Inversion of Control (IoC) container for managing object lifecycle, Dependency Injection for loose coupling, Aspect-Oriented Programming (AOP) for cross-cutting concerns, and various modules for data access, web applications, security, etc."),
            question("Java", "Explain the differences between HashMap and ConcurrentHashMap.", "HARD",
                "[\"Thread safety\",\"Performance\",\"Null values\",\"Locking mechanism\"]",
                "HashMap is not thread-safe and allows one null key and multiple null values, while ConcurrentHashMap is thread-safe and does not allow null keys/values. ConcurrentHashMap uses lock striping (segment-level locking) for better performance in concurrent environments compared to Hashtable which uses method-level synchronization.")
        ));

        seedQuestionsForType("SQL_INTERVIEW", List.of(
            question("SQL", "What is the difference between INNER JOIN and LEFT JOIN?", "EASY",
                "[\"INNER JOIN definition\",\"LEFT JOIN definition\",\"Result set differences\",\"Use cases\"]",
                "INNER JOIN returns only matching rows from both tables, while LEFT JOIN returns all rows from the left table and matching rows from the right table (with NULLs for non-matching rows). Use INNER JOIN when you need only matching records, and LEFT JOIN when you want all records from the primary table regardless of matches."),
            question("SQL", "Explain the concept of database indexing and its benefits.", "MEDIUM",
                "[\"Index definition\",\"Types of indexes\",\"Performance benefits\",\"Trade-offs\"]",
                "An index is a data structure that improves query performance by allowing faster data retrieval. Common types include B-tree, hash, and composite indexes. Benefits include faster SELECT queries and efficient WHERE clause filtering. Trade-offs include slower INSERT/UPDATE/DELETE operations and additional storage space."),
            question("SQL", "What are ACID properties in database transactions?", "MEDIUM",
                "[\"Atomicity\",\"Consistency\",\"Isolation\",\"Durability\"]",
                "ACID properties ensure reliable database transactions: Atomicity (all operations complete or none), Consistency (database remains in valid state), Isolation (concurrent transactions don't interfere), and Durability (committed transactions persist even after system failures).")
        ));

        seedQuestionsForType("OOP_INTERVIEW", List.of(
            question("OOP", "What are the four main principles of OOP?", "EASY",
                "[\"Encapsulation\",\"Abstraction\",\"Inheritance\",\"Polymorphism\"]",
                "The four main principles are: Encapsulation (bundling data and methods, restricting access), Abstraction (hiding complexity, showing only essentials), Inheritance (creating new classes from existing ones), and Polymorphism (objects taking multiple forms). These principles promote code reusability, maintainability, and flexibility."),
            question("OOP", "Explain the concept of polymorphism with examples.", "MEDIUM",
                "[\"Compile-time polymorphism\",\"Runtime polymorphism\",\"Method overloading\",\"Method overriding\"]",
                "Polymorphism allows objects to take multiple forms. Compile-time polymorphism (method overloading) occurs when multiple methods have the same name but different parameters. Runtime polymorphism (method overriding) occurs when a subclass provides a specific implementation of a method defined in its parent class."),
            question("OOP", "What is the difference between abstract class and interface?", "MEDIUM",
                "[\"Abstract class\",\"Interface\",\"Default methods\",\"Multiple inheritance\"]",
                "An abstract class can have both abstract and concrete methods with instance variables, while an interface traditionally defines only abstract methods (though Java 8+ allows default and static methods). A class can implement multiple interfaces but extend only one abstract class. Use abstract classes for shared implementation and interfaces for defining contracts.")
        ));

        seedQuestionsForType("DBMS_INTERVIEW", List.of(
            question("DBMS", "What is a transaction in a database?", "EASY",
                "[\"Transaction definition\",\"ACID properties\",\"Transaction states\",\"Examples\"]",
                "A transaction is a sequence of database operations treated as a single logical unit. It must satisfy ACID properties: Atomicity, Consistency, Isolation, and Durability. Transactions go through states: active, partially committed, committed, failed, and aborted. Examples include bank transfers and order processing."),
            question("DBMS", "Explain the difference between clustered and non-clustered indexes.", "MEDIUM",
                "[\"Clustered index\",\"Non-clustered index\",\"Physical storage\",\"Performance\"]",
                "A clustered index determines the physical order of data in a table. There can be only one clustered index per table. A non-clustered index maintains a separate structure from the data, with pointers to the actual rows. A table can have multiple non-clustered indexes. Clustered indexes are faster for range queries, while non-clustered indexes are better for selective queries."),
            question("DBMS", "What is normalization? Explain its normal forms.", "MEDIUM",
                "[\"Normalization definition\",\"1NF\",\"2NF\",\"3NF\",\"BCNF\"]",
                "Normalization is the process of organizing data to reduce redundancy and improve data integrity. 1NF: atomic values, no repeating groups. 2NF: 1NF + no partial dependency on composite key. 3NF: 2NF + no transitive dependency. BCNF: 3NF + every determinant is a candidate key. Higher normal forms reduce anomalies but may increase join complexity.")
        ));

        seedQuestionsForType("OS_INTERVIEW", List.of(
            question("OS", "What is a process? Explain process states.", "EASY",
                "[\"Process definition\",\"Process control block\",\"Process states\",\"State transitions\"]",
                "A process is a program in execution. It has a Process Control Block (PCB) containing process state, program counter, registers, memory management info, and I/O status. Process states include: New, Ready, Running, Waiting/Blocked, and Terminated. State transitions occur based on events like scheduling, I/O completion, or termination."),
            question("OS", "Explain the difference between process and thread.", "MEDIUM",
                "[\"Process characteristics\",\"Thread characteristics\",\"Memory sharing\",\"Communication\"]",
                "A process is an independent execution unit with its own memory space, while a thread is a lightweight execution unit within a process that shares memory with other threads. Processes are isolated and secure but heavier. Threads are lightweight and can communicate easily but require synchronization. Context switching is faster for threads."),
            question("OS", "What is virtual memory and how does it work?", "MEDIUM",
                "[\"Virtual memory definition\",\"Paging\",\"Page faults\",\"Demand paging\"]",
                "Virtual memory is a memory management technique that allows a process to use more memory than is physically available by using disk space as an extension of RAM. It works through paging, where memory is divided into fixed-size pages. When a page is not in RAM, a page fault occurs and the OS loads it from disk (demand paging). This enables running larger programs and better memory utilization.")
        ));

        seedQuestionsForType("COMPUTER_NETWORKS_INTERVIEW", List.of(
            question("Networks", "What is the OSI model? List all layers.", "EASY",
                "[\"OSI model definition\",\"7 layers\",\"Layer functions\",\"Encapsulation\"]",
                "The OSI model is a conceptual framework with 7 layers: Physical (transmission of raw bits), Data Link (reliable node-to-node transfer), Network (routing and forwarding), Transport (end-to-end communication), Session (managing sessions), Presentation (data format/encryption), and Application (user interface). Each layer provides services to the layer above and uses services from the layer below."),
            question("Networks", "Explain the difference between TCP and UDP.", "MEDIUM",
                "[\"TCP characteristics\",\"UDP characteristics\",\"Connection-oriented vs connectionless\",\"Use cases\"]",
                "TCP is connection-oriented, reliable, ensures ordered delivery, and has flow control. It uses three-way handshake and acknowledgments. UDP is connectionless, unreliable, and has no ordering guarantee. Use TCP for applications requiring reliability (HTTP, FTP, email) and UDP for real-time applications (video streaming, gaming, DNS)."),
            question("Networks", "What is DNS and how does it work?", "MEDIUM",
                "[\"DNS definition\",\"Domain hierarchy\",\"Name resolution\",\"Caching\"]",
                "DNS (Domain Name System) translates human-readable domain names to IP addresses. It works hierarchically: root servers, top-level domain servers, and authoritative name servers. When you query a domain, the resolver checks cache, then queries root, TLD, and authoritative servers in sequence. DNS uses UDP port 53 and supports caching at multiple levels to improve performance.")
        ));

        seedQuestionsForType("CASE_INTERVIEW", List.of(
            question("Case Study", "A retail company wants to expand online. How would you approach this?", "MEDIUM",
                "[\"Problem structuring\",\"Market analysis\",\"Technical requirements\",\"Implementation strategy\"]",
                "I would approach this systematically: 1) Analyze current business model and goals, 2) Research market and competitors, 3) Define technical requirements (platform, payment, inventory), 4) Create implementation roadmap with phases, 5) Consider scalability and security, 6) Plan marketing and customer acquisition strategy, 7) Define success metrics and KPIs."),
            question("Case Study", "Design a URL shortening service like bit.ly", "HARD",
                "[\"System design\",\"Scalability\",\"Database design\",\"API design\"]",
                "Key components: 1) API for creating short URLs, 2) Database to store mappings (original URL, short code, expiry), 3) Redirect service to handle short URL requests, 4) Analytics service for tracking clicks. Use hash-based or counter-based short code generation. Consider caching (Redis), load balancing, and database sharding for scalability."),
            question("Case Study", "Estimate the number of tennis balls that can fit in a room.", "EASY",
                "[\"Clarifying questions\",\"Estimation approach\",\"Assumptions\",\"Calculation\"]",
                "First, clarify the room dimensions and tennis ball size. Assume a standard room (10x10x8 feet = 800 cubic feet) and a tennis ball (2.5 inch diameter, ~0.0038 cubic feet). Volume ratio gives ~210,000, but accounting for packing efficiency (~65% for spheres), estimate ~136,000 tennis balls. The key is showing structured thinking and reasonable assumptions.")
        ));

        log.info("Question seed data verified: {} questions total", questionRepository.count());
    }

    /**
     * Seeds questions for a given interview type only if that type currently
     * has no questions in the database (idempotent and non-destructive).
     */
    private void seedQuestionsForType(String typeName, List<Question> questions) {
        Optional<InterviewType> typeOpt = interviewTypeRepository.findByTypeName(typeName);
        if (typeOpt.isEmpty()) {
            log.warn("Cannot seed questions: interview type '{}' not found", typeName);
            return;
        }
        InterviewType type = typeOpt.get();
        List<Question> existing = questionRepository.findByInterviewTypeTypeId(type.getTypeId());
        if (!existing.isEmpty()) {
            log.info("Questions for '{}' already present ({}), skipping seed", typeName, existing.size());
            return;
        }
        log.info("Seeding {} questions for interview type '{}'", questions.size(), typeName);
        for (Question q : questions) {
            q.setInterviewType(type);
            questionRepository.save(q);
        }
    }

    private Question question(String category, String questionText, String difficulty,
                              String expectedKeyPoints, String modelAnswer) {
        return Question.builder()
            .category(category)
            .questionText(questionText)
            .difficultyLevel(difficulty)
            .expectedKeyPoints(expectedKeyPoints)
            .modelAnswer(modelAnswer)
            .build();
    }
}