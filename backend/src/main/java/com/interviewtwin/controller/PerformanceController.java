package com.interviewtwin.controller;

import com.interviewtwin.dto.PerformanceDTO;
import com.interviewtwin.security.SecurityUtils;
import com.interviewtwin.service.PerformanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/performance")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class PerformanceController {

    private final PerformanceService performanceService;
    private final SecurityUtils securityUtils;

    /**
     * Get performance data for the currently authenticated user.
     *
     * The user ID is taken from the authenticated security context.
     * It is never accepted from the client.
     */
    @GetMapping
    public ResponseEntity<PerformanceDTO> getPerformance(
        Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        PerformanceDTO performance =
            performanceService.getPerformance(userId);

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .header("Pragma", "no-cache")
            .body(performance);
    }

    /**
     * Recalculate weak and strong performance areas
     * for the currently authenticated user.
     */
    @PostMapping("/identify-weak-areas")
    public ResponseEntity<Void> identifyWeakAreas(
        Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        performanceService.identifyWeakAreas(userId);

        return ResponseEntity.noContent()
            .cacheControl(CacheControl.noStore())
            .header("Pragma", "no-cache")
            .build();
    }

    /**
     * Resolve the current user from the authenticated security context.
     *
     * Never trust a user ID supplied by the request.
     */
    private Long getAuthenticatedUserId(
        Authentication authentication
    ) {

        if (authentication == null
            || !authentication.isAuthenticated()) {

            throw new IllegalStateException("Authentication required");
        }

        Long userId = securityUtils.getCurrentUserId(authentication);

        if (userId == null || userId <= 0) {
            throw new IllegalStateException("Invalid authenticated user");
        }

        return userId;
    }
}