package com.interviewtwin.controller;

import com.interviewtwin.dto.JobMatchDTO;
import com.interviewtwin.dto.JobMatchRequestDTO;
import com.interviewtwin.security.SecurityUtils;
import com.interviewtwin.service.JobMatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/job-match")
@RequiredArgsConstructor
public class JobMatchController {

    private final JobMatchService jobMatchService;
    private final SecurityUtils securityUtils;

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeJobMatch(
            Authentication authentication,
            @Valid @RequestBody JobMatchRequestDTO request) {

        try {

            Long userId =
                    securityUtils.getCurrentUserId(
                            authentication);

            JobMatchDTO result =
                    jobMatchService.analyze(
                            userId,
                            request);

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage(),
                                    "success",
                                    false
                            )
                    );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage(),
                                    "success",
                                    false
                            )
                    );
        }
    }
}