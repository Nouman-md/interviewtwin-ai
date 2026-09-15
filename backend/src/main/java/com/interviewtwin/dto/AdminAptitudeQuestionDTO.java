package com.interviewtwin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAptitudeQuestionDTO {

    // =========================================================
    // BASIC INFORMATION
    // =========================================================

    private Long aptitudeId;

    private String title;

    private String questionText;

    private String problemStatement;


    // =========================================================
    // CLASSIFICATION
    // =========================================================

    private String questionType;

    private String category;

    private String difficultyLevel;

    private String bloomsLevel;


    // =========================================================
    // QUESTION CONTENT
    // =========================================================

    private String description;

    private String constraints;

    private String inputFormat;

    private String outputFormat;


    // =========================================================
    // APTITUDE-SPECIFIC CONTENT
    // =========================================================

    private List<String> options;

    private String correctAnswer;

    private String explanation;

    private List<String> hints;

    private List<String> tags;


    // =========================================================
    // STATISTICS
    // =========================================================

    private BigDecimal acceptanceRate;

    private Integer totalAttempts;

    private Integer totalCorrect;


    // =========================================================
    // TIMESTAMP
    // =========================================================

    private LocalDateTime createdAt;
}