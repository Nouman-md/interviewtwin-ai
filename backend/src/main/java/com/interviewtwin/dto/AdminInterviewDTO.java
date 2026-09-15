package com.interviewtwin.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminInterviewDTO {

    private Long sessionId;

    // =========================================================
    // USER INFORMATION
    // =========================================================

    private Long userId;

    private String userName;

    private String userEmail;


    // =========================================================
    // INTERVIEW INFORMATION
    // =========================================================

    private Long interviewTypeId;

    private String interviewType;

    private String sessionTitle;


    // =========================================================
    // SESSION STATUS
    // =========================================================

    private String status;


    // =========================================================
    // ADMIN REVIEW
    // =========================================================
    //
    // false = normal interview
    // true  = flagged by administrator
    // =========================================================

    private Boolean flaggedForReview;


    // =========================================================
    // PERFORMANCE
    // =========================================================

    private BigDecimal overallScore;


    // =========================================================
    // TIMING
    // =========================================================

    private Integer durationMinutes;

    private LocalDateTime startTime;

    private LocalDateTime endTime;


    // =========================================================
    // FEEDBACK
    // =========================================================

    private String feedback;


    // =========================================================
    // ANSWERS
    // =========================================================

    private Integer answerCount;


    // =========================================================
    // TIMESTAMPS
    // =========================================================

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}