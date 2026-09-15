package com.interviewtwin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AptitudeQuestionResponse {

    private Long aptitudeId;
    private String title;
    private String questionText;
    private String problemStatement;
    private String questionType;
    private String category;
    private String difficultyLevel;
    private String bloomsLevel;
    private String description;
    private String constraints;
    private String inputFormat;
    private String outputFormat;

    private List<String> options;

    private String explanation;
    private List<String> hints;
    private List<String> tags;

    private Double acceptanceRate;
    private Integer totalAttempts;
    private Integer totalCorrect;
}