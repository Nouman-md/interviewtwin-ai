package com.interviewtwin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "learning_roadmap", indexes = @Index(name = "idx_user_id", columnList = "user_id"))
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roadmapId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String topicName;

    private String category;

    private String currentLevel;

    private String targetLevel;

    @Builder.Default
    private Integer progressPercentage = 0;

    @Column(columnDefinition = "TEXT")
    private String suggestedResources;

    @Column(columnDefinition = "TEXT")
    private String practiceProblems;

    private Integer estimatedHours;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
