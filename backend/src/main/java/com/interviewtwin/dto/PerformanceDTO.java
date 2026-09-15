package com.interviewtwin.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PerformanceDTO {

    private Long performanceId;
    private Long userId;
    private BigDecimal atsScore;
    private BigDecimal technicalScore;
    private BigDecimal hrScore;
    private BigDecimal codingScore;
    private BigDecimal communicationScore;
    private BigDecimal overallPlacementReadiness;
    private Integer totalInterviews;
    private Integer totalCodingProblems;
    private String weakTopics;
    private String strongTopics;
}