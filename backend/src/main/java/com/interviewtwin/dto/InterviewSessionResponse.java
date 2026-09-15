package com.interviewtwin.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSessionResponse {

    private Long sessionId;
    private String sessionTitle;
    private String status;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes;
    private BigDecimal overallScore;
    private String feedback;
    private Long userId;
    private Long interviewTypeId;
    private String interviewType;
}