package com.interviewtwin.repository;

import com.interviewtwin.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    @Query("SELECT r FROM Report r WHERE r.user.userId = ?1")
    List<Report> findByUserId(Long userId);

    @Query("SELECT r FROM Report r WHERE r.user.userId = ?1 AND r.reportType = ?2")
    List<Report> findByUserIdAndReportType(Long userId, String reportType);

    @Query("SELECT r FROM Report r WHERE r.reportId = ?1 AND r.user.userId = ?2")
    Optional<Report> findByReportIdAndUserId(Long reportId, Long userId);

    @Query("SELECT r FROM Report r WHERE r.user.userId = ?1 ORDER BY r.createdAt DESC")
    List<Report> findByUserIdOrderByCreatedAtDesc(Long userId);
}
