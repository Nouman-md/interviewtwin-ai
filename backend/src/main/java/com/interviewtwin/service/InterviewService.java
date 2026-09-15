package com.interviewtwin.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.interviewtwin.dto.AnswerSubmissionDTO;
import com.interviewtwin.entity.Answer;
import com.interviewtwin.entity.InterviewSession;
import com.interviewtwin.entity.InterviewType;
import com.interviewtwin.entity.Question;
import com.interviewtwin.entity.User;
import com.interviewtwin.repository.AnswerRepository;
import com.interviewtwin.repository.InterviewSessionRepository;
import com.interviewtwin.repository.InterviewTypeRepository;
import com.interviewtwin.repository.QuestionRepository;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.Objects;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class InterviewService {

    private static final int MAX_INTERVIEW_QUESTIONS = 15;

    private static final int MAX_INTERVIEW_TYPE_LENGTH = 100;
    private static final int MAX_ANSWER_LENGTH = 10000;

    private static final BigDecimal MIN_SCORE = BigDecimal.ZERO;
    private static final BigDecimal MAX_SCORE = new BigDecimal("100");

    private final InterviewSessionRepository sessionRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final InterviewTypeRepository typeRepository;
    private final UserRepository userRepository;
    private final PerformanceService performanceService;
    private final GeminiAIService geminiAIService;
    private final ObjectMapper objectMapper;


    // =========================================================
    // START INTERVIEW
    // =========================================================

    public InterviewSession startInterview(
        Long userId,
        String interviewTypeName
    ) {

        validateUserId(userId);

        String normalizedType = normalizeInterviewType(interviewTypeName);

        User user = userRepository.findById(userId)
            .orElseThrow(() ->
                new RuntimeException("User not found")
            );

        InterviewType type = typeRepository
            .findByTypeName(normalizedType)
            .orElseThrow(() ->
                new RuntimeException("Interview type not found")
            );

        LocalDateTime now = LocalDateTime.now();

        InterviewSession session =
            InterviewSession.builder()
                .user(user)
                .interviewType(type)
                .sessionTitle(
                    normalizedType + " - " + now
                )
                .status("IN_PROGRESS")
                .startTime(now)
                .currentQuestionIndex(-1)
                .build();

        log.info(
            "Interview session created for userId={}, type={}",
            userId,
            normalizedType
        );

        return sessionRepository.save(session);
    }


    // =========================================================
    // GET SESSION
    // =========================================================

    public InterviewSession getSession(
        Long sessionId,
        Long userId
    ) {

        validateUserId(userId);
        validateSessionId(sessionId);

        return sessionRepository
            .findBySessionIdAndUserId(
                sessionId,
                userId
            )
            .orElseThrow(() ->
                new RuntimeException("Session not found")
            );
    }


    // =========================================================
    // GET NEXT QUESTION
    // =========================================================

    public Question getNextQuestion(
        Long sessionId,
        Long userId
    ) {

        InterviewSession session =
            getSession(sessionId, userId);

        if (!"IN_PROGRESS".equalsIgnoreCase(
            safeString(session.getStatus())
        )) {
            return null;
        }

        InterviewType interviewType =
            session.getInterviewType();

        if (interviewType == null
            || interviewType.getTypeId() == null) {
            return null;
        }

        List<Question> allQuestions =
            questionRepository
                .findByInterviewTypeTypeId(
                    interviewType.getTypeId()
                );

        allQuestions.sort(
            Comparator.comparing(
                Question::getQuestionId,
                Comparator.nullsLast(Long::compareTo)
            )
        );

        if (allQuestions.size() > MAX_INTERVIEW_QUESTIONS) {
            allQuestions =
                allQuestions.subList(
                    0,
                    MAX_INTERVIEW_QUESTIONS
                );
        }

        if (allQuestions.isEmpty()) {
            log.warn(
                "No questions available for interview type {}",
                interviewType.getTypeId()
            );
            return null;
        }

        Integer storedIndex =
            session.getCurrentQuestionIndex();

        int currentIndex =
            storedIndex == null
                ? -1
                : storedIndex;

        if (currentIndex >= MAX_INTERVIEW_QUESTIONS - 1) {
            return null;
        }

        int nextIndex = currentIndex + 1;

        if (nextIndex < 0
            || nextIndex >= allQuestions.size()) {
            return null;
        }

        Question selectedQuestion =
            allQuestions.get(nextIndex);

        if (selectedQuestion == null
            || selectedQuestion.getQuestionId() == null) {
            return null;
        }

        session.setCurrentQuestionIndex(nextIndex);

        sessionRepository.save(session);

        log.debug(
            "Question selected: sessionId={}, questionId={}, index={}",
            sessionId,
            selectedQuestion.getQuestionId(),
            nextIndex
        );

        return selectedQuestion;
    }


    // =========================================================
    // SUBMIT ANSWER
    // =========================================================

    public Answer submitAnswer(
        Long sessionId,
        Long userId,
        AnswerSubmissionDTO answerDTO
    ) {

        InterviewSession session =
            getSession(sessionId, userId);

        if (answerDTO == null) {
            throw new IllegalArgumentException("Invalid answer");
        }

        if (!"IN_PROGRESS".equalsIgnoreCase(
            safeString(session.getStatus())
        )) {
            throw new IllegalStateException(
                "Interview is no longer active"
            );
        }

        Long questionId =
            answerDTO.getQuestionId();

        if (questionId == null || questionId <= 0) {
            throw new IllegalArgumentException(
                "Invalid question"
            );
        }

        String userAnswer =
            answerDTO.getUserAnswer();

        if (userAnswer == null
            || userAnswer.trim().isEmpty()) {
            throw new IllegalArgumentException(
                "Answer cannot be empty"
            );
        }

        String normalizedAnswer =
            userAnswer.trim();

        if (normalizedAnswer.length() > MAX_ANSWER_LENGTH) {
            throw new IllegalArgumentException(
                "Answer is too long"
            );
        }

        Question question =
            questionRepository
                .findById(questionId)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Question not found"
                    )
                );

        /*
         * IMPORTANT SECURITY CHECK:
         *
         * A question submitted for an interview must belong
         * to the same interview type as that session.
         */
        InterviewType sessionType =
            session.getInterviewType();

        InterviewType questionType =
            question.getInterviewType();

        if (sessionType == null
            || questionType == null
            || sessionType.getTypeId() == null
            || questionType.getTypeId() == null
            || !sessionType.getTypeId()
                .equals(questionType.getTypeId())) {

            throw new SecurityException(
                "Question does not belong to this interview"
            );
        }

        ObjectNode evaluation =
            geminiAIService.evaluateInterviewAnswer(
                question.getQuestionText(),
                normalizedAnswer,
                question.getModelAnswer()
            );

        if (evaluation == null) {
            throw new RuntimeException(
                "Answer evaluation unavailable"
            );
        }

        BigDecimal score =
            extractAndValidateScore(evaluation);

        String feedback =
            extractText(evaluation, "feedback");

        Answer answer =
            Answer.builder()
                .interviewSession(session)
                .question(question)
                .userAnswer(normalizedAnswer)
                .answerScore(score)
                .feedback(feedback)
                .aiEvaluation(
                    serializeJsonNode(evaluation)
                )
                .strengths(
                    serializeJsonNode(
                        evaluation.get("strengths")
                    )
                )
                .improvements(
                    serializeJsonNode(
                        evaluation.get("improvements")
                    )
                )
                .build();

        return answerRepository.save(answer);
    }


    // =========================================================
    // END INTERVIEW
    // =========================================================

    public InterviewSession endInterview(
        Long sessionId,
        Long userId
    ) {

        InterviewSession session =
            getSession(sessionId, userId);

        if (!"IN_PROGRESS".equalsIgnoreCase(
            safeString(session.getStatus())
        )) {
            return session;
        }

        List<Answer> answers =
            answerRepository
                .findByInterviewSessionSessionId(
                    sessionId
                );

        if (!answers.isEmpty()) {

            BigDecimal totalScore =
                answers.stream()
                    .map(Answer::getAnswerScore)
                    .filter(Objects::nonNull)
                    .filter(this::isValidScore)
                    .reduce(
                        BigDecimal.ZERO,
                        BigDecimal::add
                    );

            long scoredAnswers =
                answers.stream()
                    .map(Answer::getAnswerScore)
                    .filter(Objects::nonNull)
                    .filter(this::isValidScore)
                    .count();

            if (scoredAnswers > 0) {

                BigDecimal averageScore =
                    totalScore.divide(
                        BigDecimal.valueOf(
                            scoredAnswers
                        ),
                        2,
                        RoundingMode.HALF_UP
                    );

                session.setOverallScore(
                    averageScore
                );

                InterviewType interviewType =
                    session.getInterviewType();

                if (interviewType != null) {

                    String typeName =
                        safeString(
                            interviewType.getTypeName()
                        ).toUpperCase(Locale.ROOT);

                    if (typeName.contains("TECHNICAL")) {

                        performanceService
                            .updateTechnicalScore(
                                userId,
                                averageScore
                            );

                    } else if (typeName.contains("HR")) {

                        performanceService
                            .updateHRScore(
                                userId,
                                averageScore
                            );
                    }
                }
            }

            StringBuilder feedback =
                new StringBuilder();

            feedback.append(
                "Interview completed successfully. "
            );

            BigDecimal overallScore =
                session.getOverallScore();

            if (overallScore != null) {

                if (overallScore.compareTo(
                    new BigDecimal("80")
                ) >= 0) {

                    feedback.append(
                        "Excellent performance with strong overall answers. "
                    );

                } else if (overallScore.compareTo(
                    new BigDecimal("60")
                ) >= 0) {

                    feedback.append(
                        "Good performance with some areas that can be improved. "
                    );

                } else {

                    feedback.append(
                        "There are several areas that need additional practice. "
                    );
                }
            }

            feedback.append(
                "You answered "
                    + answers.size()
                    + " question"
                    + (
                        answers.size() == 1
                            ? ""
                            : "s"
                    )
                    + ". "
            );

            List<String> answerFeedback =
                answers.stream()
                    .map(Answer::getFeedback)
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(text -> !text.isEmpty())
                    .limit(3)
                    .toList();

            if (!answerFeedback.isEmpty()) {

                feedback.append("Key feedback: ");

                for (
                    int i = 0;
                    i < answerFeedback.size();
                    i++
                ) {

                    feedback.append(
                        answerFeedback.get(i)
                    );

                    if (
                        i < answerFeedback.size() - 1
                    ) {
                        feedback.append(" | ");
                    }
                }
            }

            session.setFeedback(
                feedback.toString()
            );

        } else {

            session.setFeedback(
                "The interview was completed without submitting any answers. "
                    + "Complete the interview questions to receive a performance "
                    + "score and detailed feedback."
            );
        }

        session.setStatus("COMPLETED");

        LocalDateTime endTime =
            LocalDateTime.now();

        session.setEndTime(endTime);

        if (session.getStartTime() != null) {

            long durationMinutes =
                ChronoUnit.MINUTES.between(
                    session.getStartTime(),
                    endTime
                );

            /*
             * Protect the Integer field from overflow.
             */
            if (durationMinutes < 0) {
                durationMinutes = 0;
            }

            if (durationMinutes > Integer.MAX_VALUE) {
                durationMinutes = Integer.MAX_VALUE;
            }

            session.setDurationMinutes(
                (int) durationMinutes
            );
        } else {
            session.setDurationMinutes(0);
        }

        return sessionRepository.save(session);
    }


    // =========================================================
    // GET USER SESSIONS
    // =========================================================

    public List<InterviewSession> getUserSessions(
        Long userId
    ) {

        validateUserId(userId);

        return sessionRepository
            .findByUserIdOrderByStartTimeDesc(
                userId
            );
    }


    // =========================================================
    // GET COMPLETED SESSIONS
    // =========================================================

    public List<InterviewSession> getUserCompletedSessions(
        Long userId
    ) {

        validateUserId(userId);

        return sessionRepository
            .findByUserIdAndStatus(
                userId,
                "COMPLETED"
            );
    }


    // =========================================================
    // GET QUESTIONS BY TYPE
    // =========================================================

    public List<Question> getQuestionsByType(
        String typeName
    ) {

        String normalizedType =
            normalizeInterviewType(typeName);

        InterviewType type =
            typeRepository
                .findByTypeName(normalizedType)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Interview type not found"
                    )
                );

        List<Question> questions =
            questionRepository
                .findByInterviewTypeTypeId(
                    type.getTypeId()
                );

        questions.sort(
            Comparator.comparing(
                Question::getQuestionId,
                Comparator.nullsLast(Long::compareTo)
            )
        );

        if (questions.size() > MAX_INTERVIEW_QUESTIONS) {

            return questions.subList(
                0,
                MAX_INTERVIEW_QUESTIONS
            );
        }

        return questions;
    }


    // =========================================================
    // GET SESSION ANSWERS
    // =========================================================

    public List<Answer> getSessionAnswers(
        Long sessionId,
        Long userId
    ) {

        /*
         * Ownership check happens before answers are retrieved.
         */
        getSession(
            sessionId,
            userId
        );

        return answerRepository
            .findByInterviewSessionSessionId(
                sessionId
            );
    }


    // =========================================================
    // VALIDATION HELPERS
    // =========================================================

    private void validateUserId(Long userId) {

        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException(
                "Invalid user"
            );
        }
    }

    private void validateSessionId(Long sessionId) {

        if (sessionId == null || sessionId <= 0) {
            throw new IllegalArgumentException(
                "Invalid interview session"
            );
        }
    }

    private String normalizeInterviewType(
        String interviewTypeName
    ) {

        if (interviewTypeName == null) {
            throw new IllegalArgumentException(
                "Invalid interview type"
            );
        }

        String normalized =
            interviewTypeName.trim();

        if (normalized.isEmpty()
            || normalized.length() > MAX_INTERVIEW_TYPE_LENGTH) {

            throw new IllegalArgumentException(
                "Invalid interview type"
            );
        }

        return normalized;
    }

    private BigDecimal extractAndValidateScore(
        ObjectNode evaluation
    ) {

        JsonNode scoreNode =
            evaluation.get("score");

        if (scoreNode == null
            || !scoreNode.isNumber()) {

            throw new RuntimeException(
                "Invalid evaluation result"
            );
        }

        BigDecimal score;

        try {

            score =
                new BigDecimal(
                    scoreNode.asText()
                );

        } catch (NumberFormatException e) {

            throw new RuntimeException(
                "Invalid evaluation result"
            );
        }

        if (!isValidScore(score)) {

            throw new RuntimeException(
                "Invalid evaluation result"
            );
        }

        return score.setScale(
            2,
            RoundingMode.HALF_UP
        );
    }

    private boolean isValidScore(
        BigDecimal score
    ) {

        return score != null
            && score.compareTo(MIN_SCORE) >= 0
            && score.compareTo(MAX_SCORE) <= 0;
    }

    private String extractText(
        ObjectNode node,
        String field
    ) {

        if (node == null || field == null) {
            return "";
        }

        JsonNode value =
            node.get(field);

        if (value == null
            || value.isNull()) {
            return "";
        }

        String text =
            value.asText();

        return text == null
            ? ""
            : text.trim();
    }

    private String safeString(
        String value
    ) {

        return value == null
            ? ""
            : value.trim();
    }


    // =========================================================
    // JSON SERIALIZATION
    // =========================================================

    private String serializeJsonNode(
        JsonNode node
    ) {

        if (node == null
            || node.isNull()) {
            return null;
        }

        try {

            return objectMapper
                .writeValueAsString(node);

        } catch (Exception e) {

            log.warn(
                "Unable to serialize evaluation JSON"
            );

            return null;
        }
    }
}