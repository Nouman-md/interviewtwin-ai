package com.interviewtwin.repository;

import com.interviewtwin.entity.CodingSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CodingSubmissionRepository extends JpaRepository<CodingSubmission, Long> {

    @Query("SELECT cs FROM CodingSubmission cs WHERE cs.user.userId = ?1")
    List<CodingSubmission> findByUserId(Long userId);

    @Query("SELECT cs FROM CodingSubmission cs WHERE cs.user.userId = ?1 ORDER BY cs.submittedAt DESC")
    List<CodingSubmission> findByUserIdOrderBySubmittedAtDesc(Long userId);

    @Query("SELECT cs FROM CodingSubmission cs WHERE cs.submissionId = ?1 AND cs.user.userId = ?2")
    Optional<CodingSubmission> findBySubmissionIdAndUserId(Long submissionId, Long userId);

    @Query("SELECT cs FROM CodingSubmission cs WHERE cs.codingQuestion.codingId = ?1 AND cs.user.userId = ?2")
    List<CodingSubmission> findByCodingQuestionCodingIdAndUserId(Long codingId, Long userId);

    @Query("SELECT cs FROM CodingSubmission cs WHERE cs.user.userId = ?1 AND cs.status = ?2")
    List<CodingSubmission> findByUserIdAndStatus(Long userId, CodingSubmission.SubmissionStatus status);
}