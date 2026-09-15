package com.interviewtwin.controller;

import com.interviewtwin.dto.ResumeDTO;
import com.interviewtwin.dto.ResumeSearchDTO;
import com.interviewtwin.security.SecurityUtils;
import com.interviewtwin.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private static final int MAX_SEARCH_QUERY_LENGTH = 100;

    private final ResumeService resumeService;
    private final SecurityUtils securityUtils;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        try {
            Long userId = securityUtils.getCurrentUserId(authentication);

            ResumeDTO resume =
                    resumeService.uploadResume(userId, file);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(resume);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message", safeMessage(e),
                            "success", "false"
                    ));

        } catch (IOException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Failed to upload resume",
                            "success", "false"
                    ));
        }
    }

    @GetMapping
    public ResponseEntity<List<ResumeDTO>> getUserResumes(
            Authentication authentication) {

        Long userId =
                securityUtils.getCurrentUserId(authentication);

        List<ResumeDTO> resumes =
                resumeService.getUserResumes(userId);

        return ResponseEntity.ok(resumes);
    }

    @GetMapping("/{resumeId}")
    public ResponseEntity<?> getResume(
            Authentication authentication,
            @PathVariable Long resumeId) {

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            ResumeDTO resume =
                    resumeService.getResumeById(
                            resumeId,
                            userId
                    );

            return ResponseEntity.ok(resume);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", "Resume not found",
                            "success", "false"
                    ));
        }
    }

    @PutMapping("/{resumeId}/set-primary")
    public ResponseEntity<?> setPrimaryResume(
            Authentication authentication,
            @PathVariable Long resumeId) {

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            ResumeDTO resume =
                    resumeService.setPrimaryResume(
                            resumeId,
                            userId
                    );

            return ResponseEntity.ok(resume);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", "Resume not found",
                            "success", "false"
                    ));
        }
    }

    @DeleteMapping("/{resumeId}")
    public ResponseEntity<Map<String, String>> deleteResume(
            Authentication authentication,
            @PathVariable Long resumeId) {

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            resumeService.deleteResume(
                    resumeId,
                    userId
            );

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Resume deleted successfully",
                            "success",
                            "true"
                    )
            );

        } catch (IOException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to delete resume",
                            "success",
                            "false"
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Resume not found",
                            "success",
                            "false"
                    ));
        }
    }

    @GetMapping("/{resumeId}/download")
    public ResponseEntity<?> downloadResume(
            Authentication authentication,
            @PathVariable Long resumeId) {

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            ResumeDTO resume =
                    resumeService.getResumeById(
                            resumeId,
                            userId
                    );

            byte[] fileContent =
                    resumeService.getResumeFile(
                            resumeId,
                            userId
                    );

            String fileName =
                    sanitizeDownloadFileName(
                            resume.getFileName()
                    );

            String contentDisposition =
                    "attachment; filename=\"" +
                            fileName +
                            "\"";

            return ResponseEntity
                    .ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            contentDisposition
                    )
                    .header(
                            "X-Content-Type-Options",
                            "nosniff"
                    )
                    .contentType(
                            MediaType.APPLICATION_OCTET_STREAM
                    )
                    .body(fileContent);

        } catch (IOException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to download resume",
                            "success",
                            "false"
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Resume not found",
                            "success",
                            "false"
                    ));
        }
    }

    /**
     * Search for a query string within a specific resume's content.
     */
    @GetMapping("/{resumeId}/search")
    public ResponseEntity<?> searchInResume(
            Authentication authentication,
            @PathVariable Long resumeId,
            @RequestParam String query) {

        String validatedQuery =
                validateSearchQuery(query);

        if (validatedQuery == null) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Search query must contain between 1 and "
                                    + MAX_SEARCH_QUERY_LENGTH
                                    + " characters",
                            "success",
                            "false"
                    ));
        }

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            ResumeSearchDTO result =
                    resumeService.searchInResume(
                            userId,
                            resumeId,
                            validatedQuery
                    );

            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Resume not found",
                            "success",
                            "false"
                    ));
        }
    }

    /**
     * Search for a query string across all of the user's
     * uploaded resumes.
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchAcrossAllResumes(
            Authentication authentication,
            @RequestParam String query) {

        String validatedQuery =
                validateSearchQuery(query);

        if (validatedQuery == null) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Search query must contain between 1 and "
                                    + MAX_SEARCH_QUERY_LENGTH
                                    + " characters",
                            "success",
                            "false"
                    ));
        }

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            List<ResumeSearchDTO> results =
                    resumeService.searchAcrossAllResumes(
                            userId,
                            validatedQuery
                    );

            return ResponseEntity.ok(results);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to search resumes",
                            "success",
                            "false"
                    ));
        }
    }

    /**
     * Validates and limits the search query.
     */
    private String validateSearchQuery(String query) {

        if (query == null) {
            return null;
        }

        String trimmed =
                query.trim();

        if (trimmed.isEmpty() ||
                trimmed.length() > MAX_SEARCH_QUERY_LENGTH) {

            return null;
        }

        return trimmed;
    }

    /**
     * Prevents unsafe characters from being placed into the
     * Content-Disposition filename header.
     */
    private String sanitizeDownloadFileName(
            String fileName) {

        if (fileName == null ||
                fileName.isBlank()) {

            return "resume";
        }

        String sanitized =
                fileName
                        .replace("\\", "_")
                        .replace("/", "_")
                        .replace("\"", "_")
                        .replace("\r", "_")
                        .replace("\n", "_")
                        .replace("\t", "_")
                        .trim();

        if (sanitized.isEmpty()) {
            return "resume";
        }

        if (sanitized.length() > 180) {
            sanitized =
                    sanitized.substring(0, 180);
        }

        return sanitized;
    }

    /**
     * Provides a safe validation message without exposing
     * internal server details.
     */
    private String safeMessage(
            IllegalArgumentException e) {

        String message =
                e.getMessage();

        if (message == null ||
                message.isBlank()) {

            return "Invalid resume upload";
        }

        return message;
    }
}