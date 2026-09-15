package com.interviewtwin.repository;

import com.interviewtwin.entity.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeRepository extends JpaRepository<Resume, Long> {

    @Query("SELECT r FROM Resume r WHERE r.user.userId = ?1")
    List<Resume> findByUserId(Long userId);

    @Query("SELECT r FROM Resume r WHERE r.user.userId = ?1 AND r.isPrimary = true")
    Optional<Resume> findByUserIdAndIsPrimaryTrue(Long userId);

    @Query("SELECT r FROM Resume r WHERE r.resumeId = ?1 AND r.user.userId = ?2")
    Optional<Resume> findByResumeIdAndUserId(Long resumeId, Long userId);

    @Modifying
    @Query("DELETE FROM Resume r WHERE r.resumeId = ?1 AND r.user.userId = ?2")
    void deleteByResumeIdAndUserId(Long resumeId, Long userId);
}
