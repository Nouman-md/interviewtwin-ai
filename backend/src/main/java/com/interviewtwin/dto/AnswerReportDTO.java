package com.interviewtwin.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerReportDTO {

    private Long answerId;

    private Long questionId;

    private String questionText;

    private String userAnswer;

    private BigDecimal answerScore;

    private String feedback;

    private String strengths;

    private String improvements;

    private String aiEvaluation;

    private LocalDateTime createdAt;
}