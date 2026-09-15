package com.interviewtwin.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "aptitude_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AptitudeQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "aptitude_id")
    private Long aptitudeId;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(name = "problem_statement", nullable = false, columnDefinition = "TEXT")
    private String problemStatement;

    @Column(name = "question_type", nullable = false, length = 50)
    private String questionType;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(name = "difficulty_level", nullable = false, length = 20)
    private String difficultyLevel;

    @Column(name = "blooms_level", length = 30)
    private String bloomsLevel;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(name = "input_format", columnDefinition = "TEXT")
    private String inputFormat;

    @Column(name = "output_format", columnDefinition = "TEXT")
    private String outputFormat;

    @Column(columnDefinition = "JSON")
    private String options;

    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @Column(columnDefinition = "JSON")
    private String hints;

    @Column(columnDefinition = "JSON")
    private String tags;

    @Column(name = "acceptance_rate", precision = 5, scale = 2)
    private BigDecimal acceptanceRate;

    @Column(name = "total_attempts")
    private Integer totalAttempts = 0;

    @Column(name = "total_correct")
    private Integer totalCorrect = 0;

    @Column(name = "created_at")
    private LocalDateTime createdAt;
}