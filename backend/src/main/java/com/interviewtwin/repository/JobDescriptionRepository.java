package com.interviewtwin.repository;

import com.interviewtwin.entity.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {

    @Query("SELECT jd FROM JobDescription jd WHERE jd.user.userId = ?1")
    List<JobDescription> findByUserId(Long userId);

    @Query("SELECT jd FROM JobDescription jd WHERE jd.jobId = ?1 AND jd.user.userId = ?2")
    Optional<JobDescription> findByJobIdAndUserId(Long jobId, Long userId);

    @Query("SELECT jd FROM JobDescription jd WHERE jd.user.userId = ?1 ORDER BY jd.createdAt DESC")
    List<JobDescription> findByUserIdOrderByCreatedAtDesc(Long userId);
}
