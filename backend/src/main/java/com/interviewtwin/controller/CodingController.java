package com.interviewtwin.controller;

import com.interviewtwin.entity.CodingQuestion;
import com.interviewtwin.entity.CodingSubmission;
import com.interviewtwin.security.SecurityUtils;
import com.interviewtwin.service.CodingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Locale;
import java.util.Map;

@RestController
@RequestMapping("/api/coding")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class CodingController {

    private static final int MAX_COUNT = 50;
    private static final int MAX_PAGE_SIZE = 50;

    private static final int MAX_FILTER_LENGTH = 100;
    private static final int MAX_SEARCH_LENGTH = 100;
    private static final int MAX_CODE_LENGTH = 200_000;
    private static final int MAX_LANGUAGE_LENGTH = 50;

    private final CodingService codingService;
    private final SecurityUtils securityUtils;

    // =========================================================
    // GET QUESTION
    // =========================================================

    @GetMapping("/questions/{codingId}")
    public ResponseEntity<CodingQuestion> getQuestion(
            @PathVariable Long codingId) {

        validateId(codingId, "coding ID");

        CodingQuestion question =
                codingService.getQuestionById(codingId);

        return noStoreOk(question);
    }

    // =========================================================
    // QUESTIONS BY DIFFICULTY
    // =========================================================

    @GetMapping("/questions/difficulty/{difficulty}")
    public ResponseEntity<List<CodingQuestion>> getQuestionsByDifficulty(
            @PathVariable String difficulty) {

        String safeDifficulty =
                validateText(difficulty, MAX_FILTER_LENGTH, "difficulty");

        List<CodingQuestion> questions =
                codingService.getQuestionsByDifficulty(safeDifficulty);

        return noStoreOk(questions);
    }

    // =========================================================
    // RANDOM QUESTIONS
    // =========================================================

    @GetMapping("/questions/random")
    public ResponseEntity<List<CodingQuestion>> getRandomQuestions(
            @RequestParam(defaultValue = "5") int count,
            @RequestParam(required = false) String type) {

        if (count < 1 || count > MAX_COUNT) {
            return ResponseEntity.badRequest().build();
        }

        List<CodingQuestion> questions;

        if (type != null && !type.isBlank()) {

            String safeType =
                    validateText(type, MAX_FILTER_LENGTH, "question type");

            try {
                CodingQuestion.QuestionType questionType =
                        CodingQuestion.QuestionType.valueOf(
                                safeType.toUpperCase(Locale.ROOT)
                        );

                questions =
                        codingService.getRandomQuestionsByType(
                                count,
                                questionType
                        );

            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }

        } else {
            questions = codingService.getRandomQuestions(count);
        }

        return noStoreOk(questions);
    }

    // =========================================================
    // FILTER QUESTIONS
    // =========================================================

    @GetMapping("/questions/filter")
    public ResponseEntity<List<CodingQuestion>> getQuestionsByFilters(
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String bloomsLevel,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String questionType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        if (page < 0) {
            return ResponseEntity.badRequest().build();
        }

        if (size < 1 || size > MAX_PAGE_SIZE) {
            return ResponseEntity.badRequest().build();
        }

        String safeDifficulty =
                validateOptionalText(
                        difficulty,
                        MAX_FILTER_LENGTH,
                        "difficulty"
                );

        String safeCategory =
                validateOptionalText(
                        category,
                        MAX_FILTER_LENGTH,
                        "category"
                );

        String safeBloomsLevel =
                validateOptionalText(
                        bloomsLevel,
                        MAX_FILTER_LENGTH,
                        "blooms level"
                );

        String safeSearch =
                validateOptionalText(
                        search,
                        MAX_SEARCH_LENGTH,
                        "search"
                );

        CodingQuestion.QuestionType qType = null;

        if (questionType != null && !questionType.isBlank()) {

            String safeQuestionType =
                    validateText(
                            questionType,
                            MAX_FILTER_LENGTH,
                            "question type"
                    );

            try {
                qType = CodingQuestion.QuestionType.valueOf(
                        safeQuestionType.toUpperCase(Locale.ROOT)
                );
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().build();
            }
        }

        List<CodingQuestion> questions =
                codingService.getQuestionsByFilters(
                        safeDifficulty,
                        safeCategory,
                        safeBloomsLevel,
                        safeSearch,
                        qType
                );

        /*
         * Prevent integer overflow in page * size.
         */
        long startLong = (long) page * size;

        if (startLong >= questions.size()) {
            return noStoreOk(List.of());
        }

        int start = (int) startLong;
        int end = Math.min(start + size, questions.size());

        List<CodingQuestion> paginated =
                questions.subList(start, end);

        return noStoreOk(paginated);
    }

    // =========================================================
    // QUESTIONS BY TYPE
    // =========================================================

    @GetMapping("/questions/type/{questionType}")
    public ResponseEntity<List<CodingQuestion>> getQuestionsByType(
            @PathVariable String questionType) {

        String safeQuestionType =
                validateText(
                        questionType,
                        MAX_FILTER_LENGTH,
                        "question type"
                );

        try {

            CodingQuestion.QuestionType type =
                    CodingQuestion.QuestionType.valueOf(
                            safeQuestionType.toUpperCase(Locale.ROOT)
                    );

            List<CodingQuestion> questions =
                    codingService.getQuestionsByType(type);

            return noStoreOk(questions);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // =========================================================
    // SEARCH QUESTIONS
    // =========================================================

    @GetMapping("/questions/search")
    public ResponseEntity<List<CodingQuestion>> searchQuestions(
            @RequestParam String query) {

        String safeQuery =
                validateText(
                        query,
                        MAX_SEARCH_LENGTH,
                        "search query"
                );

        List<CodingQuestion> questions =
                codingService.getQuestionsByFilters(
                        null,
                        null,
                        null,
                        safeQuery
                );

        return noStoreOk(questions);
    }

    // =========================================================
    // QUESTIONS BY TOPIC
    // =========================================================

    @GetMapping("/questions/topic/{category}")
    public ResponseEntity<List<CodingQuestion>> getQuestionsByTopic(
            @PathVariable String category) {

        String safeCategory =
                validateText(
                        category,
                        MAX_FILTER_LENGTH,
                        "category"
                );

        List<CodingQuestion> questions =
                codingService.getQuestionsByFilters(
                        null,
                        safeCategory,
                        null,
                        null
                );

        return noStoreOk(questions);
    }

    // =========================================================
    // USER CODING STATS
    // =========================================================

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCodingStats(
            Authentication authentication) {

        Long userId =
                securityUtils.getCurrentUserId(authentication);

        Map<String, Object> stats =
                codingService.getUserCodingStats(userId);

        return noStoreOk(stats);
    }

    // =========================================================
    // SUBMIT CODE
    // =========================================================

    @PostMapping("/submit/{codingId}")
    public ResponseEntity<?> submitCode(
            Authentication authentication,
            @PathVariable Long codingId,
            @RequestBody(required = false) Map<String, String> request) {

        validateId(codingId, "coding ID");

        if (request == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Request body is required"));
        }

        Long userId =
                securityUtils.getCurrentUserId(authentication);

        String code = request.get("code");

        if (code == null || code.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Code is required"));
        }

        if (code.length() > MAX_CODE_LENGTH) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Code exceeds maximum allowed length"));
        }

        String language =
                request.getOrDefault("language", "JAVA");

        if (language == null || language.isBlank()) {
            language = "JAVA";
        }

        language = language.trim();

        if (language.length() > MAX_LANGUAGE_LENGTH) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid language"));
        }

        /*
         * The service remains responsible for the final language
         * allowlist and execution/evaluation security.
         */
        CodingSubmission submission =
                codingService.submitCode(
                        userId,
                        codingId,
                        code,
                        language
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .cacheControl(CacheControl.noStore())
                .body(submission);
    }

    // =========================================================
    // GET ONE SUBMISSION
    // =========================================================

    @GetMapping("/submissions/{submissionId}")
    public ResponseEntity<CodingSubmission> getSubmission(
            Authentication authentication,
            @PathVariable Long submissionId) {

        validateId(submissionId, "submission ID");

        Long userId =
                securityUtils.getCurrentUserId(authentication);

        CodingSubmission submission =
                codingService.getSubmissionById(
                        submissionId,
                        userId
                );

        return noStoreOk(submission);
    }

    // =========================================================
    // GET USER SUBMISSIONS
    // =========================================================

    @GetMapping("/submissions/user")
    public ResponseEntity<List<CodingSubmission>> getUserSubmissions(
            Authentication authentication) {

        Long userId =
                securityUtils.getCurrentUserId(authentication);

        List<CodingSubmission> submissions =
                codingService.getUserSubmissions(userId);

        return noStoreOk(submissions);
    }

    // =========================================================
    // GET SUBMISSIONS FOR QUESTION
    // =========================================================

    @GetMapping("/submissions/question/{codingId}")
    public ResponseEntity<List<CodingSubmission>> getQuestionSubmissions(
            Authentication authentication,
            @PathVariable Long codingId) {

        validateId(codingId, "coding ID");

        Long userId =
                securityUtils.getCurrentUserId(authentication);

        List<CodingSubmission> submissions =
                codingService.getUserSubmissionsForQuestion(
                        userId,
                        codingId
                );

        return noStoreOk(submissions);
    }

    // =========================================================
    // VALIDATION HELPERS
    // =========================================================

    private void validateId(Long id, String fieldName) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException(
                    "Invalid " + fieldName
            );
        }
    }

    private String validateText(
            String value,
            int maxLength,
            String fieldName) {

        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(
                    fieldName + " is required"
            );
        }

        String trimmed = value.trim();

        if (trimmed.length() > maxLength) {
            throw new IllegalArgumentException(
                    fieldName + " exceeds maximum allowed length"
            );
        }

        return trimmed;
    }

    private String validateOptionalText(
            String value,
            int maxLength,
            String fieldName) {

        if (value == null || value.isBlank()) {
            return null;
        }

        return validateText(value, maxLength, fieldName);
    }

    private <T> ResponseEntity<T> noStoreOk(T body) {

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(body);
    }
}