package com.interviewtwin.dto;

import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeSearchDTO {

    private Long resumeId;
    private String fileName;
    private String query;
    private int totalMatches;
    private List<SearchResult> results;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchResult {
        private String matchText;
        private String context;
        private int position;
        private int lineNumber;
    }
}
