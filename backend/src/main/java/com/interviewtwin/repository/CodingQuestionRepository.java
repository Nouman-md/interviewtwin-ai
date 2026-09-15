package com.interviewtwin.repository;

import com.interviewtwin.entity.CodingQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CodingQuestionRepository extends JpaRepository<CodingQuestion, Long> {

    List<CodingQuestion> findByCategory(String category);

    List<CodingQuestion> findByDifficultyLevel(CodingQuestion.DifficultyLevel difficultyLevel);

    List<CodingQuestion> findByLanguage(String language);
long countByQuestionType(CodingQuestion.QuestionType questionType);
    @Query(value = "SELECT * FROM coding_questions ORDER BY RAND() LIMIT ?1", nativeQuery = true)
    List<CodingQuestion> findRandomQuestions(int limit);

    @Query(value = "SELECT * FROM coding_questions WHERE difficulty_level = ?1 ORDER BY RAND() LIMIT ?2", nativeQuery = true)
    List<CodingQuestion> findRandomQuestionsByDifficulty(String difficulty, int limit);
}