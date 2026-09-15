package com.interviewtwin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "questions", indexes = @Index(name = "idx_type_id", columnList = "type_id"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long questionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_id", nullable = false)
    @JsonIgnore
    private InterviewType interviewType;

    private String category;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    private String difficultyLevel;

    @Column(columnDefinition = "TEXT")
    private String expectedKeyPoints;

    @Column(columnDefinition = "TEXT")
    private String modelAnswer;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    private List<Answer> answers = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
