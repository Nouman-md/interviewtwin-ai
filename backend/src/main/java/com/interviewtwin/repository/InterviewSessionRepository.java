package com.interviewtwin.repository;

import com.interviewtwin.entity.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InterviewSessionRepository
        extends JpaRepository<InterviewSession, Long> {

    // =========================================================
    // USER INTERVIEW QUERIES
    // =========================================================

    @Query("""
        SELECT i
        FROM InterviewSession i
        WHERE i.user.userId = ?1
        """)
    List<InterviewSession> findByUserId(Long userId);

    @Query("""
        SELECT i
        FROM InterviewSession i
        WHERE i.user.userId = ?1
        ORDER BY i.startTime DESC
        """)
    List<InterviewSession> findByUserIdOrderByStartTimeDesc(
            Long userId);

    @Query("""
        SELECT i
        FROM InterviewSession i
        WHERE i.sessionId = ?1
        AND i.user.userId = ?2
        """)
    Optional<InterviewSession> findBySessionIdAndUserId(
            Long sessionId,
            Long userId);

    @Query("""
        SELECT i
        FROM InterviewSession i
        WHERE i.user.userId = ?1
        AND i.status = ?2
        """)
    List<InterviewSession> findByUserIdAndStatus(
            Long userId,
            String status);


    // =========================================================
    // ADMIN INTERVIEW QUERIES
    // =========================================================

    /**
     * Get all interview sessions for the Admin Portal.
     *
     * Newest interviews are returned first.
     */
    @Query("""
        SELECT i
        FROM InterviewSession i
        JOIN FETCH i.user u
        JOIN FETCH i.interviewType t
        ORDER BY i.startTime DESC
        """)
    List<InterviewSession> findAllForAdmin();


    /**
     * Get one interview session for the Admin Portal.
     *
     * JOIN FETCH loads the related user and interview type
     * while the persistence context is active.
     */
    @Query("""
        SELECT i
        FROM InterviewSession i
        JOIN FETCH i.user u
        JOIN FETCH i.interviewType t
        WHERE i.sessionId = ?1
        """)
    Optional<InterviewSession> findByIdForAdmin(
            Long sessionId);


    /**
     * Get interview sessions by status for Admin filtering.
     */
    @Query("""
        SELECT i
        FROM InterviewSession i
        JOIN FETCH i.user u
        JOIN FETCH i.interviewType t
        WHERE i.status = ?1
        ORDER BY i.startTime DESC
        """)
    List<InterviewSession> findAllForAdminByStatus(
            String status);
}