package com.interviewtwin.repository;

import com.interviewtwin.entity.AptitudeQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AptitudeQuestionRepository
        extends JpaRepository<AptitudeQuestion, Long> {

    List<AptitudeQuestion> findByCategoryIgnoreCase(String category);

    List<AptitudeQuestion> findByDifficultyLevelIgnoreCase(String difficultyLevel);

    List<AptitudeQuestion> findByCategoryIgnoreCaseAndDifficultyLevelIgnoreCase(
            String category,
            String difficultyLevel
    );

    @Query(value = """
            SELECT *
            FROM aptitude_questions
            ORDER BY RAND()
            LIMIT :count
            """, nativeQuery = true)
    List<AptitudeQuestion> findRandomQuestions(int count);
}