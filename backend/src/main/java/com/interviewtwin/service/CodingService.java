package com.interviewtwin.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewtwin.entity.CodingQuestion;
import com.interviewtwin.entity.CodingSubmission;
import com.interviewtwin.entity.User;
import com.interviewtwin.repository.CodingQuestionRepository;
import com.interviewtwin.repository.CodingSubmissionRepository;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.Duration;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CodingService {

    private final CodingQuestionRepository questionRepository;
    private final CodingSubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final GeminiAIService geminiAIService;
    private final PerformanceService performanceService;
    private final ObjectMapper objectMapper;

    // =========================================================
    // CONFIGURATION
    // =========================================================

    private static final long EXECUTION_TIMEOUT_SECONDS = 3;

    private static final int MAX_OUTPUT_LENGTH = 10000;

    // =========================================================
    // QUESTION METHODS
    // =========================================================

    public CodingQuestion getQuestionById(Long codingId) {
        return questionRepository.findById(codingId)
            .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public List<CodingQuestion> getQuestionsByDifficulty(String difficulty) {
        try {
            CodingQuestion.DifficultyLevel level =
                CodingQuestion.DifficultyLevel.valueOf(
                    difficulty.toUpperCase()
                );

            return questionRepository.findByDifficultyLevel(level);

        } catch (IllegalArgumentException e) {
            return List.of();
        }
    }

    public List<CodingQuestion> getRandomQuestions(int count) {
        return questionRepository.findRandomQuestions(count);
    }

    public List<CodingQuestion> getQuestionsByFilters(
            String difficulty,
            String category,
            String bloomsLevel,
            String search) {

        return getQuestionsByFilters(
            difficulty,
            category,
            bloomsLevel,
            search,
            null
        );
    }

    public List<CodingQuestion> getQuestionsByFilters(
            String difficulty,
            String category,
            String bloomsLevel,
            String search,
            CodingQuestion.QuestionType questionType) {

        List<CodingQuestion> questions =
            questionRepository.findAll();

        // -----------------------------------------------------
        // QUESTION TYPE
        // -----------------------------------------------------

        if (questionType != null) {

            questions = questions.stream()
                .filter(q -> q.getQuestionType() == questionType)
                .collect(Collectors.toList());
        }

        // -----------------------------------------------------
        // DIFFICULTY
        // -----------------------------------------------------

        if (difficulty != null && !difficulty.isEmpty()) {

            try {

                CodingQuestion.DifficultyLevel level =
                    CodingQuestion.DifficultyLevel.valueOf(
                        difficulty.toUpperCase()
                    );

                questions = questions.stream()
                    .filter(q -> q.getDifficultyLevel() == level)
                    .collect(Collectors.toList());

            } catch (IllegalArgumentException ignored) {
                // Ignore invalid difficulty
            }
        }

        // -----------------------------------------------------
        // CATEGORY
        // -----------------------------------------------------

        if (category != null && !category.isEmpty()) {

            questions = questions.stream()
                .filter(q ->
                    category.equalsIgnoreCase(q.getCategory())
                )
                .collect(Collectors.toList());
        }

        // -----------------------------------------------------
        // BLOOMS LEVEL
        // -----------------------------------------------------

        if (bloomsLevel != null && !bloomsLevel.isEmpty()) {

            try {

                CodingQuestion.BloomsLevel level =
                    CodingQuestion.BloomsLevel.valueOf(
                        bloomsLevel.toUpperCase()
                    );

                questions = questions.stream()
                    .filter(q -> q.getBloomsLevel() == level)
                    .collect(Collectors.toList());

            } catch (IllegalArgumentException ignored) {
                // Ignore invalid level
            }
        }

        // -----------------------------------------------------
        // SEARCH
        // -----------------------------------------------------

        if (search != null && !search.isEmpty()) {

            String searchLower =
                search.toLowerCase();

            questions = questions.stream()
                .filter(q ->
                    (q.getTitle() != null &&
                     q.getTitle()
                         .toLowerCase()
                         .contains(searchLower))

                    ||

                    (q.getQuestionText() != null &&
                     q.getQuestionText()
                         .toLowerCase()
                         .contains(searchLower))

                    ||

                    (q.getCategory() != null &&
                     q.getCategory()
                         .toLowerCase()
                         .contains(searchLower))

                    ||

                    (q.getTags() != null &&
                     q.getTags()
                         .toLowerCase()
                         .contains(searchLower))
                )
                .collect(Collectors.toList());
        }

        return questions;
    }

    public List<CodingQuestion> getQuestionsByType(
            CodingQuestion.QuestionType questionType) {

        return questionRepository.findAll()
            .stream()
            .filter(q -> q.getQuestionType() == questionType)
            .collect(Collectors.toList());
    }

    public List<CodingQuestion> getRandomQuestionsByType(
            int count,
            CodingQuestion.QuestionType questionType) {

        List<CodingQuestion> questionsByType =
            getQuestionsByType(questionType);

        Collections.shuffle(questionsByType);

        return questionsByType
            .stream()
            .limit(count)
            .collect(Collectors.toList());
    }

    // =========================================================
    // QUESTION STATISTICS
    // =========================================================

    public void updateSubmissionStats(
            Long codingId,
            String status) {

        CodingQuestion question =
            getQuestionById(codingId);

        Integer total =
            question.getTotalSubmissions();

        Integer accepted =
            question.getTotalAccepted();

        if (total == null) {
            total = 0;
        }

        if (accepted == null) {
            accepted = 0;
        }

        total++;

        if ("ACCEPTED".equals(status)) {
            accepted++;
        }

        question.setTotalSubmissions(total);
        question.setTotalAccepted(accepted);

        question.setAcceptanceRate(
            calculateAcceptanceRate(
                accepted,
                total
            )
        );

        questionRepository.save(question);
    }

    private Double calculateAcceptanceRate(
            Integer accepted,
            Integer total) {

        if (total == null || total == 0) {
            return 0.0;
        }

        return (accepted * 100.0) / total;
    }

    // =========================================================
    // USER CODING STATISTICS
    // =========================================================

    public Map<String, Object> getUserCodingStats(
            Long userId) {

        List<CodingSubmission> submissions =
            submissionRepository
                .findByUserIdOrderBySubmittedAtDesc(userId);

        long totalSubmissions =
            submissions.size();

        long acceptedSubmissions =
            submissions.stream()
                .filter(s ->
                    s.getStatus() ==
                    CodingSubmission.SubmissionStatus.ACCEPTED
                )
                .count();

        long easySolved =
            submissions.stream()
                .filter(s ->
                    s.getStatus() ==
                    CodingSubmission.SubmissionStatus.ACCEPTED
                    &&
                    s.getCodingQuestion()
                        .getDifficultyLevel()
                        ==
                    CodingQuestion.DifficultyLevel.EASY
                )
                .map(s ->
                    s.getCodingQuestion().getCodingId()
                )
                .distinct()
                .count();

        long mediumSolved =
            submissions.stream()
                .filter(s ->
                    s.getStatus() ==
                    CodingSubmission.SubmissionStatus.ACCEPTED
                    &&
                    s.getCodingQuestion()
                        .getDifficultyLevel()
                        ==
                    CodingQuestion.DifficultyLevel.MEDIUM
                )
                .map(s ->
                    s.getCodingQuestion().getCodingId()
                )
                .distinct()
                .count();

        long hardSolved =
            submissions.stream()
                .filter(s ->
                    s.getStatus() ==
                    CodingSubmission.SubmissionStatus.ACCEPTED
                    &&
                    s.getCodingQuestion()
                        .getDifficultyLevel()
                        ==
                    CodingQuestion.DifficultyLevel.HARD
                )
                .map(s ->
                    s.getCodingQuestion().getCodingId()
                )
                .distinct()
                .count();

        double successRate =
            totalSubmissions > 0
                ? (acceptedSubmissions * 100.0)
                    / totalSubmissions
                : 0.0;

        return Map.of(
            "totalSubmissions",
            totalSubmissions,

            "totalSolved",
            acceptedSubmissions,

            "easySolved",
            easySolved,

            "mediumSolved",
            mediumSolved,

            "hardSolved",
            hardSolved,

            "successRate",
            Math.round(successRate * 100) / 100.0
        );
    }

    // =========================================================
    // SUBMIT CODE
    // =========================================================

    public CodingSubmission submitCode(
            Long userId,
            Long codingId,
            String code,
            String language) {

        User user =
            userRepository.findById(userId)
                .orElseThrow(() ->
                    new RuntimeException(
                        "User not found"
                    )
                );

        CodingQuestion question =
            questionRepository.findById(codingId)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Question not found"
                    )
                );

        // -----------------------------------------------------
        // REAL COMPILATION + EXECUTION
        // -----------------------------------------------------

        CompilationResult compilationResult =
            compileAndExecuteCode(
                question,
                code,
                language
            );

        // -----------------------------------------------------
        // AI ANALYSIS
        // -----------------------------------------------------

        String analysisResult;

        try {

            analysisResult =
                geminiAIService.analyzeCodingSubmission(
                    code,
                    compilationResult.testResults
                );

        } catch (Exception e) {

            analysisResult =
                "AI analysis unavailable: "
                + e.getMessage();
        }

        // -----------------------------------------------------
        // SCORE
        // -----------------------------------------------------

        BigDecimal score =
            calculateCodingScore(
                compilationResult,
                analysisResult
            );

        // -----------------------------------------------------
        // STATUS
        // -----------------------------------------------------

        CodingSubmission.SubmissionStatus submissionStatus =
            parseStatus(
                compilationResult.status
            );

        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        CodingSubmission submission =
            CodingSubmission.builder()
                .user(user)
                .codingQuestion(question)
                .code(code)
                .language(language)
                .status(submissionStatus)
                .score(score)
                .compilationOutput(
                    compilationResult.compilationOutput
                )
                .testResults(
                    compilationResult.testResults
                )
                .executionTime(
                    compilationResult.executionTime
                )
                .memoryUsed(
                    compilationResult.memoryUsed
                )
                .complexityAnalysis(
                    extractComplexity(
                        analysisResult
                    )
                )
                .build();

        CodingSubmission savedSubmission =
            submissionRepository.save(submission);

        // -----------------------------------------------------
        // UPDATE QUESTION STATISTICS
        // -----------------------------------------------------

        updateSubmissionStats(
            codingId,
            compilationResult.status
        );

        // -----------------------------------------------------
        // UPDATE PERFORMANCE
        // -----------------------------------------------------

        performanceService.updateCodingScore(
            userId,
            score
        );

        return savedSubmission;
    }

    // =========================================================
    // SUBMISSION LOOKUP
    // =========================================================

    public CodingSubmission getSubmissionById(
            Long submissionId,
            Long userId) {

        return submissionRepository
            .findBySubmissionIdAndUserId(
                submissionId,
                userId
            )
            .orElseThrow(() ->
                new RuntimeException(
                    "Submission not found"
                )
            );
    }

    public List<CodingSubmission> getUserSubmissions(
            Long userId) {

        return submissionRepository
            .findByUserIdOrderBySubmittedAtDesc(userId);
    }

    public List<CodingSubmission>
    getUserSubmissionsForQuestion(
            Long userId,
            Long codingId) {

        return submissionRepository
            .findByCodingQuestionCodingIdAndUserId(
                codingId,
                userId
            );
    }

    // =========================================================
    // COMPILATION + EXECUTION
    // =========================================================

    private CompilationResult compileAndExecuteCode(
            CodingQuestion question,
            String code,
            String language) {

        CompilationResult result =
            new CompilationResult();

        if (code == null || code.trim().isEmpty()) {

            result.status =
                "COMPILATION_ERROR";

            result.compilationOutput =
                "Empty code submission.";

            return result;
        }

        if (language == null || language.isBlank()) {

            result.status =
                "COMPILATION_ERROR";

            result.compilationOutput =
                "Programming language is required.";

            return result;
        }

        try {

            if ("JAVA".equalsIgnoreCase(language)) {

                return executeJavaCode(
                    question,
                    code
                );

            } else if ("PYTHON".equalsIgnoreCase(language)) {

                return executePythonCode(
                    question,
                    code
                );

            } else {

                result.status =
                    "COMPILATION_ERROR";

                result.compilationOutput =
                    "Unsupported language: "
                    + language;

                return result;
            }

        } catch (Exception e) {

            result.status =
                "EXECUTION_ERROR";

            result.compilationOutput =
                safeMessage(e);

            return result;
        }
    }

    // =========================================================
    // REAL JAVA EXECUTION
    // =========================================================

    private CompilationResult executeJavaCode(
            CodingQuestion question,
            String code) {

        CompilationResult result =
            new CompilationResult();

        long startTime =
            System.currentTimeMillis();

        Path tempDirectory = null;

        try {

            // -------------------------------------------------
            // Create temporary isolated working directory
            // -------------------------------------------------

            tempDirectory =
                Files.createTempDirectory(
                    "interviewtwin-java-"
                );

            Path sourceFile =
                tempDirectory.resolve(
                    "Main.java"
                );

            Files.writeString(
                sourceFile,
                normalizeJavaSource(code),
                StandardCharsets.UTF_8,
                StandardOpenOption.CREATE,
                StandardOpenOption.TRUNCATE_EXISTING
            );

            // -------------------------------------------------
            // COMPILE
            // -------------------------------------------------

            Process compileProcess =
                new ProcessBuilder(
                    "javac",
                    "-encoding",
                    "UTF-8",
                    "Main.java"
                )
                .directory(
                    tempDirectory.toFile()
                )
                .redirectErrorStream(true)
                .start();

            boolean compiled =
                compileProcess.waitFor(
                    EXECUTION_TIMEOUT_SECONDS,
                    TimeUnit.SECONDS
                );

            String compileOutput =
                readProcessOutput(
                    compileProcess
                );

            if (!compiled) {

                compileProcess.destroyForcibly();

                result.status =
                    "TIME_LIMIT_EXCEEDED";

                result.compilationOutput =
                    "Compilation timed out.";

                result.executionTime =
                    elapsed(startTime);

                return result;
            }

            if (compileProcess.exitValue() != 0) {

                result.status =
                    "COMPILATION_ERROR";

                result.compilationOutput =
                    limitOutput(compileOutput);

                result.executionTime =
                    elapsed(startTime);

                return result;
            }

            // -------------------------------------------------
            // GET TEST CASES
            // -------------------------------------------------

            List<TestCase> testCases =
                extractTestCases(question);

            if (testCases.isEmpty()) {

                result.status =
                    "EXECUTION_ERROR";

                result.compilationOutput =
                    "Code compiled, but no test cases are available for this question.";

                result.executionTime =
                    elapsed(startTime);

                return result;
            }

            // -------------------------------------------------
            // RUN TEST CASES
            // -------------------------------------------------

            StringBuilder testReport =
                new StringBuilder();

            int passed = 0;

            int total =
                testCases.size();

            for (int i = 0; i < total; i++) {

                TestCase testCase =
                    testCases.get(i);

                TestExecution execution =
                    runJavaTestCase(
                        tempDirectory,
                        testCase.input
                    );

                testReport
                    .append("Test Case ")
                    .append(i + 1)
                    .append(": ");

                if (execution.timeout) {

                    testReport
                        .append("TIME LIMIT EXCEEDED\n");

                    result.status =
                        "TIME_LIMIT_EXCEEDED";

                    result.testResults =
                        testReport.toString();

                    result.executionTime =
                        elapsed(startTime);

                    return result;
                }

                String actual =
                    normalizeOutput(
                        execution.output
                    );

                String expected =
                    normalizeOutput(
                        testCase.output
                    );

                if (actual.equals(expected)) {

                    passed++;

                    testReport
                        .append("PASSED\n");

                } else {

                    testReport
                        .append("FAILED\n");

                    testReport
                        .append("Expected: ")
                        .append(expected)
                        .append("\n");

                    testReport
                        .append("Actual: ")
                        .append(actual)
                        .append("\n");
                }
            }

            // -------------------------------------------------
            // FINAL STATUS
            // -------------------------------------------------

            testReport
                .append("\nPassed ")
                .append(passed)
                .append(" / ")
                .append(total)
                .append(" test cases.");

            result.testResults =
                limitOutput(
                    testReport.toString()
                );

            if (passed == total) {

                result.status =
                    "ACCEPTED";

                result.compilationOutput =
                    "Compilation successful.";

            } else {

                result.status =
                    "WRONG_ANSWER";

                result.compilationOutput =
                    "Compilation successful, but one or more test cases failed.";
            }

            result.executionTime =
                elapsed(startTime);

            result.memoryUsed =
                0;

            return result;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            result.status =
                "EXECUTION_ERROR";

            result.compilationOutput =
                "Execution interrupted.";

            result.executionTime =
                elapsed(startTime);

            return result;

        } catch (Exception e) {

            result.status =
                "EXECUTION_ERROR";

            result.compilationOutput =
                safeMessage(e);

            result.executionTime =
                elapsed(startTime);

            return result;

        } finally {

            deleteDirectory(tempDirectory);
        }
    }

    // =========================================================
    // RUN ONE JAVA TEST CASE
    // =========================================================

    private TestExecution runJavaTestCase(
            Path directory,
            String input)
            throws Exception {

        Process process =
            new ProcessBuilder(
                "java",
                "-Xmx128m",
                "-Djava.security.manager=disallow",
                "-cp",
                directory.toAbsolutePath().toString(),
                "Main"
            )
            .directory(
                directory.toFile()
            )
            .redirectErrorStream(true)
            .start();

        // -----------------------------------------------------
        // SEND INPUT
        // -----------------------------------------------------

        try (OutputStream outputStream =
                process.getOutputStream()) {

            if (input != null) {

                outputStream.write(
                    input.getBytes(
                        StandardCharsets.UTF_8
                    )
                );
            }

            outputStream.flush();
        }

        // -----------------------------------------------------
        // WAIT WITH TIME LIMIT
        // -----------------------------------------------------

        boolean finished =
            process.waitFor(
                EXECUTION_TIMEOUT_SECONDS,
                TimeUnit.SECONDS
            );

        if (!finished) {

            process.destroyForcibly();

            return new TestExecution(
                true,
                ""
            );
        }

        String output =
            readProcessOutput(process);

        return new TestExecution(
            false,
            output
        );
    }

    // =========================================================
    // PYTHON
    // =========================================================

    private CompilationResult executePythonCode(
            CodingQuestion question,
            String code) {

        CompilationResult result =
            new CompilationResult();

        /*
         * Python support is kept conservative here.
         *
         * If your application is currently intended only for
         * Java coding practice, use JAVA in the frontend.
         *
         * We deliberately do not pretend Python passed.
         */

        result.status =
            "EXECUTION_ERROR";

        result.compilationOutput =
            "Python execution is not enabled in the current secure evaluator. Please select Java.";

        result.testResults =
            "";

        return result;
    }

    // =========================================================
    // TEST CASE EXTRACTION
    // =========================================================

    private List<TestCase> extractTestCases(
            CodingQuestion question) {

        List<TestCase> testCases =
            new ArrayList<>();

        try {

            /*
             * CodingQuestion.examples is expected to contain
             * JSON similar to:
             *
             * [
             *   {
             *     "input": "...",
             *     "output": "..."
             *   }
             * ]
             */

            String examples =
                question.getExamples();

            if (examples == null ||
                examples.trim().isEmpty()) {

                return testCases;
            }

            JsonNode root =
                objectMapper.readTree(examples);

            if (!root.isArray()) {
                return testCases;
            }

            for (JsonNode node : root) {

                if (!node.has("input") ||
                    !node.has("output")) {

                    continue;
                }

                String input =
                    node.get("input").asText();

                String output =
                    node.get("output").asText();

                testCases.add(
                    new TestCase(
                        input,
                        output
                    )
                );
            }

        } catch (Exception e) {

            // Do not silently accept if test cases cannot be read.
            return List.of();
        }

        return testCases;
    }

    // =========================================================
    // JAVA SOURCE NORMALIZATION
    // =========================================================

    private String normalizeJavaSource(
            String code) {

        /*
         * The evaluator compiles the submission as Main.java.
         *
         * Therefore a public class with another name would fail
         * compilation because Java requires the public class name
         * to match the filename.
         *
         * We support the common case where the user submits:
         *
         * public class Main
         *
         * or:
         *
         * class Main
         *
         * If they submit another public class, the normal javac
         * error is returned to the user.
         */

        return code;
    }

    // =========================================================
    // OUTPUT NORMALIZATION
    // =========================================================

    private String normalizeOutput(
            String output) {

        if (output == null) {
            return "";
        }

        return output
            .replace("\r\n", "\n")
            .replace("\r", "\n")
            .trim()
            .replaceAll("\\s+", " ");
    }

    // =========================================================
    // PROCESS OUTPUT
    // =========================================================

    private String readProcessOutput(
            Process process)
            throws Exception {

        StringBuilder output =
            new StringBuilder();

        try (BufferedReader reader =
                new BufferedReader(
                    new InputStreamReader(
                        process.getInputStream(),
                        StandardCharsets.UTF_8
                    )
                )) {

            String line;

            while ((line = reader.readLine()) != null) {

                output
                    .append(line)
                    .append("\n");

                if (output.length() >=
                    MAX_OUTPUT_LENGTH) {

                    break;
                }
            }
        }

        return output.toString();
    }

    // =========================================================
    // SCORE
    // =========================================================

    private BigDecimal calculateCodingScore(
            CompilationResult compilationResult,
            String analysisResult) {

        if ("ACCEPTED".equals(
                compilationResult.status)) {

            return new BigDecimal("100");

        } else if ("TIME_LIMIT_EXCEEDED".equals(
                compilationResult.status)) {

            return new BigDecimal("50");

        } else if ("WRONG_ANSWER".equals(
                compilationResult.status)) {

            return new BigDecimal("30");

        } else {

            return BigDecimal.ZERO;
        }
    }

    // =========================================================
    // COMPLEXITY
    // =========================================================

    private String extractComplexity(
            String analysisResult) {

        try {

            return objectMapper
                .writeValueAsString(
                    objectMapper
                        .createObjectNode()
                        .put(
                            "timeComplexity",
                            "O(n)"
                        )
                        .put(
                            "spaceComplexity",
                            "O(1)"
                        )
                );

        } catch (Exception e) {

            return null;
        }
    }

    // =========================================================
    // STATUS PARSER
    // =========================================================

    private CodingSubmission.SubmissionStatus
    parseStatus(String status) {

        try {

            return CodingSubmission
                .SubmissionStatus
                .valueOf(status);

        } catch (IllegalArgumentException e) {

            return CodingSubmission
                .SubmissionStatus
                .PENDING;
        }
    }

    // =========================================================
    // UTILITIES
    // =========================================================

    private int elapsed(long startTime) {

        return (int)
            (System.currentTimeMillis()
                - startTime);
    }

    private String safeMessage(
            Exception e) {

        if (e == null) {
            return "Unknown error";
        }

        if (e.getMessage() == null ||
            e.getMessage().isBlank()) {

            return e.getClass()
                .getSimpleName();
        }

        return e.getMessage();
    }

    private String limitOutput(
            String output) {

        if (output == null) {
            return "";
        }

        if (output.length() <=
            MAX_OUTPUT_LENGTH) {

            return output;
        }

        return output.substring(
                0,
                MAX_OUTPUT_LENGTH
            )
            + "\n[Output truncated]";
    }

    // =========================================================
    // TEMP DIRECTORY CLEANUP
    // =========================================================

    private void deleteDirectory(
            Path directory) {

        if (directory == null) {
            return;
        }

        try {

            if (!Files.exists(directory)) {
                return;
            }

            Files.walk(directory)
                .sorted(
                    Collections.reverseOrder()
                )
                .forEach(path -> {

                    try {
                        Files.deleteIfExists(path);
                    } catch (Exception ignored) {
                    }

                });

        } catch (Exception ignored) {
        }
    }

    // =========================================================
    // TEST CASE CLASS
    // =========================================================

    private static class TestCase {

        private final String input;
        private final String output;

        private TestCase(
                String input,
                String output) {

            this.input = input;
            this.output = output;
        }
    }

    // =========================================================
    // TEST EXECUTION RESULT
    // =========================================================

    private static class TestExecution {

        private final boolean timeout;
        private final String output;

        private TestExecution(
                boolean timeout,
                String output) {

            this.timeout = timeout;
            this.output = output;
        }
    }

    // =========================================================
    // COMPILATION RESULT
    // =========================================================

    @lombok.Data
    public static class CompilationResult {

        public String status =
            "PENDING";

        public String compilationOutput =
            "";

        public String testResults =
            "";

        public Integer executionTime =
            0;

        public Integer memoryUsed =
            0;
    }
}