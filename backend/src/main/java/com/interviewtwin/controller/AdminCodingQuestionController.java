package com.interviewtwin.controller;

import com.interviewtwin.dto.AdminCodingQuestionDTO;
import com.interviewtwin.service.AdminCodingQuestionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coding-questions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminCodingQuestionController {

    private static final int MAX_CATEGORY_LENGTH = 100;
    private static final int MAX_DIFFICULTY_LENGTH = 50;
    private static final int MAX_LANGUAGE_LENGTH = 50;

    private final AdminCodingQuestionService adminCodingQuestionService;


    // =========================================================
    // GET ALL CODING QUESTIONS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<AdminCodingQuestionDTO>> getAllQuestions() {

        List<AdminCodingQuestionDTO> questions =
            adminCodingQuestionService.getAllQuestions();

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(questions);
    }


    // =========================================================
    // GET CODING QUESTION BY ID
    // =========================================================

    @GetMapping("/{codingId}")
    public ResponseEntity<AdminCodingQuestionDTO> getQuestionById(
        @PathVariable Long codingId
    ) {

        validateId(codingId);

        AdminCodingQuestionDTO question =
            adminCodingQuestionService.getQuestionById(
                codingId
            );

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(question);
    }


    // =========================================================
    // GET QUESTIONS BY CATEGORY
    // =========================================================

    @GetMapping("/category/{category}")
    public ResponseEntity<List<AdminCodingQuestionDTO>>
    getQuestionsByCategory(
        @PathVariable String category
    ) {

        String safeCategory =
            validateText(
                category,
                MAX_CATEGORY_LENGTH,
                "category"
            );

        List<AdminCodingQuestionDTO> questions =
            adminCodingQuestionService.getQuestionsByCategory(
                safeCategory
            );

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(questions);
    }


    // =========================================================
    // GET QUESTIONS BY DIFFICULTY
    // =========================================================

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<AdminCodingQuestionDTO>>
    getQuestionsByDifficulty(
        @PathVariable String difficulty
    ) {

        String safeDifficulty =
            validateText(
                difficulty,
                MAX_DIFFICULTY_LENGTH,
                "difficulty"
            );

        List<AdminCodingQuestionDTO> questions =
            adminCodingQuestionService.getQuestionsByDifficulty(
                safeDifficulty
            );

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(questions);
    }


    // =========================================================
    // GET QUESTIONS BY LANGUAGE
    // =========================================================

    @GetMapping("/language/{language}")
    public ResponseEntity<List<AdminCodingQuestionDTO>>
    getQuestionsByLanguage(
        @PathVariable String language
    ) {

        String safeLanguage =
            validateText(
                language,
                MAX_LANGUAGE_LENGTH,
                "language"
            );

        List<AdminCodingQuestionDTO> questions =
            adminCodingQuestionService.getQuestionsByLanguage(
                safeLanguage
            );

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(questions);
    }


    // =========================================================
    // CREATE CODING QUESTION
    // =========================================================

    @PostMapping
    public ResponseEntity<AdminCodingQuestionDTO> createQuestion(
        @Valid @RequestBody AdminCodingQuestionDTO request
    ) {

        if (request == null) {
            throw new IllegalArgumentException(
                "Invalid coding question"
            );
        }

        AdminCodingQuestionDTO createdQuestion =
            adminCodingQuestionService.createQuestion(
                request
            );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore())
            .body(createdQuestion);
    }


    // =========================================================
    // UPDATE CODING QUESTION
    // =========================================================

    @PutMapping("/{codingId}")
    public ResponseEntity<AdminCodingQuestionDTO> updateQuestion(
        @PathVariable Long codingId,
        @Valid @RequestBody AdminCodingQuestionDTO request
    ) {

        validateId(codingId);

        if (request == null) {
            throw new IllegalArgumentException(
                "Invalid coding question"
            );
        }

        AdminCodingQuestionDTO updatedQuestion =
            adminCodingQuestionService.updateQuestion(
                codingId,
                request
            );

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(updatedQuestion);
    }


    // =========================================================
    // DELETE CODING QUESTION
    // =========================================================

    @DeleteMapping("/{codingId}")
    public ResponseEntity<Void> deleteQuestion(
        @PathVariable Long codingId
    ) {

        validateId(codingId);

        adminCodingQuestionService.deleteQuestion(
            codingId
        );

        return ResponseEntity.noContent().build();
    }


    // =========================================================
    // VALIDATION
    // =========================================================

    private void validateId(Long id) {

        if (id == null || id <= 0) {
            throw new IllegalArgumentException(
                "Invalid coding question ID"
            );
        }
    }

    private String validateText(
        String value,
        int maxLength,
        String fieldName
    ) {

        if (value == null) {
            throw new IllegalArgumentException(
                "Invalid " + fieldName
            );
        }

        String normalized =
            value.trim();

        if (normalized.isEmpty()
            || normalized.length() > maxLength) {

            throw new IllegalArgumentException(
                "Invalid " + fieldName
            );
        }

        return normalized;
    }
}