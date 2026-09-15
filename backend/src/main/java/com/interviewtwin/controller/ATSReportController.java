package com.interviewtwin.controller;

import com.interviewtwin.dto.ATSReportDTO;
import com.interviewtwin.dto.JobMatchDTO;
import com.interviewtwin.dto.JobMatchRequestDTO;
import com.interviewtwin.security.SecurityUtils;
import com.interviewtwin.service.ATSReportService;
import com.interviewtwin.service.JobMatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ats")
@RequiredArgsConstructor
public class ATSReportController {

    private static final int MAX_JOB_DESCRIPTION_LENGTH = 50_000;
    private static final int MAX_JOB_TITLE_LENGTH = 200;
    private static final int MAX_COMPANY_NAME_LENGTH = 200;

    private final ATSReportService atsReportService;
    private final SecurityUtils securityUtils;
    private final JobMatchService jobMatchService;


    // =========================================================
    // ATS RESUME ANALYSIS
    // =========================================================

    @PostMapping("/analyze/{resumeId}")
    public ResponseEntity<?> analyzeResume(
            Authentication authentication,
            @PathVariable Long resumeId) {

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            ATSReportDTO report =
                    atsReportService.analyzeResume(
                            userId,
                            resumeId);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(report);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message", "Invalid resume request",
                            "success", false
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", "Resume or analysis not found",
                            "success", false
                    ));
        }
    }


    // =========================================================
    // GET USER ATS REPORTS
    // =========================================================

    @GetMapping("/reports")
    public ResponseEntity<?> getUserReports(
            Authentication authentication) {

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            List<ATSReportDTO> reports =
                    atsReportService.getUserReports(userId);

            return ResponseEntity.ok(reports);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message", "Failed to retrieve ATS reports",
                            "success", false
                    ));
        }
    }


    // =========================================================
    // GET LATEST ATS REPORT
    // =========================================================

    @GetMapping("/latest")
    public ResponseEntity<?> getLatestReport(
            Authentication authentication) {

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            ATSReportDTO report =
                    atsReportService.getLatestReport(userId);

            return ResponseEntity.ok(report);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", "No ATS report found",
                            "success", false
                    ));
        }
    }


    // =========================================================
    // GET SPECIFIC ATS REPORT
    // =========================================================

    @GetMapping("/{reportId}")
    public ResponseEntity<?> getReport(
            Authentication authentication,
            @PathVariable Long reportId) {

        try {
            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            ATSReportDTO report =
                    atsReportService.getReportById(
                            reportId,
                            userId);

            return ResponseEntity.ok(report);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", "ATS report not found",
                            "success", false
                    ));
        }
    }


    // =========================================================
    // JOB MATCH BY JOB ID
    // =========================================================

    @PostMapping("/analyze-job-match/{jobId}/{resumeId}")
    public ResponseEntity<?> analyzeJobMatch(
            Authentication authentication,
            @PathVariable Long jobId,
            @PathVariable Long resumeId) {

        try {

            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            JobMatchDTO result =
                    atsReportService.analyzeJobMatch(
                            userId,
                            jobId,
                            resumeId);

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message", "Invalid job match request",
                            "success", false
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message", "Job or resume not found",
                            "success", false
                    ));
        }
    }


    // =========================================================
    // FAST JOB MATCH USING JOB DESCRIPTION TEXT
    // =========================================================

    @PostMapping("/analyze-job-match-text/{resumeId}")
    public ResponseEntity<?> analyzeJobMatchText(
            Authentication authentication,
            @PathVariable Long resumeId,
            @RequestBody Map<String, String> request) {

        try {

            Long userId =
                    securityUtils.getCurrentUserId(authentication);

            // -------------------------------------------------
            // Validate request body
            // -------------------------------------------------

            if (request == null) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Request body is required",
                                "success",
                                false
                        ));
            }

            // -------------------------------------------------
            // Job description
            // -------------------------------------------------

            String jobDescription =
                    request.get("jobDescription");

            if (jobDescription == null) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Job description is required",
                                "success",
                                false
                        ));
            }

            jobDescription =
                    jobDescription.trim();

            if (jobDescription.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Job description is required",
                                "success",
                                false
                        ));
            }

            if (jobDescription.length()
                    > MAX_JOB_DESCRIPTION_LENGTH) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Job description is too long",
                                "success",
                                false
                        ));
            }

            // -------------------------------------------------
            // Optional job title
            // -------------------------------------------------

            String jobTitle =
                    request.get("jobTitle");

            if (jobTitle == null ||
                    jobTitle.trim().isEmpty()) {

                jobTitle =
                        "Custom Job Description";

            } else {

                jobTitle =
                        jobTitle.trim();

                if (jobTitle.length()
                        > MAX_JOB_TITLE_LENGTH) {

                    return ResponseEntity
                            .badRequest()
                            .body(Map.of(
                                    "message",
                                    "Job title is too long",
                                    "success",
                                    false
                            ));
                }
            }

            // -------------------------------------------------
            // Optional company name
            // -------------------------------------------------

            String companyName =
                    request.get("companyName");

            if (companyName == null ||
                    companyName.trim().isEmpty()) {

                companyName = "N/A";

            } else {

                companyName =
                        companyName.trim();

                if (companyName.length()
                        > MAX_COMPANY_NAME_LENGTH) {

                    return ResponseEntity
                            .badRequest()
                            .body(Map.of(
                                    "message",
                                    "Company name is too long",
                                    "success",
                                    false
                            ));
                }
            }

            // -------------------------------------------------
            // Build Job Match request
            // -------------------------------------------------

            JobMatchRequestDTO jobMatchRequest =
                    JobMatchRequestDTO.builder()
                            .resumeId(resumeId)
                            .jobTitle(jobTitle)
                            .companyName(companyName)
                            .jobDescription(jobDescription)
                            .build();

            // -------------------------------------------------
            // Local job match analysis
            // -------------------------------------------------

            JobMatchDTO result =
                    jobMatchService.analyze(
                            userId,
                            jobMatchRequest);

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Invalid job match request",
                            "success",
                            false
                    ));

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to analyze job match",
                            "success",
                            false
                    ));
        }
    }
}
