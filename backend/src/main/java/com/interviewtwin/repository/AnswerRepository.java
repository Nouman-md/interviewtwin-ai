package com.interviewtwin.repository;

import com.interviewtwin.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AnswerRepository extends JpaRepository<Answer, Long> {

    // =========================================================
    // SESSION ANSWERS
    // =========================================================

    /**
     * Get all answers belonging to a specific interview session.
     *
     * This method is intended for internal use where the caller
     * has already verified session ownership.
     */
    @Query("""
        SELECT a
        FROM Answer a
        WHERE a.interviewSession.sessionId = ?1
        """)
    List<Answer> findByInterviewSessionSessionId(
        Long sessionId
    );


    /**
     * Get all answers belonging to a session AND authenticated user.
     *
     * This is the preferred method when returning answers to
     * a normal authenticated user.
     */
    @Query("""
        SELECT a
        FROM Answer a
        WHERE a.interviewSession.sessionId = ?1
        AND a.interviewSession.user.userId = ?2
        ORDER BY a.createdAt ASC
        """)
    List<Answer> findByInterviewSessionSessionIdAndUserId(
        Long sessionId,
        Long userId
    );


    // =========================================================
    // SINGLE ANSWER
    // =========================================================

    /**
     * Get one answer only if it belongs to the authenticated user.
     *
     * This prevents an authenticated user from accessing another
     * user's answer simply by changing the answer ID.
     */
    @Query("""
        SELECT a
        FROM Answer a
        WHERE a.answerId = ?1
        AND a.interviewSession.user.userId = ?2
        """)
    Optional<Answer> findByAnswerIdAndInterviewSessionUserId(
        Long answerId,
        Long userId
    );


    // =========================================================
    // QUESTION ANSWERS
    // =========================================================

    /**
     * Get answers associated with a question.
     *
     * This is intentionally not user-scoped because it may be
     * required for question-level analytics or administrative
     * functionality.
     *
     * Do NOT expose this method directly to normal users without
     * an additional ownership/authorization check.
     */
    @Query("""
        SELECT a
        FROM Answer a
        WHERE a.question.questionId = ?1
        """)
    List<Answer> findByQuestionQuestionId(
        Long questionId
    );
}