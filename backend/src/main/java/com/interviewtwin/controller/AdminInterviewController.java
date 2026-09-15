package com.interviewtwin.controller;

import com.interviewtwin.dto.AdminInterviewDTO;
import com.interviewtwin.service.AdminInterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/interviews")
@RequiredArgsConstructor
public class AdminInterviewController {

    private final AdminInterviewService adminInterviewService;


    // =========================================================
    // GET ALL INTERVIEWS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<AdminInterviewDTO>> getAllInterviews() {

        return ResponseEntity.ok(
                adminInterviewService.getAllInterviews()
        );
    }


    // =========================================================
    // GET INTERVIEW BY ID
    // =========================================================

    @GetMapping("/{sessionId}")
    public ResponseEntity<AdminInterviewDTO> getInterviewById(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                adminInterviewService.getInterviewById(
                        sessionId
                )
        );
    }


    // =========================================================
    // GET INTERVIEWS BY STATUS
    // =========================================================

    @GetMapping("/status/{status}")
    public ResponseEntity<List<AdminInterviewDTO>> getInterviewsByStatus(
            @PathVariable String status) {

        return ResponseEntity.ok(
                adminInterviewService.getInterviewsByStatus(
                        status
                )
        );
    }


    // =========================================================
    // UPDATE INTERVIEW STATUS
    // =========================================================

    @PatchMapping("/{sessionId}/status")
    public ResponseEntity<AdminInterviewDTO> updateInterviewStatus(
            @PathVariable Long sessionId,
            @RequestBody Map<String, String> request) {

        String status =
                request.get("status");

        return ResponseEntity.ok(
                adminInterviewService.updateInterviewStatus(
                        sessionId,
                        status
                )
        );
    }


    // =========================================================
    // FLAG INTERVIEW FOR REVIEW
    // =========================================================

    @PatchMapping("/{sessionId}/flag")
    public ResponseEntity<AdminInterviewDTO> flagInterviewForReview(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                adminInterviewService.flagInterviewForReview(
                        sessionId
                )
        );
    }


    // =========================================================
    // REMOVE REVIEW FLAG
    // =========================================================

    @PatchMapping("/{sessionId}/unflag")
    public ResponseEntity<AdminInterviewDTO> unflagInterviewForReview(
            @PathVariable Long sessionId) {

        return ResponseEntity.ok(
                adminInterviewService.unflagInterviewForReview(
                        sessionId
                )
        );
    }
}