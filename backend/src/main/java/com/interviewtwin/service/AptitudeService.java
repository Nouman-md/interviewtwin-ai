package com.interviewtwin.service;

import com.interviewtwin.entity.AptitudeQuestion;
import com.interviewtwin.repository.AptitudeQuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class AptitudeService {

    private final AptitudeQuestionRepository aptitudeQuestionRepository;

    /**
     * Get all aptitude questions.
     */
    @Transactional(readOnly = true)
    public List<AptitudeQuestion> getAllQuestions() {
        return aptitudeQuestionRepository.findAll();
    }

    /**
     * Get one aptitude question by ID.
     */
    @Transactional(readOnly = true)
    public AptitudeQuestion getQuestionById(Long aptitudeId) {
        return aptitudeQuestionRepository.findById(aptitudeId)
                .orElseThrow(() ->
                        new RuntimeException("Aptitude question not found with id: " + aptitudeId));
    }

    /**
     * Get random aptitude questions.
     */
    @Transactional(readOnly = true)
    public List<AptitudeQuestion> getRandomQuestions(int count) {
        if (count <= 0) {
            return List.of();
        }

        return aptitudeQuestionRepository.findRandomQuestions(count);
    }

    /**
     * Get questions by category.
     */
    @Transactional(readOnly = true)
    public List<AptitudeQuestion> getQuestionsByCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            return getAllQuestions();
        }

        return aptitudeQuestionRepository.findByCategoryIgnoreCase(category.trim());
    }

    /**
     * Get questions by difficulty.
     */
    @Transactional(readOnly = true)
    public List<AptitudeQuestion> getQuestionsByDifficulty(String difficulty) {
        if (difficulty == null || difficulty.trim().isEmpty()) {
            return getAllQuestions();
        }

        return aptitudeQuestionRepository
                .findByDifficultyLevelIgnoreCase(difficulty.trim());
    }

    /**
     * Get questions by category and difficulty.
     */
    @Transactional(readOnly = true)
    public List<AptitudeQuestion> getQuestionsByCategoryAndDifficulty(
            String category,
            String difficulty) {

        if (category == null || category.trim().isEmpty()) {
            return getQuestionsByDifficulty(difficulty);
        }

        if (difficulty == null || difficulty.trim().isEmpty()) {
            return getQuestionsByCategory(category);
        }

        return aptitudeQuestionRepository
                .findByCategoryIgnoreCaseAndDifficultyLevelIgnoreCase(
                        category.trim(),
                        difficulty.trim()
                );
    }

    /**
     * Check an answer.
     *
     * The correct answer is checked on the backend.
     * The frontend never needs to receive the correct answer
     * before the user submits.
     */
    @Transactional
    public Map<String, Object> checkAnswer(
            Long aptitudeId,
            String submittedAnswer) {

        AptitudeQuestion question = getQuestionById(aptitudeId);

        Map<String, Object> result = new HashMap<>();

        if (submittedAnswer == null ||
                submittedAnswer.trim().isEmpty()) {

            result.put("correct", false);
            result.put("message", "Please select an answer.");
            result.put("explanation", null);

            return result;
        }

        String correctAnswer = question.getCorrectAnswer();

        boolean isCorrect =
                correctAnswer != null &&
                correctAnswer.trim()
                        .equalsIgnoreCase(submittedAnswer.trim());

        // Update attempt statistics
        Integer attempts = question.getTotalAttempts();

        if (attempts == null) {
            attempts = 0;
        }

        question.setTotalAttempts(attempts + 1);

        if (isCorrect) {

            Integer correct = question.getTotalCorrect();

            if (correct == null) {
                correct = 0;
            }

            question.setTotalCorrect(correct + 1);
        }

        // Calculate acceptance rate
        int totalAttempts = question.getTotalAttempts();
        int totalCorrect = question.getTotalCorrect() == null
                ? 0
                : question.getTotalCorrect();

        double acceptanceRate = totalAttempts > 0
                ? (totalCorrect * 100.0) / totalAttempts
                : 0.0;

        question.setAcceptanceRate(
                java.math.BigDecimal.valueOf(acceptanceRate)
        );

        aptitudeQuestionRepository.save(question);

        result.put("correct", isCorrect);
        result.put(
                "message",
                isCorrect
                        ? "Correct answer!"
                        : "Incorrect answer."
        );

        result.put(
                "explanation",
                question.getExplanation()
        );

        // Only reveal the correct answer AFTER submission.
        result.put(
                "correctAnswer",
                question.getCorrectAnswer()
        );

        return result;
    }

    /**
     * Get categories available in the database.
     */
    @Transactional(readOnly = true)
    public List<String> getCategories() {

        return aptitudeQuestionRepository.findAll()
                .stream()
                .map(AptitudeQuestion::getCategory)
                .filter(category ->
                        category != null &&
                        !category.trim().isEmpty())
                .distinct()
                .sorted()
                .toList();
    }

    /**
     * Get basic aptitude statistics.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getStats() {

        List<AptitudeQuestion> questions =
                aptitudeQuestionRepository.findAll();

        long totalQuestions = questions.size();

        long easy = questions.stream()
                .filter(q ->
                        "EASY".equalsIgnoreCase(
                                q.getDifficultyLevel()))
                .count();

        long medium = questions.stream()
                .filter(q ->
                        "MEDIUM".equalsIgnoreCase(
                                q.getDifficultyLevel()))
                .count();

        long hard = questions.stream()
                .filter(q ->
                        "HARD".equalsIgnoreCase(
                                q.getDifficultyLevel()))
                .count();

        return Map.of(
                "totalQuestions", totalQuestions,
                "easy", easy,
                "medium", medium,
                "hard", hard
        );
    }
}