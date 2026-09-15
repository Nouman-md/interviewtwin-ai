package com.interviewtwin.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatchRequestDTO {

    @NotNull
    private Long resumeId;

    private String jobTitle;

    private String companyName;

    @NotBlank
    private String jobDescription;
}