package com.interviewtwin.controller;

import com.interviewtwin.dto.AnswerReportDTO;
import com.interviewtwin.dto.AnswerSubmissionDTO;
import com.interviewtwin.dto.InterviewSessionResponse;
import com.interviewtwin.entity.Answer;
import com.interviewtwin.entity.InterviewSession;
import com.interviewtwin.entity.Question;
import com.interviewtwin.security.SecurityUtils;
import com.interviewtwin.service.InterviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/interviews")
@RequiredArgsConstructor
@PreAuthorize("isAuthenticated()")
public class InterviewController {

    private final InterviewService interviewService;
    private final SecurityUtils securityUtils;

    /**
     * Start a new interview for the authenticated user.
     */
    @PostMapping("/start/{interviewType}")
    public ResponseEntity<InterviewSessionResponse> startInterview(
        Authentication authentication,
        @PathVariable String interviewType
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        if (interviewType == null || interviewType.isBlank()) {
            throw new IllegalArgumentException("Invalid interview type");
        }

        String normalizedInterviewType = interviewType.trim();

        if (normalizedInterviewType.length() > 100) {
            throw new IllegalArgumentException("Invalid interview type");
        }

        InterviewSession session =
            interviewService.startInterview(
                userId,
                normalizedInterviewType
            );

        InterviewSessionResponse response =
            toSessionResponse(session, userId);

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore())
            .body(response);
    }

    /**
     * Get one interview session.
     *
     * The service receives the authenticated user's ID so that
     * a session belonging to another user cannot be accessed.
     */
    @GetMapping("/{sessionId}")
    public ResponseEntity<InterviewSessionResponse> getSession(
        Authentication authentication,
        @PathVariable Long sessionId
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        validateSessionId(sessionId);

        InterviewSession session =
            interviewService.getSession(sessionId, userId);

        InterviewSessionResponse response =
            toSessionResponse(session, userId);

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(response);
    }

    /**
     * Get the next question for the authenticated user's interview.
     */
    @GetMapping("/{sessionId}/next-question")
    public ResponseEntity<Question> getNextQuestion(
        Authentication authentication,
        @PathVariable Long sessionId
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        validateSessionId(sessionId);

        Question question =
            interviewService.getNextQuestion(
                sessionId,
                userId
            );

        if (question == null) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .cacheControl(CacheControl.noStore())
                .build();
        }

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(question);
    }

    /**
     * Submit an answer for the authenticated user's session.
     */
    @PostMapping("/{sessionId}/submit-answer")
    public ResponseEntity<Answer> submitAnswer(
        Authentication authentication,
        @PathVariable Long sessionId,
        @Valid @RequestBody AnswerSubmissionDTO answerDTO
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        validateSessionId(sessionId);

        if (answerDTO == null) {
            throw new IllegalArgumentException("Invalid answer");
        }

        /*
         * Session ID is always taken from the URL.
         * A client cannot submit an answer to another session
         * by supplying a different sessionId inside the request body.
         */
        answerDTO.setSessionId(sessionId);

        Answer answer =
            interviewService.submitAnswer(
                sessionId,
                userId,
                answerDTO
            );

        return ResponseEntity
            .status(HttpStatus.CREATED)
            .cacheControl(CacheControl.noStore())
            .body(answer);
    }

    /**
     * End the authenticated user's interview session.
     */
    @PostMapping("/{sessionId}/end")
    public ResponseEntity<InterviewSessionResponse> endInterview(
        Authentication authentication,
        @PathVariable Long sessionId
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        validateSessionId(sessionId);

        InterviewSession session =
            interviewService.endInterview(
                sessionId,
                userId
            );

        InterviewSessionResponse response =
            toSessionResponse(session, userId);

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(response);
    }

    /**
     * Get all interview sessions belonging to the authenticated user.
     */
    @GetMapping("/user/sessions")
    public ResponseEntity<List<InterviewSessionResponse>> getUserSessions(
        Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        try {

            List<InterviewSession> sessions =
                interviewService.getUserSessions(userId);

            List<InterviewSessionResponse> responses =
                sessions.stream()
                    .map(session -> toSessionResponse(session, userId))
                    .collect(Collectors.toList());

            return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(responses);

        } catch (Exception e) {

            /*
             * Log the internal exception server-side, but never
             * expose e.getMessage() to the client.
             */
            log.error(
                "Failed to load interview sessions for user {}",
                userId,
                e
            );

            throw new RuntimeException(
                "Unable to load interview sessions"
            );
        }
    }

    /**
     * Get completed interview sessions for the authenticated user.
     *
     * We convert entities to DTOs rather than returning the JPA
     * entity directly.
     */
    @GetMapping("/user/completed")
    public ResponseEntity<List<InterviewSessionResponse>> getCompletedSessions(
        Authentication authentication
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        List<InterviewSession> sessions =
            interviewService.getUserCompletedSessions(userId);

        List<InterviewSessionResponse> responses =
            sessions.stream()
                .map(session -> toSessionResponse(session, userId))
                .collect(Collectors.toList());

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(responses);
    }

    /**
     * Get answers belonging to an authenticated user's session.
     */
    @GetMapping("/{sessionId}/answers")
    public ResponseEntity<List<AnswerReportDTO>> getSessionAnswers(
        Authentication authentication,
        @PathVariable Long sessionId
    ) {

        Long userId = getAuthenticatedUserId(authentication);

        validateSessionId(sessionId);

        List<Answer> answers =
            interviewService.getSessionAnswers(
                sessionId,
                userId
            );

        List<AnswerReportDTO> responses =
            answers.stream()
                .map(this::toAnswerReport)
                .collect(Collectors.toList());

        return ResponseEntity.ok()
            .cacheControl(CacheControl.noStore())
            .body(responses);
    }

    /**
     * Convert an interview session to the API response DTO.
     */
    private InterviewSessionResponse toSessionResponse(
        InterviewSession session,
        Long authenticatedUserId
    ) {

        if (session == null) {
            throw new RuntimeException("Interview session unavailable");
        }

        Long sessionUserId =
            session.getUser() != null
                ? session.getUser().getUserId()
                : null;

        /*
         * Defense-in-depth ownership check.
         *
         * Even though the service receives userId, don't return
         * a session if its loaded entity belongs to another user.
         */
        if (sessionUserId != null
            && !sessionUserId.equals(authenticatedUserId)) {

            throw new SecurityException(
                "Unauthorized interview session"
            );
        }

        return InterviewSessionResponse.builder()
            .sessionId(session.getSessionId())
            .sessionTitle(session.getSessionTitle())
            .status(session.getStatus())
            .startTime(session.getStartTime())
            .endTime(session.getEndTime())
            .durationMinutes(session.getDurationMinutes())
            .overallScore(session.getOverallScore())
            .feedback(session.getFeedback())
            .userId(authenticatedUserId)
            .interviewTypeId(
                session.getInterviewType() != null
                    ? session.getInterviewType().getTypeId()
                    : null
            )
            .interviewType(
                session.getInterviewType() != null
                    ? session.getInterviewType().getTypeName()
                    : null
            )
            .build();
    }

    /**
     * Convert an answer entity into the report DTO.
     */
    private AnswerReportDTO toAnswerReport(Answer answer) {

        if (answer == null) {
            throw new RuntimeException("Answer unavailable");
        }

        return AnswerReportDTO.builder()
            .answerId(answer.getAnswerId())
            .questionId(
                answer.getQuestion() != null
                    ? answer.getQuestion().getQuestionId()
                    : null
            )
            .questionText(
                answer.getQuestion() != null
                    ? answer.getQuestion().getQuestionText()
                    : null
            )
            .userAnswer(answer.getUserAnswer())
            .answerScore(answer.getAnswerScore())
            .feedback(answer.getFeedback())
            .strengths(answer.getStrengths())
            .improvements(answer.getImprovements())
            .aiEvaluation(answer.getAiEvaluation())
            .createdAt(answer.getCreatedAt())
            .build();
    }

    /**
     * Resolve the user only from the authenticated security context.
     */
    private Long getAuthenticatedUserId(
        Authentication authentication
    ) {

        if (authentication == null
            || !authentication.isAuthenticated()) {

            throw new SecurityException(
                "Authentication required"
            );
        }

        Long userId =
            securityUtils.getCurrentUserId(authentication);

        if (userId == null || userId <= 0) {
            throw new SecurityException(
                "Invalid authenticated user"
            );
        }

        return userId;
    }

    /**
     * Validate session identifiers before sending them
     * deeper into the application.
     */
    private void validateSessionId(Long sessionId) {

        if (sessionId == null || sessionId <= 0) {
            throw new IllegalArgumentException(
                "Invalid interview session"
            );
        }
    }
}