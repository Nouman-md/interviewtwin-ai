package com.interviewtwin.dto;

import com.interviewtwin.entity.CodingQuestion;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminCodingQuestionDTO {

    // =========================================================
    // BASIC INFORMATION
    // =========================================================

    private Long codingId;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Question text is required")
    @Size(max = 20_000, message = "Question text must not exceed 20000 characters")
    private String questionText;

    @NotBlank(message = "Problem statement is required")
    @Size(max = 50_000, message = "Problem statement must not exceed 50000 characters")
    private String problemStatement;


    // =========================================================
    // CLASSIFICATION
    // =========================================================

    private CodingQuestion.QuestionType questionType;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    private String category;

    private CodingQuestion.DifficultyLevel difficultyLevel;

    private CodingQuestion.BloomsLevel bloomsLevel;

    @Size(max = 50, message = "Language must not exceed 50 characters")
    private String language;


    // =========================================================
    // QUESTION CONTENT
    // =========================================================

    @Size(max = 50_000, message = "Description must not exceed 50000 characters")
    private String description;

    @Size(max = 20_000, message = "Constraints must not exceed 20000 characters")
    private String constraints;

    @Size(max = 10_000, message = "Input format must not exceed 10000 characters")
    private String inputFormat;

    @Size(max = 10_000, message = "Output format must not exceed 10000 characters")
    private String outputFormat;

    @Size(max = 30_000, message = "Examples must not exceed 30000 characters")
    private String examples;

    @Size(max = 20_000, message = "Hints must not exceed 20000 characters")
    private String hints;

    @Size(max = 5_000, message = "Tags must not exceed 5000 characters")
    private String tags;


    // =========================================================
    // QUESTION STATUS
    // =========================================================

    private Boolean isFavorite;


    // =========================================================
    // STATISTICS
    //
    // These fields are returned to the admin UI but must NEVER
    // be trusted as client-controlled values.
    //
    // AdminCodingQuestionService intentionally does not copy
    // these incoming values into the entity during create/update.
    // =========================================================

    @DecimalMin(
            value = "0.0",
            message = "Acceptance rate cannot be negative"
    )
    @DecimalMax(
            value = "100.0",
            message = "Acceptance rate cannot exceed 100"
    )
    private Double acceptanceRate;

    @Min(
            value = 0,
            message = "Total submissions cannot be negative"
    )
    private Integer totalSubmissions;

    @Min(
            value = 0,
            message = "Total accepted cannot be negative"
    )
    private Integer totalAccepted;


    // =========================================================
    // TIMESTAMPS
    //
    // Server-controlled fields. They are included because the
    // admin UI may display them, but the service must not trust
    // client-supplied values.
    // =========================================================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}