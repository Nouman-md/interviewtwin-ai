package com.interviewtwin.service;

import com.interviewtwin.dto.AdminCodingQuestionDTO;
import com.interviewtwin.entity.CodingQuestion;
import com.interviewtwin.repository.CodingQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminCodingQuestionService {

    private final CodingQuestionRepository codingQuestionRepository;

    // =========================================================
    // SECURITY / INPUT LIMITS
    // =========================================================

    private static final int MAX_TITLE_LENGTH = 200;
    private static final int MAX_QUESTION_TEXT_LENGTH = 20_000;
    private static final int MAX_PROBLEM_STATEMENT_LENGTH = 50_000;

    private static final int MAX_CATEGORY_LENGTH = 100;
    private static final int MAX_LANGUAGE_LENGTH = 50;

    private static final int MAX_DESCRIPTION_LENGTH = 50_000;
    private static final int MAX_CONSTRAINTS_LENGTH = 20_000;
    private static final int MAX_INPUT_FORMAT_LENGTH = 10_000;
    private static final int MAX_OUTPUT_FORMAT_LENGTH = 10_000;
    private static final int MAX_EXAMPLES_LENGTH = 30_000;
    private static final int MAX_HINTS_LENGTH = 20_000;
    private static final int MAX_TAGS_LENGTH = 5_000;


    // =========================================================
    // GET ALL CODING QUESTIONS
    // =========================================================

    public List<AdminCodingQuestionDTO> getAllQuestions() {

        return codingQuestionRepository
                .findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET CODING QUESTION BY ID
    // =========================================================

    public AdminCodingQuestionDTO getQuestionById(Long codingId) {

        validateId(codingId);

        CodingQuestion question =
                codingQuestionRepository
                        .findById(codingId)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Coding question not found"
                                )
                        );

        return convertToDTO(question);
    }


    // =========================================================
    // GET QUESTIONS BY CATEGORY
    // =========================================================

    public List<AdminCodingQuestionDTO> getQuestionsByCategory(
            String category) {

        if (category == null ||
                category.trim().isEmpty()) {

            return getAllQuestions();
        }

        String normalizedCategory =
                normalizeAndValidate(
                        category,
                        MAX_CATEGORY_LENGTH,
                        "category"
                );

        return codingQuestionRepository
                .findByCategory(normalizedCategory)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET QUESTIONS BY DIFFICULTY
    // =========================================================

    public List<AdminCodingQuestionDTO> getQuestionsByDifficulty(
            String difficulty) {

        if (difficulty == null ||
                difficulty.trim().isEmpty()) {

            return getAllQuestions();
        }

        String normalizedDifficulty =
                normalizeAndValidate(
                        difficulty,
                        50,
                        "difficulty"
                );

        CodingQuestion.DifficultyLevel level;

        try {

            level =
                    CodingQuestion.DifficultyLevel.valueOf(
                            normalizedDifficulty.toUpperCase()
                    );

        } catch (IllegalArgumentException ex) {

            throw new IllegalArgumentException(
                    "Invalid difficulty level"
            );
        }

        return codingQuestionRepository
                .findByDifficultyLevel(level)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET QUESTIONS BY LANGUAGE
    // =========================================================

    public List<AdminCodingQuestionDTO> getQuestionsByLanguage(
            String language) {

        if (language == null ||
                language.trim().isEmpty()) {

            return getAllQuestions();
        }

        String normalizedLanguage =
                normalizeAndValidate(
                        language,
                        MAX_LANGUAGE_LENGTH,
                        "language"
                );

        return codingQuestionRepository
                .findByLanguage(
                        normalizedLanguage.toUpperCase()
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // CREATE CODING QUESTION
    // =========================================================

    @Transactional
    public AdminCodingQuestionDTO createQuestion(
            AdminCodingQuestionDTO dto) {

        validateDTO(dto);
        validateRequiredFields(dto);

        String title =
                normalizeAndValidate(
                        dto.getTitle(),
                        MAX_TITLE_LENGTH,
                        "title"
                );

        String questionText =
                normalizeAndValidate(
                        dto.getQuestionText(),
                        MAX_QUESTION_TEXT_LENGTH,
                        "question text"
                );

        String problemStatement =
                normalizeAndValidate(
                        dto.getProblemStatement(),
                        MAX_PROBLEM_STATEMENT_LENGTH,
                        "problem statement"
                );

        validateOptionalFields(dto);

        // -----------------------------------------------------
        // DUPLICATE TITLE CHECK
        // -----------------------------------------------------

        boolean titleExists =
                codingQuestionRepository
                        .findAll()
                        .stream()
                        .anyMatch(
                                question ->
                                        question != null &&
                                        question.getTitle() != null &&
                                        question.getTitle()
                                                .trim()
                                                .equalsIgnoreCase(title)
                        );

        if (titleExists) {

            throw new IllegalArgumentException(
                    "A coding question with this title already exists"
            );
        }


        // -----------------------------------------------------
        // CREATE ENTITY
        // -----------------------------------------------------

        CodingQuestion question =
                CodingQuestion.builder()

                        // Basic information
                        .title(title)

                        .questionText(questionText)

                        .problemStatement(problemStatement)


                        // Classification
                        .questionType(
                                dto.getQuestionType() != null
                                        ? dto.getQuestionType()
                                        : CodingQuestion.QuestionType.DSA
                        )

                        .category(
                                normalizeOptional(
                                        dto.getCategory()
                                )
                        )

                        .difficultyLevel(
                                dto.getDifficultyLevel()
                        )

                        .bloomsLevel(
                                dto.getBloomsLevel() != null
                                        ? dto.getBloomsLevel()
                                        : CodingQuestion.BloomsLevel.APPLY
                        )

                        .language(
                                dto.getLanguage() != null &&
                                        !dto.getLanguage().trim().isEmpty()
                                        ? dto.getLanguage()
                                                .trim()
                                                .toUpperCase()
                                        : "JAVA"
                        )


                        // Question content
                        .description(
                                normalizeOptional(
                                        dto.getDescription()
                                )
                        )

                        .constraints(
                                normalizeOptional(
                                        dto.getConstraints()
                                )
                        )

                        .inputFormat(
                                normalizeOptional(
                                        dto.getInputFormat()
                                )
                        )

                        .outputFormat(
                                normalizeOptional(
                                        dto.getOutputFormat()
                                )
                        )

                        .examples(
                                normalizeOptional(
                                        dto.getExamples()
                                )
                        )

                        .hints(
                                normalizeOptional(
                                        dto.getHints()
                                )
                        )

                        .tags(
                                normalizeOptional(
                                        dto.getTags()
                                )
                        )


                        // Defaults
                        .isFavorite(
                                dto.getIsFavorite() != null
                                        ? dto.getIsFavorite()
                                        : false
                        )

                        .acceptanceRate(0.0)

                        .totalSubmissions(0)

                        .totalAccepted(0)

                        .build();


        // -----------------------------------------------------
        // SAVE
        // -----------------------------------------------------

        CodingQuestion savedQuestion =
                codingQuestionRepository.save(question);


        // -----------------------------------------------------
        // RETURN DTO
        // -----------------------------------------------------

        return convertToDTO(savedQuestion);
    }


    // =========================================================
    // UPDATE CODING QUESTION
    // =========================================================

    @Transactional
    public AdminCodingQuestionDTO updateQuestion(
            Long codingId,
            AdminCodingQuestionDTO dto) {

        validateId(codingId);
        validateDTO(dto);
        validateRequiredFields(dto);

        String title =
                normalizeAndValidate(
                        dto.getTitle(),
                        MAX_TITLE_LENGTH,
                        "title"
                );

        String questionText =
                normalizeAndValidate(
                        dto.getQuestionText(),
                        MAX_QUESTION_TEXT_LENGTH,
                        "question text"
                );

        String problemStatement =
                normalizeAndValidate(
                        dto.getProblemStatement(),
                        MAX_PROBLEM_STATEMENT_LENGTH,
                        "problem statement"
                );

        validateOptionalFields(dto);


        // -----------------------------------------------------
        // FIND EXISTING QUESTION
        // -----------------------------------------------------

        CodingQuestion question =
                codingQuestionRepository
                        .findById(codingId)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Coding question not found"
                                )
                        );


        // -----------------------------------------------------
        // DUPLICATE TITLE CHECK
        // -----------------------------------------------------

        boolean duplicateTitle =
                codingQuestionRepository
                        .findAll()
                        .stream()
                        .anyMatch(
                                existingQuestion ->
                                        existingQuestion != null &&
                                        existingQuestion.getCodingId() != null &&
                                        !Objects.equals(
                                                existingQuestion.getCodingId(),
                                                codingId
                                        ) &&
                                        existingQuestion.getTitle() != null &&
                                        existingQuestion
                                                .getTitle()
                                                .trim()
                                                .equalsIgnoreCase(title)
                        );

        if (duplicateTitle) {

            throw new IllegalArgumentException(
                    "A coding question with this title already exists"
            );
        }


        // -----------------------------------------------------
        // UPDATE BASIC INFORMATION
        // -----------------------------------------------------

        question.setTitle(title);

        question.setQuestionText(questionText);

        question.setProblemStatement(problemStatement);


        // -----------------------------------------------------
        // UPDATE CLASSIFICATION
        // -----------------------------------------------------

        question.setQuestionType(
                dto.getQuestionType() != null
                        ? dto.getQuestionType()
                        : CodingQuestion.QuestionType.DSA
        );

        question.setCategory(
                normalizeOptional(
                        dto.getCategory()
                )
        );

        question.setDifficultyLevel(
                dto.getDifficultyLevel()
        );

        question.setBloomsLevel(
                dto.getBloomsLevel() != null
                        ? dto.getBloomsLevel()
                        : CodingQuestion.BloomsLevel.APPLY
        );

        question.setLanguage(
                dto.getLanguage() != null &&
                        !dto.getLanguage().trim().isEmpty()
                        ? dto.getLanguage()
                                .trim()
                                .toUpperCase()
                        : "JAVA"
        );


        // -----------------------------------------------------
        // UPDATE QUESTION CONTENT
        // -----------------------------------------------------

        question.setDescription(
                normalizeOptional(
                        dto.getDescription()
                )
        );

        question.setConstraints(
                normalizeOptional(
                        dto.getConstraints()
                )
        );

        question.setInputFormat(
                normalizeOptional(
                        dto.getInputFormat()
                )
        );

        question.setOutputFormat(
                normalizeOptional(
                        dto.getOutputFormat()
                )
        );

        question.setExamples(
                normalizeOptional(
                        dto.getExamples()
                )
        );

        question.setHints(
                normalizeOptional(
                        dto.getHints()
                )
        );

        question.setTags(
                normalizeOptional(
                        dto.getTags()
                )
        );


        // -----------------------------------------------------
        // UPDATE FAVORITE STATUS
        // -----------------------------------------------------

        if (dto.getIsFavorite() != null) {

            question.setIsFavorite(
                    dto.getIsFavorite()
            );
        }


        // -----------------------------------------------------
        // IMPORTANT:
        //
        // DO NOT MODIFY:
        //
        // acceptanceRate
        // totalSubmissions
        // totalAccepted
        // createdAt
        //
        // These are existing statistics/history.
        // -----------------------------------------------------


        // -----------------------------------------------------
        // SAVE UPDATED QUESTION
        // -----------------------------------------------------

        CodingQuestion updatedQuestion =
                codingQuestionRepository.save(question);


        // -----------------------------------------------------
        // RETURN UPDATED DTO
        // -----------------------------------------------------

        return convertToDTO(updatedQuestion);
    }


    // =========================================================
    // DELETE CODING QUESTION
    // =========================================================

    @Transactional
    public void deleteQuestion(
            Long codingId) {

        validateId(codingId);

        // -----------------------------------------------------
        // CHECK QUESTION EXISTS
        // -----------------------------------------------------

        CodingQuestion question =
                codingQuestionRepository
                        .findById(codingId)
                        .orElseThrow(
                                () -> new IllegalArgumentException(
                                        "Coding question not found"
                                )
                        );


        // -----------------------------------------------------
        // DELETE
        // -----------------------------------------------------

        codingQuestionRepository.delete(question);
    }


    // =========================================================
    // REQUIRED FIELD VALIDATION
    // =========================================================

    private void validateRequiredFields(
            AdminCodingQuestionDTO dto) {

        if (dto.getTitle() == null ||
                dto.getTitle().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Question title cannot be empty"
            );
        }

        if (dto.getQuestionText() == null ||
                dto.getQuestionText().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Question text cannot be empty"
            );
        }

        if (dto.getProblemStatement() == null ||
                dto.getProblemStatement().trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Problem statement cannot be empty"
            );
        }

        if (dto.getDifficultyLevel() == null) {

            throw new IllegalArgumentException(
                    "Difficulty level is required"
            );
        }
    }


    // =========================================================
    // DTO VALIDATION
    // =========================================================

    private void validateDTO(
            AdminCodingQuestionDTO dto) {

        if (dto == null) {

            throw new IllegalArgumentException(
                    "Question data cannot be null"
            );
        }
    }


    // =========================================================
    // OPTIONAL FIELD VALIDATION
    // =========================================================

    private void validateOptionalFields(
            AdminCodingQuestionDTO dto) {

        validateOptionalLength(
                dto.getCategory(),
                MAX_CATEGORY_LENGTH,
                "category"
        );

        validateOptionalLength(
                dto.getLanguage(),
                MAX_LANGUAGE_LENGTH,
                "language"
        );

        validateOptionalLength(
                dto.getDescription(),
                MAX_DESCRIPTION_LENGTH,
                "description"
        );

        validateOptionalLength(
                dto.getConstraints(),
                MAX_CONSTRAINTS_LENGTH,
                "constraints"
        );

        validateOptionalLength(
                dto.getInputFormat(),
                MAX_INPUT_FORMAT_LENGTH,
                "input format"
        );

        validateOptionalLength(
                dto.getOutputFormat(),
                MAX_OUTPUT_FORMAT_LENGTH,
                "output format"
        );

        validateOptionalLength(
                dto.getExamples(),
                MAX_EXAMPLES_LENGTH,
                "examples"
        );

        validateOptionalLength(
                dto.getHints(),
                MAX_HINTS_LENGTH,
                "hints"
        );

        validateOptionalLength(
                dto.getTags(),
                MAX_TAGS_LENGTH,
                "tags"
        );
    }


    // =========================================================
    // STRING VALIDATION
    // =========================================================

    private String normalizeAndValidate(
            String value,
            int maxLength,
            String fieldName) {

        if (value == null) {

            throw new IllegalArgumentException(
                    fieldName + " cannot be null"
            );
        }

        String normalized = value.trim();

        if (normalized.isEmpty()) {

            throw new IllegalArgumentException(
                    fieldName + " cannot be empty"
            );
        }

        if (normalized.length() > maxLength) {

            throw new IllegalArgumentException(
                    fieldName + " exceeds the maximum allowed length"
            );
        }

        return normalized;
    }


    private void validateOptionalLength(
            String value,
            int maxLength,
            String fieldName) {

        if (value == null) {
            return;
        }

        if (value.length() > maxLength) {

            throw new IllegalArgumentException(
                    fieldName + " exceeds the maximum allowed length"
            );
        }
    }


    private String normalizeOptional(
            String value) {

        if (value == null) {
            return null;
        }

        String normalized = value.trim();

        return normalized.isEmpty()
                ? null
                : normalized;
    }


    // =========================================================
    // ID VALIDATION
    // =========================================================

    private void validateId(Long codingId) {

        if (codingId == null ||
                codingId <= 0) {

            throw new IllegalArgumentException(
                    "Invalid coding question ID"
            );
        }
    }


    // =========================================================
    // CONVERT ENTITY → DTO
    // =========================================================

    private AdminCodingQuestionDTO convertToDTO(
            CodingQuestion question) {

        if (question == null) {
            throw new IllegalArgumentException(
                    "Coding question data is unavailable"
            );
        }

        return AdminCodingQuestionDTO.builder()

                // -------------------------------------------------
                // BASIC INFORMATION
                // -------------------------------------------------

                .codingId(
                        question.getCodingId()
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

                .language(
                        question.getLanguage()
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

                .examples(
                        question.getExamples()
                )

                .hints(
                        question.getHints()
                )

                .tags(
                        question.getTags()
                )


                // -------------------------------------------------
                // QUESTION STATUS
                // -------------------------------------------------

                .isFavorite(
                        question.getIsFavorite()
                )


                // -------------------------------------------------
                // STATISTICS
                // -------------------------------------------------

                .acceptanceRate(
                        question.getAcceptanceRate()
                )

                .totalSubmissions(
                        question.getTotalSubmissions()
                )

                .totalAccepted(
                        question.getTotalAccepted()
                )


                // -------------------------------------------------
                // TIMESTAMPS
                // -------------------------------------------------

                .createdAt(
                        question.getCreatedAt()
                )

                .updatedAt(
                        question.getUpdatedAt()
                )

                .build();
    }
}