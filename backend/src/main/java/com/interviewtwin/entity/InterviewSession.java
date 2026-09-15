package com.interviewtwin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(
    name = "interview_sessions",
    indexes = {
        @Index(
            name = "idx_user_id",
            columnList = "user_id"
        ),
        @Index(
            name = "idx_created_at",
            columnList = "created_at"
        )
    }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long sessionId;

    // =========================================================
    // USER
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;

    // =========================================================
    // INTERVIEW TYPE
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "type_id",
        nullable = false
    )
    private InterviewType interviewType;

    // =========================================================
    // SESSION DETAILS
    // =========================================================

    private String sessionTitle;

    @Column(
        nullable = false,
        updatable = false
    )
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer durationMinutes;

    @Builder.Default
    private String status = "IN_PROGRESS";

    // =========================================================
    // SCORE
    // =========================================================

    @Column(
        precision = 5,
        scale = 2
    )
    private BigDecimal overallScore;

    // =========================================================
    // FEEDBACK
    // =========================================================

    @Column(
        columnDefinition = "TEXT"
    )
    private String feedback;

    // =========================================================
    // ADMIN REVIEW FLAG
    // =========================================================
    //
    // false = normal interview
    // true  = administrator wants this interview reviewed
    //
    // IMPORTANT:
    // This is completely independent from status.
    //
    // Example:
    //
    // status = COMPLETED
    // flaggedForReview = true
    //
    // The interview is still completed, but an admin has
    // marked it for additional review.
    // =========================================================

    @Builder.Default
    @Column(
        name = "flagged_for_review",
        nullable = false
    )
    private Boolean flaggedForReview = false;

    // =========================================================
    // TIMESTAMPS
    // =========================================================

    @Column(
        nullable = false,
        updatable = false
    )
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    // =========================================================
    // CURRENT QUESTION INDEX
    // =========================================================
    //
    // This is used by Start Interview to remember which
    // question the user is currently viewing.
    //
    // -1 = interview started but no question requested yet
    //  0 = first question
    //  1 = second question
    //  2 = third question
    //  ...
    //
    // IMPORTANT:
    // This is independent from submitted answers.
    //
    // Therefore:
    //
    // Question 1
    //      ↓ Next
    // Question 2
    //
    // works even when Question 1 was NOT submitted.
    // =========================================================

    @Builder.Default
    @Column(
        name = "current_question_index",
        nullable = false
    )
    private Integer currentQuestionIndex = -1;

    // =========================================================
    // ANSWERS
    // =========================================================

    @OneToMany(
        mappedBy = "interviewSession",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    @Builder.Default
    private List<Answer> answers =
        new ArrayList<>();

    // =========================================================
    // PRE-PERSIST
    // =========================================================

    @PrePersist
    protected void onCreate() {

        if (startTime == null) {
            startTime =
                LocalDateTime.now();
        }

        if (createdAt == null) {
            createdAt =
                LocalDateTime.now();
        }

        updatedAt =
            LocalDateTime.now();

        if (currentQuestionIndex == null) {
            currentQuestionIndex = -1;
        }

        if (status == null) {
            status = "IN_PROGRESS";
        }

        if (flaggedForReview == null) {
            flaggedForReview = false;
        }
    }

    // =========================================================
    // PRE-UPDATE
    // =========================================================

    @PreUpdate
    protected void onUpdate() {

        updatedAt =
            LocalDateTime.now();

        if (currentQuestionIndex == null) {
            currentQuestionIndex = -1;
        }

        if (flaggedForReview == null) {
            flaggedForReview = false;
        }
    }
}