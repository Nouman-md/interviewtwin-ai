package com.interviewtwin.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardDTO {

    private long totalUsers;

    private long totalInterviews;

    private long totalCodingQuestions;

    private long totalAptitudeQuestions;
}