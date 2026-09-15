package com.interviewtwin.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewtwin.dto.AdminAptitudeQuestionDTO;
import com.interviewtwin.entity.AptitudeQuestion;
import com.interviewtwin.repository.AptitudeQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminAptitudeQuestionService {

    private static final int MAX_TITLE_LENGTH = 200;
    private static final int MAX_QUESTION_TEXT_LENGTH = 20000;
    private static final int MAX_PROBLEM_STATEMENT_LENGTH = 50000;
    private static final int MAX_QUESTION_TYPE_LENGTH = 100;
    private static final int MAX_CATEGORY_LENGTH = 100;
    private static final int MAX_DIFFICULTY_LENGTH = 50;
    private static final int MAX_BLOOMS_LEVEL_LENGTH = 100;

    private static final int MAX_DESCRIPTION_LENGTH = 50000;
    private static final int MAX_CONSTRAINTS_LENGTH = 20000;
    private static final int MAX_INPUT_FORMAT_LENGTH = 10000;
    private static final int MAX_OUTPUT_FORMAT_LENGTH = 10000;
    private static final int MAX_CORRECT_ANSWER_LENGTH = 1000;
    private static final int MAX_EXPLANATION_LENGTH = 50000;

    private static final int MAX_LIST_ITEMS = 100;
    private static final int MAX_LIST_ITEM_LENGTH = 2000;

    private final AptitudeQuestionRepository aptitudeQuestionRepository;
    private final ObjectMapper objectMapper;


    // =========================================================
    // GET ALL APTITUDE QUESTIONS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminAptitudeQuestionDTO> getAllQuestions() {

        return aptitudeQuestionRepository
                .findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET APTITUDE QUESTION BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public AdminAptitudeQuestionDTO getQuestionById(
            Long aptitudeId) {

        validateId(aptitudeId);

        AptitudeQuestion question =
                aptitudeQuestionRepository
                        .findById(aptitudeId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Aptitude question not found"
                                )
                        );

        return convertToDTO(question);
    }


    // =========================================================
    // GET QUESTIONS BY CATEGORY
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminAptitudeQuestionDTO> getQuestionsByCategory(
            String category) {

        if (category == null ||
                category.trim().isEmpty()) {

            return getAllQuestions();
        }

        String normalizedCategory =
                validateText(
                        category,
                        MAX_CATEGORY_LENGTH,
                        "category"
                );

        return aptitudeQuestionRepository
                .findByCategoryIgnoreCase(
                        normalizedCategory
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET QUESTIONS BY DIFFICULTY
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminAptitudeQuestionDTO> getQuestionsByDifficulty(
            String difficulty) {

        if (difficulty == null ||
                difficulty.trim().isEmpty()) {

            return getAllQuestions();
        }

        String normalizedDifficulty =
                validateText(
                        difficulty,
                        MAX_DIFFICULTY_LENGTH,
                        "difficulty"
                );

        return aptitudeQuestionRepository
                .findByDifficultyLevelIgnoreCase(
                        normalizedDifficulty
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET QUESTIONS BY CATEGORY + DIFFICULTY
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminAptitudeQuestionDTO>
    getQuestionsByCategoryAndDifficulty(
            String category,
            String difficulty) {

        boolean categoryMissing =
                category == null ||
                        category.trim().isEmpty();

        boolean difficultyMissing =
                difficulty == null ||
                        difficulty.trim().isEmpty();

        if (categoryMissing) {
            return getQuestionsByDifficulty(difficulty);
        }

        if (difficultyMissing) {
            return getQuestionsByCategory(category);
        }

        String normalizedCategory =
                validateText(
                        category,
                        MAX_CATEGORY_LENGTH,
                        "category"
                );

        String normalizedDifficulty =
                validateText(
                        difficulty,
                        MAX_DIFFICULTY_LENGTH,
                        "difficulty"
                );

        return aptitudeQuestionRepository
                .findByCategoryIgnoreCaseAndDifficultyLevelIgnoreCase(
                        normalizedCategory,
                        normalizedDifficulty
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // CREATE APTITUDE QUESTION
    // =========================================================

    public AdminAptitudeQuestionDTO createQuestion(
            AdminAptitudeQuestionDTO request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Question data cannot be null"
            );
        }

        validateQuestion(request);

        AptitudeQuestion question =
                new AptitudeQuestion();

        // -----------------------------------------------------
        // BASIC INFORMATION
        // -----------------------------------------------------

        question.setTitle(
                normalizeRequired(
                        request.getTitle(),
                        MAX_TITLE_LENGTH,
                        "title"
                )
        );

        question.setQuestionText(
                normalizeRequired(
                        request.getQuestionText(),
                        MAX_QUESTION_TEXT_LENGTH,
                        "question text"
                )
        );

        question.setProblemStatement(
                normalizeRequired(
                        request.getProblemStatement(),
                        MAX_PROBLEM_STATEMENT_LENGTH,
                        "problem statement"
                )
        );


        // -----------------------------------------------------
        // CLASSIFICATION
        // -----------------------------------------------------

        question.setQuestionType(
                cleanAndLimit(
                        request.getQuestionType(),
                        MAX_QUESTION_TYPE_LENGTH,
                        "question type"
                )
        );

        question.setCategory(
                normalizeRequired(
                        request.getCategory(),
                        MAX_CATEGORY_LENGTH,
                        "category"
                )
        );

        question.setDifficultyLevel(
                normalizeRequired(
                        request.getDifficultyLevel(),
                        MAX_DIFFICULTY_LENGTH,
                        "difficulty level"
                )
        );

        question.setBloomsLevel(
                cleanAndLimit(
                        request.getBloomsLevel(),
                        MAX_BLOOMS_LEVEL_LENGTH,
                        "Blooms level"
                )
        );


        // -----------------------------------------------------
        // QUESTION CONTENT
        // -----------------------------------------------------

        question.setDescription(
                cleanAndLimit(
                        request.getDescription(),
                        MAX_DESCRIPTION_LENGTH,
                        "description"
                )
        );

        question.setConstraints(
                cleanAndLimit(
                        request.getConstraints(),
                        MAX_CONSTRAINTS_LENGTH,
                        "constraints"
                )
        );

        question.setInputFormat(
                cleanAndLimit(
                        request.getInputFormat(),
                        MAX_INPUT_FORMAT_LENGTH,
                        "input format"
                )
        );

        question.setOutputFormat(
                cleanAndLimit(
                        request.getOutputFormat(),
                        MAX_OUTPUT_FORMAT_LENGTH,
                        "output format"
                )
        );


        // -----------------------------------------------------
        // APTITUDE CONTENT
        // -----------------------------------------------------

        question.setOptions(
                convertListToJson(
                        request.getOptions()
                )
        );

        question.setCorrectAnswer(
                normalizeRequired(
                        request.getCorrectAnswer(),
                        MAX_CORRECT_ANSWER_LENGTH,
                        "correct answer"
                )
        );

        question.setExplanation(
                cleanAndLimit(
                        request.getExplanation(),
                        MAX_EXPLANATION_LENGTH,
                        "explanation"
                )
        );

        question.setHints(
                convertListToJson(
                        request.getHints()
                )
        );

        question.setTags(
                convertListToJson(
                        request.getTags()
                )
        );


        // -----------------------------------------------------
        // INITIAL STATISTICS
        // -----------------------------------------------------

        question.setAcceptanceRate(
                BigDecimal.ZERO
        );

        question.setTotalAttempts(0);

        question.setTotalCorrect(0);


        // -----------------------------------------------------
        // TIMESTAMP
        // -----------------------------------------------------

        question.setCreatedAt(
                java.time.LocalDateTime.now()
        );


        AptitudeQuestion savedQuestion =
                aptitudeQuestionRepository.save(
                        question
                );

        return convertToDTO(savedQuestion);
    }


    // =========================================================
    // UPDATE APTITUDE QUESTION
    // =========================================================

    public AdminAptitudeQuestionDTO updateQuestion(
            Long aptitudeId,
            AdminAptitudeQuestionDTO request) {

        validateId(aptitudeId);

        if (request == null) {
            throw new IllegalArgumentException(
                    "Question data cannot be null"
            );
        }

        validateQuestion(request);

        AptitudeQuestion question =
                aptitudeQuestionRepository
                        .findById(aptitudeId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Aptitude question not found"
                                )
                        );


        // -----------------------------------------------------
        // BASIC INFORMATION
        // -----------------------------------------------------

        question.setTitle(
                normalizeRequired(
                        request.getTitle(),
                        MAX_TITLE_LENGTH,
                        "title"
                )
        );

        question.setQuestionText(
                normalizeRequired(
                        request.getQuestionText(),
                        MAX_QUESTION_TEXT_LENGTH,
                        "question text"
                )
        );

        question.setProblemStatement(
                normalizeRequired(
                        request.getProblemStatement(),
                        MAX_PROBLEM_STATEMENT_LENGTH,
                        "problem statement"
                )
        );


        // -----------------------------------------------------
        // CLASSIFICATION
        // -----------------------------------------------------

        question.setQuestionType(
                cleanAndLimit(
                        request.getQuestionType(),
                        MAX_QUESTION_TYPE_LENGTH,
                        "question type"
                )
        );

        question.setCategory(
                normalizeRequired(
                        request.getCategory(),
                        MAX_CATEGORY_LENGTH,
                        "category"
                )
        );

        question.setDifficultyLevel(
                normalizeRequired(
                        request.getDifficultyLevel(),
                        MAX_DIFFICULTY_LENGTH,
                        "difficulty level"
                )
        );

        question.setBloomsLevel(
                cleanAndLimit(
                        request.getBloomsLevel(),
                        MAX_BLOOMS_LEVEL_LENGTH,
                        "Blooms level"
                )
        );


        // -----------------------------------------------------
        // QUESTION CONTENT
        // -----------------------------------------------------

        question.setDescription(
                cleanAndLimit(
                        request.getDescription(),
                        MAX_DESCRIPTION_LENGTH,
                        "description"
                )
        );

        question.setConstraints(
                cleanAndLimit(
                        request.getConstraints(),
                        MAX_CONSTRAINTS_LENGTH,
                        "constraints"
                )
        );

        question.setInputFormat(
                cleanAndLimit(
                        request.getInputFormat(),
                        MAX_INPUT_FORMAT_LENGTH,
                        "input format"
                )
        );

        question.setOutputFormat(
                cleanAndLimit(
                        request.getOutputFormat(),
                        MAX_OUTPUT_FORMAT_LENGTH,
                        "output format"
                )
        );


        // -----------------------------------------------------
        // APTITUDE CONTENT
        // -----------------------------------------------------

        question.setOptions(
                convertListToJson(
                        request.getOptions()
                )
        );

        question.setCorrectAnswer(
                normalizeRequired(
                        request.getCorrectAnswer(),
                        MAX_CORRECT_ANSWER_LENGTH,
                        "correct answer"
                )
        );

        question.setExplanation(
                cleanAndLimit(
                        request.getExplanation(),
                        MAX_EXPLANATION_LENGTH,
                        "explanation"
                )
        );

        question.setHints(
                convertListToJson(
                        request.getHints()
                )
        );

        question.setTags(
                convertListToJson(
                        request.getTags()
                )
        );


        /*
         * IMPORTANT:
         *
         * We intentionally DO NOT overwrite:
         *
         * acceptanceRate
         * totalAttempts
         * totalCorrect
         *
         * Those statistics belong to actual user attempts.
         */


        AptitudeQuestion updatedQuestion =
                aptitudeQuestionRepository.save(
                        question
                );

        return convertToDTO(updatedQuestion);
    }


    // =========================================================
    // DELETE APTITUDE QUESTION
    // =========================================================

    public void deleteQuestion(
            Long aptitudeId) {

        validateId(aptitudeId);

        AptitudeQuestion question =
                aptitudeQuestionRepository
                        .findById(aptitudeId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Aptitude question not found"
                                )
                        );

        aptitudeQuestionRepository.delete(
                question
        );
    }


    // =========================================================
    // CONVERT ENTITY → DTO
    // =========================================================

    private AdminAptitudeQuestionDTO convertToDTO(
            AptitudeQuestion question) {

        return AdminAptitudeQuestionDTO.builder()

                // -------------------------------------------------
                // BASIC INFORMATION
                // -------------------------------------------------

                .aptitudeId(
                        question.getAptitudeId()
                )

                .title(
                        question.getTitle()
                )

                .questionText(
                        question.getQuestionText()
                )

                .problemStatement(
                        question.getProblemStatement()
                )


                // -------------------------------------------------
                // CLASSIFICATION
                // -------------------------------------------------

                .questionType(
                        question.getQuestionType()
                )

                .category(
                        question.getCategory()
                )

                .difficultyLevel(
                        question.getDifficultyLevel()
                )

                .bloomsLevel(
                        question.getBloomsLevel()
                )


                // -------------------------------------------------
                // QUESTION CONTENT
                // -------------------------------------------------

                .description(
                        question.getDescription()
                )

                .constraints(
                        question.getConstraints()
                )

                .inputFormat(
                        question.getInputFormat()
                )

                .outputFormat(
                        question.getOutputFormat()
                )


                // -------------------------------------------------
                // APTITUDE CONTENT
                // -------------------------------------------------

                .options(
                        parseJsonArray(
                                question.getOptions()
                        )
                )

                .correctAnswer(
                        question.getCorrectAnswer()
                )

                .explanation(
                        question.getExplanation()
                )

                .hints(
                        parseJsonArray(
                                question.getHints()
                        )
                )

                .tags(
                        parseJsonArray(
                                question.getTags()
                        )
                )


                // -------------------------------------------------
                // STATISTICS
                // -------------------------------------------------

                .acceptanceRate(
                        question.getAcceptanceRate()
                )

                .totalAttempts(
                        question.getTotalAttempts()
                )

                .totalCorrect(
                        question.getTotalCorrect()
                )


                // -------------------------------------------------
                // TIMESTAMP
                // -------------------------------------------------

                .createdAt(
                        question.getCreatedAt()
                )

                .build();
    }


    // =========================================================
    // LIST → JSON
    // =========================================================

    private String convertListToJson(
            List<String> values) {

        if (values == null ||
                values.isEmpty()) {

            return "[]";
        }

        if (values.size() > MAX_LIST_ITEMS) {
            throw new IllegalArgumentException(
                    "Too many list items"
            );
        }

        for (String value : values) {

            if (value == null) {
                throw new IllegalArgumentException(
                        "List contains invalid value"
                );
            }

            if (value.length() > MAX_LIST_ITEM_LENGTH) {
                throw new IllegalArgumentException(
                        "List item is too long"
                );
            }
        }

        try {

            return objectMapper.writeValueAsString(
                    values.stream()
                            .map(String::trim)
                            .collect(Collectors.toList())
            );

        } catch (JsonProcessingException e) {

            throw new IllegalArgumentException(
                    "Unable to convert list to JSON"
            );
        }
    }


    // =========================================================
    // JSON → LIST
    // =========================================================

    private List<String> parseJsonArray(
            String json) {

        if (json == null ||
                json.trim().isEmpty()) {

            return Collections.emptyList();
        }

        try {

            List<String> values =
                    objectMapper.readValue(
                            json,
                            objectMapper
                                    .getTypeFactory()
                                    .constructCollectionType(
                                            List.class,
                                            String.class
                                    )
                    );

            if (values == null ||
                    values.isEmpty()) {

                return Collections.emptyList();
            }

            if (values.size() > MAX_LIST_ITEMS) {
                return Collections.emptyList();
            }

            return values.stream()
                    .filter(value -> value != null)
                    .limit(MAX_LIST_ITEMS)
                    .collect(Collectors.toList());

        } catch (Exception e) {

            /*
             * Existing database data should normally
             * contain valid JSON. If old data is invalid,
             * return an empty list instead of crashing
             * the entire admin question list.
             */

            return Collections.emptyList();
        }
    }


    // =========================================================
    // CLEAN OPTIONAL STRING
    // =========================================================

    private String cleanAndLimit(
            String value,
            int maxLength,
            String fieldName) {

        if (value == null ||
                value.trim().isEmpty()) {

            return null;
        }

        String normalized =
                value.trim();

        if (normalized.length() > maxLength) {
            throw new IllegalArgumentException(
                    "Invalid " + fieldName
            );
        }

        return normalized;
    }


    // =========================================================
    // REQUIRED STRING
    // =========================================================

    private String normalizeRequired(
            String value,
            int maxLength,
            String fieldName) {

        if (value == null ||
                value.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    fieldName + " is required"
            );
        }

        String normalized =
                value.trim();

        if (normalized.length() > maxLength) {
            throw new IllegalArgumentException(
                    "Invalid " + fieldName
            );
        }

        return normalized;
    }


    // =========================================================
    // VALIDATE TEXT
    // =========================================================

    private String validateText(
            String value,
            int maxLength,
            String fieldName) {

        if (value == null) {
            throw new IllegalArgumentException(
                    "Invalid " + fieldName
            );
        }

        String normalized =
                value.trim();

        if (normalized.isEmpty() ||
                normalized.length() > maxLength) {

            throw new IllegalArgumentException(
                    "Invalid " + fieldName
            );
        }

        return normalized;
    }


    // =========================================================
    // VALIDATE ID
    // =========================================================

    private void validateId(Long aptitudeId) {

        if (aptitudeId == null ||
                aptitudeId <= 0) {

            throw new IllegalArgumentException(
                    "Invalid aptitude question ID"
            );
        }
    }


    // =========================================================
    // VALIDATE QUESTION
    // =========================================================

    private void validateQuestion(
            AdminAptitudeQuestionDTO request) {

        normalizeRequired(
                request.getTitle(),
                MAX_TITLE_LENGTH,
                "title"
        );

        normalizeRequired(
                request.getQuestionText(),
                MAX_QUESTION_TEXT_LENGTH,
                "question text"
        );

        normalizeRequired(
                request.getProblemStatement(),
                MAX_PROBLEM_STATEMENT_LENGTH,
                "problem statement"
        );

        normalizeRequired(
                request.getCategory(),
                MAX_CATEGORY_LENGTH,
                "category"
        );

        normalizeRequired(
                request.getDifficultyLevel(),
                MAX_DIFFICULTY_LENGTH,
                "difficulty level"
        );

        normalizeRequired(
                request.getCorrectAnswer(),
                MAX_CORRECT_ANSWER_LENGTH,
                "correct answer"
        );

        cleanAndLimit(
                request.getQuestionType(),
                MAX_QUESTION_TYPE_LENGTH,
                "question type"
        );

        cleanAndLimit(
                request.getBloomsLevel(),
                MAX_BLOOMS_LEVEL_LENGTH,
                "Blooms level"
        );

        cleanAndLimit(
                request.getDescription(),
                MAX_DESCRIPTION_LENGTH,
                "description"
        );

        cleanAndLimit(
                request.getConstraints(),
                MAX_CONSTRAINTS_LENGTH,
                "constraints"
        );

        cleanAndLimit(
                request.getInputFormat(),
                MAX_INPUT_FORMAT_LENGTH,
                "input format"
        );

        cleanAndLimit(
                request.getOutputFormat(),
                MAX_OUTPUT_FORMAT_LENGTH,
                "output format"
        );

        cleanAndLimit(
                request.getExplanation(),
                MAX_EXPLANATION_LENGTH,
                "explanation"
        );

        validateList(
                request.getOptions(),
                "options"
        );

        validateList(
                request.getHints(),
                "hints"
        );

        validateList(
                request.getTags(),
                "tags"
        );
    }


    // =========================================================
    // VALIDATE LIST
    // =========================================================

    private void validateList(
            List<String> values,
            String fieldName) {

        if (values == null) {
            return;
        }

        if (values.size() > MAX_LIST_ITEMS) {
            throw new IllegalArgumentException(
                    "Too many " + fieldName
            );
        }

        for (String value : values) {

            if (value == null ||
                    value.length() > MAX_LIST_ITEM_LENGTH) {

                throw new IllegalArgumentException(
                        "Invalid " + fieldName
                );
            }
        }
    }
}