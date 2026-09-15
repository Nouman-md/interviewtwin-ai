package com.interviewtwin.repository;

import com.interviewtwin.entity.ATSReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ATSReportRepository extends JpaRepository<ATSReport, Long> {

    // =========================================================
    // GET ALL REPORTS FOR A USER
    // =========================================================

    @Query("""
        SELECT r
        FROM ATSReport r
        WHERE r.user.userId = ?1
        ORDER BY r.createdAt DESC
    """)
    List<ATSReport> findByUserId(Long userId);


    // =========================================================
    // GET REPORT BY RESUME
    // =========================================================

    @Query("""
        SELECT r
        FROM ATSReport r
        WHERE r.resume.resumeId = ?1
    """)
    Optional<ATSReport> findByResumeId(Long resumeId);


    // =========================================================
    // GET REPORT BY REPORT ID + USER ID
    // =========================================================
    //
    // IMPORTANT:
    // Ownership is enforced directly in the database query.
    // This prevents a user from retrieving another user's
    // ATS report by changing reportId.
    //

    @Query("""
        SELECT r
        FROM ATSReport r
        WHERE r.reportId = ?1
        AND r.user.userId = ?2
    """)
    Optional<ATSReport> findByReportIdAndUserId(
            Long reportId,
            Long userId
    );


    // =========================================================
    // GET LATEST REPORT FOR USER
    // =========================================================

    @Query("""
        SELECT r
        FROM ATSReport r
        WHERE r.user.userId = ?1
        ORDER BY r.createdAt DESC
    """)
    Optional<ATSReport> findTopByUserOrderByCreatedAtDesc(
            Long userId
    );


    // =========================================================
    // GET ALL REPORTS FOR USER - LATEST FIRST
    // =========================================================

    @Query("""
        SELECT r
        FROM ATSReport r
        WHERE r.user.userId = ?1
        ORDER BY r.createdAt DESC
    """)
    List<ATSReport> findLatestReportsByUser(
            Long userId
    );


    // =========================================================
    // GET LATEST REPORT BY USER ID
    // =========================================================

    @Query("""
        SELECT r
        FROM ATSReport r
        WHERE r.user.userId = ?1
        ORDER BY r.createdAt DESC
    """)
    Optional<ATSReport> findTopByUserIdOrderByCreatedAtDesc(
            Long userId
    );
}