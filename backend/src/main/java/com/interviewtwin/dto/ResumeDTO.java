package com.interviewtwin.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeDTO {

    private Long resumeId;
    private Long userId;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private Boolean isPrimary;
    private LocalDateTime uploadedAt;
    private LocalDateTime updatedAt;
}