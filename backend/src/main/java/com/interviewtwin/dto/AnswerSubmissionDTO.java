package com.interviewtwin.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnswerSubmissionDTO {

    private Long sessionId;

    private Long questionId;

    @NotBlank(message = "Answer cannot be empty")
    private String userAnswer;

    private String audioUrl;

    private Long duration;
}
