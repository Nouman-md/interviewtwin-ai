package com.interviewtwin.dto;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ATSReportDTO {

    private Long reportId;
    private Long userId;
    private Long resumeId;
    private BigDecimal atsScore;
    private BigDecimal keywordScore;
    private BigDecimal formattingScore;
    private BigDecimal contentScore;
    private String missingKeywords;
    private String foundKeywords;
    private String improvementSuggestions;
    private String grammarIssues;
    private String sectionAnalysis;
    private String reportData;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
