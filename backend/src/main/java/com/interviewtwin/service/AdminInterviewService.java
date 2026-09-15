package com.interviewtwin.service;

import com.interviewtwin.dto.AdminInterviewDTO;
import com.interviewtwin.entity.InterviewSession;
import com.interviewtwin.repository.InterviewSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminInterviewService {

    private static final int MAX_STATUS_LENGTH = 50;

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "IN_PROGRESS",
            "COMPLETED",
            "CANCELLED",
            "FAILED"
    );

    private final InterviewSessionRepository interviewSessionRepository;


    // =========================================================
    // GET ALL INTERVIEWS
    // =========================================================

    public List<AdminInterviewDTO> getAllInterviews() {

        return interviewSessionRepository
                .findAllForAdmin()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET INTERVIEW BY ID
    // =========================================================

    public AdminInterviewDTO getInterviewById(
            Long sessionId) {

        validateSessionId(sessionId);

        InterviewSession session =
                interviewSessionRepository
                        .findByIdForAdmin(sessionId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Interview session not found"
                                )
                        );

        return convertToDTO(session);
    }


    // =========================================================
    // GET INTERVIEWS BY STATUS
    // =========================================================

    public List<AdminInterviewDTO> getInterviewsByStatus(
            String status) {

        if (status == null ||
                status.trim().isEmpty()) {

            return getAllInterviews();
        }

        String normalizedStatus =
                normalizeStatus(status);

        return interviewSessionRepository
                .findAllForAdminByStatus(
                        normalizedStatus
                )
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // UPDATE INTERVIEW STATUS
    // =========================================================

    @Transactional
    public AdminInterviewDTO updateInterviewStatus(
            Long sessionId,
            String newStatus) {

        validateSessionId(sessionId);

        String normalizedStatus =
                normalizeStatus(newStatus);

        InterviewSession session =
                interviewSessionRepository
                        .findByIdForAdmin(sessionId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Interview session not found"
                                )
                        );

        session.setStatus(normalizedStatus);

        InterviewSession savedSession =
                interviewSessionRepository.save(session);

        return convertToDTO(savedSession);
    }


    // =========================================================
    // FLAG INTERVIEW FOR REVIEW
    // =========================================================

    @Transactional
    public AdminInterviewDTO flagInterviewForReview(
            Long sessionId) {

        validateSessionId(sessionId);

        InterviewSession session =
                interviewSessionRepository
                        .findByIdForAdmin(sessionId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Interview session not found"
                                )
                        );

        session.setFlaggedForReview(true);

        InterviewSession savedSession =
                interviewSessionRepository.save(session);

        return convertToDTO(savedSession);
    }


    // =========================================================
    // REMOVE REVIEW FLAG
    // =========================================================

    @Transactional
    public AdminInterviewDTO unflagInterviewForReview(
            Long sessionId) {

        validateSessionId(sessionId);

        InterviewSession session =
                interviewSessionRepository
                        .findByIdForAdmin(sessionId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Interview session not found"
                                )
                        );

        session.setFlaggedForReview(false);

        InterviewSession savedSession =
                interviewSessionRepository.save(session);

        return convertToDTO(savedSession);
    }


    // =========================================================
    // VALIDATE SESSION ID
    // =========================================================

    private void validateSessionId(Long sessionId) {

        if (sessionId == null ||
                sessionId <= 0) {

            throw new IllegalArgumentException(
                    "Invalid interview session ID"
            );
        }
    }


    // =========================================================
    // NORMALIZE + VALIDATE STATUS
    // =========================================================

    private String normalizeStatus(String status) {

        if (status == null ||
                status.trim().isEmpty()) {

            throw new IllegalArgumentException(
                    "Interview status cannot be empty"
            );
        }

        String normalizedStatus =
                status.trim().toUpperCase();

        if (normalizedStatus.length() > MAX_STATUS_LENGTH) {
            throw new IllegalArgumentException(
                    "Invalid interview status"
            );
        }

        if (!ALLOWED_STATUSES.contains(normalizedStatus)) {
            throw new IllegalArgumentException(
                    "Invalid interview status"
            );
        }

        return normalizedStatus;
    }


    // =========================================================
    // CONVERT ENTITY → DTO
    // =========================================================

    private AdminInterviewDTO convertToDTO(
            InterviewSession session) {

        if (session == null) {
            throw new IllegalArgumentException(
                    "Interview session data is unavailable"
            );
        }

        String userName = "Unknown User";
        String userEmail = "—";
        Long userId = null;

        // =====================================================
        // USER
        // =====================================================

        if (session.getUser() != null) {

            userId =
                    session.getUser().getUserId();

            userEmail =
                    session.getUser().getEmail();

            userName =
                    session.getUser().getFullName();
        }


        // =====================================================
        // INTERVIEW TYPE
        // =====================================================

        Long interviewTypeId = null;
        String interviewType = "Unknown";

        if (session.getInterviewType() != null) {

            interviewTypeId =
                    session.getInterviewType().getTypeId();

            interviewType =
                    session.getInterviewType().getTypeName();
        }


        // =====================================================
        // ANSWER COUNT
        // =====================================================

        int answerCount = 0;

        if (session.getAnswers() != null) {

            answerCount =
                    session.getAnswers().size();
        }


        // =====================================================
        // DTO
        // =====================================================

        return AdminInterviewDTO.builder()

                // -------------------------------------------------
                // Session
                // -------------------------------------------------

                .sessionId(
                        session.getSessionId()
                )


                // -------------------------------------------------
                // User
                // -------------------------------------------------

                .userId(userId)

                .userName(userName)

                .userEmail(userEmail)


                // -------------------------------------------------
                // Interview
                // -------------------------------------------------

                .interviewTypeId(
                        interviewTypeId
                )

                .interviewType(
                        interviewType
                )

                .sessionTitle(
                        session.getSessionTitle()
                )


                // -------------------------------------------------
                // Status
                // -------------------------------------------------

                .status(
                        session.getStatus()
                )


                // -------------------------------------------------
                // Admin Review
                // -------------------------------------------------

                .flaggedForReview(
                        Boolean.TRUE.equals(
                                session.getFlaggedForReview()
                        )
                )


                // -------------------------------------------------
                // Performance
                // -------------------------------------------------

                .overallScore(
                        session.getOverallScore()
                )


                // -------------------------------------------------
                // Timing
                // -------------------------------------------------

                .durationMinutes(
                        session.getDurationMinutes()
                )

                .startTime(
                        session.getStartTime()
                )

                .endTime(
                        session.getEndTime()
                )


                // -------------------------------------------------
                // Feedback
                // -------------------------------------------------

                .feedback(
                        session.getFeedback()
                )


                // -------------------------------------------------
                // Answers
                // -------------------------------------------------

                .answerCount(
                        answerCount
                )


                // -------------------------------------------------
                // Timestamps
                // -------------------------------------------------

                .createdAt(
                        session.getCreatedAt()
                )

                .updatedAt(
                        session.getUpdatedAt()
                )


                .build();
    }
}