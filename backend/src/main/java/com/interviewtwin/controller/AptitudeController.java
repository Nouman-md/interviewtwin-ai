package com.interviewtwin.controller;

import com.interviewtwin.dto.AptitudeQuestionResponse;
import com.interviewtwin.entity.AptitudeQuestion;
import com.interviewtwin.service.AptitudeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/aptitude")
@RequiredArgsConstructor
public class AptitudeController {

    private final AptitudeService aptitudeService;

    // =========================================================
    // GET ALL QUESTIONS
    // =========================================================

    @GetMapping("/questions")
    public ResponseEntity<List<AptitudeQuestionResponse>> getAllQuestions() {
        List<AptitudeQuestionResponse> questions =
                aptitudeService.getAllQuestions()
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(questions);
    }

    // =========================================================
    // GET QUESTION BY ID
    // =========================================================

    @GetMapping("/questions/{aptitudeId}")
    public ResponseEntity<AptitudeQuestionResponse> getQuestion(
            @PathVariable Long aptitudeId) {

        return ResponseEntity.ok(
                toResponse(
                        aptitudeService.getQuestionById(aptitudeId)
                )
        );
    }

    // =========================================================
    // GET RANDOM QUESTIONS
    // =========================================================

    @GetMapping("/questions/random")
    public ResponseEntity<List<AptitudeQuestionResponse>> getRandomQuestions(
            @RequestParam(defaultValue = "10") int count) {

        List<AptitudeQuestionResponse> questions =
                aptitudeService.getRandomQuestions(count)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(questions);
    }

    // =========================================================
    // GET QUESTIONS BY CATEGORY
    // =========================================================

    @GetMapping("/questions/category/{category}")
    public ResponseEntity<List<AptitudeQuestionResponse>> getQuestionsByCategory(
            @PathVariable String category) {

        List<AptitudeQuestionResponse> questions =
                aptitudeService.getQuestionsByCategory(category)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(questions);
    }

    // =========================================================
    // GET QUESTIONS BY DIFFICULTY
    // =========================================================

    @GetMapping("/questions/difficulty/{difficulty}")
    public ResponseEntity<List<AptitudeQuestionResponse>> getQuestionsByDifficulty(
            @PathVariable String difficulty) {

        List<AptitudeQuestionResponse> questions =
                aptitudeService.getQuestionsByDifficulty(difficulty)
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(questions);
    }

    // =========================================================
    // GET QUESTIONS BY CATEGORY + DIFFICULTY
    // =========================================================

    @GetMapping("/questions/filter")
    public ResponseEntity<List<AptitudeQuestionResponse>> getQuestionsByFilters(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty) {

        List<AptitudeQuestionResponse> questions =
                aptitudeService
                        .getQuestionsByCategoryAndDifficulty(
                                category,
                                difficulty
                        )
                        .stream()
                        .map(this::toResponse)
                        .toList();

        return ResponseEntity.ok(questions);
    }

    // =========================================================
    // GET AVAILABLE CATEGORIES
    // =========================================================

    @GetMapping("/categories")
    public ResponseEntity<List<String>> getCategories() {

        return ResponseEntity.ok(
                aptitudeService.getCategories()
        );
    }

    // =========================================================
    // CHECK ANSWER
    // =========================================================

    @PostMapping("/submit/{aptitudeId}")
    public ResponseEntity<Map<String, Object>> submitAnswer(
            @PathVariable Long aptitudeId,
            @RequestBody Map<String, String> request) {

        String submittedAnswer = request.get("answer");

        return ResponseEntity.ok(
                aptitudeService.checkAnswer(
                        aptitudeId,
                        submittedAnswer
                )
        );
    }

    // =========================================================
    // APTITUDE STATISTICS
    // =========================================================

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {

        return ResponseEntity.ok(
                aptitudeService.getStats()
        );
    }

    // =========================================================
    // ENTITY → SAFE RESPONSE DTO
    // =========================================================

    private AptitudeQuestionResponse toResponse(
            AptitudeQuestion question) {

        AptitudeQuestionResponse response =
                new AptitudeQuestionResponse();

        response.setAptitudeId(
                question.getAptitudeId()
        );

        response.setTitle(
                question.getTitle()
        );

        response.setQuestionText(
                question.getQuestionText()
        );

        response.setProblemStatement(
                question.getProblemStatement()
        );

        response.setQuestionType(
                question.getQuestionType()
        );

        response.setCategory(
                question.getCategory()
        );

        response.setDifficultyLevel(
                question.getDifficultyLevel()
        );

        response.setBloomsLevel(
                question.getBloomsLevel()
        );

        response.setDescription(
                question.getDescription()
        );

        response.setConstraints(
                question.getConstraints()
        );

        response.setInputFormat(
                question.getInputFormat()
        );

        response.setOutputFormat(
                question.getOutputFormat()
        );

        // Convert JSON string into List<String>
        response.setOptions(
                parseJsonArray(question.getOptions())
        );

        response.setExplanation(
                question.getExplanation()
        );

        response.setHints(
                parseJsonArray(question.getHints())
        );

        response.setTags(
                parseJsonArray(question.getTags())
        );

        response.setAcceptanceRate(
                question.getAcceptanceRate() != null
                        ? question.getAcceptanceRate().doubleValue()
                        : 0.0
        );

        response.setTotalAttempts(
                question.getTotalAttempts()
        );

        response.setTotalCorrect(
                question.getTotalCorrect()
        );

        return response;
    }

    // =========================================================
    // JSON ARRAY PARSER
    // =========================================================

    private List<String> parseJsonArray(String json) {

        if (json == null || json.trim().isEmpty()) {
            return List.of();
        }

        try {
            com.fasterxml.jackson.databind.ObjectMapper mapper =
                    new com.fasterxml.jackson.databind.ObjectMapper();

            return mapper.readValue(
                    json,
                    mapper.getTypeFactory()
                            .constructCollectionType(
                                    List.class,
                                    String.class
                            )
            );

        } catch (Exception e) {
            return List.of();
        }
    }
}