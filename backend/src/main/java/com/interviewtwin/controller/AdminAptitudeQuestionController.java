package com.interviewtwin.controller;

import com.interviewtwin.dto.AdminAptitudeQuestionDTO;
import com.interviewtwin.service.AdminAptitudeQuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/admin/aptitude-questions")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminAptitudeQuestionController {

    private final AdminAptitudeQuestionService adminAptitudeQuestionService;


    // =========================================================
    // GET ALL APTITUDE QUESTIONS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<AdminAptitudeQuestionDTO>> getAllQuestions() {

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(
                        adminAptitudeQuestionService.getAllQuestions()
                );
    }


    // =========================================================
    // GET APTITUDE QUESTION BY ID
    // =========================================================

    @GetMapping("/{aptitudeId}")
    public ResponseEntity<AdminAptitudeQuestionDTO> getQuestionById(
            @PathVariable Long aptitudeId) {

        if (aptitudeId == null || aptitudeId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(
                        adminAptitudeQuestionService.getQuestionById(
                                aptitudeId
                        )
                );
    }


    // =========================================================
    // GET QUESTIONS BY CATEGORY
    // =========================================================

    @GetMapping("/category/{category}")
    public ResponseEntity<List<AdminAptitudeQuestionDTO>>
    getQuestionsByCategory(
            @PathVariable String category) {

        if (category == null ||
                category.isBlank() ||
                category.length() > 100) {

            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(
                        adminAptitudeQuestionService
                                .getQuestionsByCategory(
                                        category.trim()
                                )
                );
    }


    // =========================================================
    // GET QUESTIONS BY DIFFICULTY
    // =========================================================

    @GetMapping("/difficulty/{difficulty}")
    public ResponseEntity<List<AdminAptitudeQuestionDTO>>
    getQuestionsByDifficulty(
            @PathVariable String difficulty) {

        if (difficulty == null ||
                difficulty.isBlank() ||
                difficulty.length() > 50) {

            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(
                        adminAptitudeQuestionService
                                .getQuestionsByDifficulty(
                                        difficulty.trim()
                                )
                );
    }


    // =========================================================
    // GET QUESTIONS BY CATEGORY + DIFFICULTY
    // =========================================================

    @GetMapping("/filter")
    public ResponseEntity<List<AdminAptitudeQuestionDTO>>
    getQuestionsByCategoryAndDifficulty(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String difficulty) {

        if (category != null &&
                category.length() > 100) {

            return ResponseEntity.badRequest().build();
        }

        if (difficulty != null &&
                difficulty.length() > 50) {

            return ResponseEntity.badRequest().build();
        }

        String normalizedCategory =
                category == null || category.isBlank()
                        ? null
                        : category.trim();

        String normalizedDifficulty =
                difficulty == null || difficulty.isBlank()
                        ? null
                        : difficulty.trim();

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(
                        adminAptitudeQuestionService
                                .getQuestionsByCategoryAndDifficulty(
                                        normalizedCategory,
                                        normalizedDifficulty
                                )
                );
    }


    // =========================================================
    // CREATE APTITUDE QUESTION
    // =========================================================

    @PostMapping(
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AdminAptitudeQuestionDTO> createQuestion(
            @Valid @RequestBody AdminAptitudeQuestionDTO request) {

        return ResponseEntity.status(201)
                .cacheControl(CacheControl.noStore())
                .body(
                        adminAptitudeQuestionService
                                .createQuestion(request)
                );
    }


    // =========================================================
    // UPDATE APTITUDE QUESTION
    // =========================================================

    @PutMapping(
            value = "/{aptitudeId}",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<AdminAptitudeQuestionDTO> updateQuestion(
            @PathVariable Long aptitudeId,
            @Valid @RequestBody AdminAptitudeQuestionDTO request) {

        if (aptitudeId == null || aptitudeId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(
                        adminAptitudeQuestionService
                                .updateQuestion(
                                        aptitudeId,
                                        request
                                )
                );
    }


    // =========================================================
    // DELETE APTITUDE QUESTION
    // =========================================================

    @DeleteMapping("/{aptitudeId}")
    public ResponseEntity<Void> deleteQuestion(
            @PathVariable Long aptitudeId) {

        if (aptitudeId == null || aptitudeId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        adminAptitudeQuestionService.deleteQuestion(
                aptitudeId
        );

        return ResponseEntity
                .noContent()
                .build();
    }
}