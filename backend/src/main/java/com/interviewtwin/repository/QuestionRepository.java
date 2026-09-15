package com.interviewtwin.repository;

import com.interviewtwin.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    @Query("SELECT q FROM Question q WHERE q.interviewType.typeId = ?1")
    List<Question> findByInterviewTypeTypeId(Long typeId);

    @Query(value = "SELECT * FROM questions WHERE type_id = ?1 ORDER BY RAND() LIMIT ?2", nativeQuery = true)
    List<Question> findRandomQuestionsByType(Long typeId, int limit);

    List<Question> findByCategory(String category);

    List<Question> findByDifficultyLevel(String difficultyLevel);
}
