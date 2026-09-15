package com.interviewtwin.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatchDTO {

    private Long jobId;
    private Long resumeId;
    private String jobTitle;
    private String companyName;
    private BigDecimal matchPercentage;
    private List<String> matchingSkills;
    private List<String> missingSkills;
    private List<String> suggestions;
    private LocalDateTime analyzedAt;
}
