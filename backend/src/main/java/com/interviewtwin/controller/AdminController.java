package com.interviewtwin.controller;

import com.interviewtwin.dto.AdminDashboardDTO;
import com.interviewtwin.repository.AptitudeQuestionRepository;
import com.interviewtwin.repository.CodingQuestionRepository;
import com.interviewtwin.repository.InterviewSessionRepository;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final UserRepository userRepository;
    private final InterviewSessionRepository interviewSessionRepository;
    private final CodingQuestionRepository codingQuestionRepository;
    private final AptitudeQuestionRepository aptitudeQuestionRepository;

    // =========================================================
    // ADMIN PROFILE
    // =========================================================

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getAdminProfile(
            Authentication authentication) {

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            return ResponseEntity.status(401).build();
        }

        Map<String, Object> response =
                new HashMap<>();

        response.put("authenticated", true);
        response.put("email", authentication.getName());
        response.put("role", "ADMIN");

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(response);
    }

    // =========================================================
    // ADMIN DASHBOARD
    // =========================================================

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardDTO> getDashboardStats() {

        AdminDashboardDTO dashboard =
                AdminDashboardDTO.builder()
                        .totalUsers(userRepository.count())
                        .totalInterviews(
                                interviewSessionRepository.count()
                        )
                        .totalCodingQuestions(
                                codingQuestionRepository.count()
                        )
                        .totalAptitudeQuestions(
                                aptitudeQuestionRepository.count()
                        )
                        .build();

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(dashboard);
    }
}