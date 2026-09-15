package com.interviewtwin.repository;

import com.interviewtwin.entity.LearningRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, Long> {

    @Query("SELECT lr FROM LearningRoadmap lr WHERE lr.user.userId = ?1")
    List<LearningRoadmap> findByUserId(Long userId);

    @Query("SELECT lr FROM LearningRoadmap lr WHERE lr.roadmapId = ?1 AND lr.user.userId = ?2")
    Optional<LearningRoadmap> findByRoadmapIdAndUserId(Long roadmapId, Long userId);

    @Query("SELECT lr FROM LearningRoadmap lr WHERE lr.user.userId = ?1 AND lr.progressPercentage < ?2")
    List<LearningRoadmap> findByUserIdAndProgressPercentageLessThan(Long userId, Integer percentage);

    List<LearningRoadmap> findByCategory(String category);
}
