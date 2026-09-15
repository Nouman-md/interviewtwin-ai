package com.interviewtwin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "coding_questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CodingQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codingId;

    @Column(nullable = false, unique = true)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String problemStatement;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private QuestionType questionType = QuestionType.DSA;

    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficultyLevel;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "ENUM('REMEMBER','UNDERSTAND','APPLY','ANALYZE','EVALUATE','CREATE') DEFAULT 'APPLY'")
    private BloomsLevel bloomsLevel;

    @Builder.Default
    private String language = "JAVA";

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String constraints;

    @Column(columnDefinition = "TEXT")
    private String inputFormat;

    @Column(columnDefinition = "TEXT")
    private String outputFormat;

    @Column(columnDefinition = "JSON")
    private String examples;

    @Column(columnDefinition = "JSON")
    private String hints;

    @Column(columnDefinition = "JSON")
    private String tags;

    @Builder.Default
    private Boolean isFavorite = false;

    @Builder.Default
    private Double acceptanceRate = 0.0;

    @Builder.Default
    private Integer totalSubmissions = 0;

    @Builder.Default
    private Integer totalAccepted = 0;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "codingQuestion", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<CodingSubmission> submissions = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum DifficultyLevel {
        EASY, MEDIUM, HARD
    }

    public enum BloomsLevel {
        REMEMBER, UNDERSTAND, APPLY, ANALYZE, EVALUATE, CREATE
    }

    public enum QuestionType {
        DSA, PROGRAMMING
    }
}
