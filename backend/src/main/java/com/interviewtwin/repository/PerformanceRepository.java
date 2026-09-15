package com.interviewtwin.repository;

import com.interviewtwin.entity.Performance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PerformanceRepository extends JpaRepository<Performance, Long> {

    /**
     * Finds the performance record belonging to a specific user.
     *
     * The query is explicitly scoped through the User relationship,
     * ensuring that the performance record matches the requested
     * user ID.
     */
    @Query("""
        SELECT p
        FROM Performance p
        WHERE p.user.userId = ?1
    """)
    Optional<Performance> findByUserId(Long userId);
}