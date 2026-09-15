package com.interviewtwin.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.interviewtwin.dto.PerformanceDTO;
import com.interviewtwin.entity.Performance;
import com.interviewtwin.entity.User;
import com.interviewtwin.repository.PerformanceRepository;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
@Transactional
public class PerformanceService {

    private static final BigDecimal MIN_SCORE = BigDecimal.ZERO;
    private static final BigDecimal MAX_SCORE = new BigDecimal("100");

    private final PerformanceRepository performanceRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    /**
     * Initialize a performance record for a user if one does not already exist.
     */
    public PerformanceDTO initializePerformance(Long userId) {

        validateUserId(userId);

        User user = getUser(userId);

        Performance performance = getOrCreatePerformance(user);

        return convertToDTO(performance);
    }

    /**
     * Get the user's performance record.
     * Creates a zeroed record if none exists.
     */
    public PerformanceDTO getPerformance(Long userId) {

        validateUserId(userId);

        User user = getUser(userId);

        Performance performance = getOrCreatePerformance(user);

        return convertToDTO(performance);
    }

    /**
     * Update ATS score.
     */
    public void updateATSScore(Long userId, BigDecimal score) {

        validateUserId(userId);
        BigDecimal safeScore = validateScore(score);

        Performance performance = getOrCreatePerformance(getUser(userId));

        performance.setAtsScore(safeScore);

        updateOverallScore(performance);
        performanceRepository.save(performance);
    }

    /**
     * Update technical interview score.
     */
    public void updateTechnicalScore(Long userId, BigDecimal score) {

        validateUserId(userId);
        BigDecimal safeScore = validateScore(score);

        Performance performance = getOrCreatePerformance(getUser(userId));

        performance.setTechnicalScore(safeScore);

        int currentInterviews = safeInt(performance.getTotalInterviews());
        performance.setTotalInterviews(currentInterviews + 1);

        updateOverallScore(performance);
        performanceRepository.save(performance);
    }

    /**
     * Update HR interview score.
     */
    public void updateHRScore(Long userId, BigDecimal score) {

        validateUserId(userId);
        BigDecimal safeScore = validateScore(score);

        Performance performance = getOrCreatePerformance(getUser(userId));

        performance.setHrScore(safeScore);

        int currentInterviews = safeInt(performance.getTotalInterviews());
        performance.setTotalInterviews(currentInterviews + 1);

        updateOverallScore(performance);
        performanceRepository.save(performance);
    }

    /**
     * Update coding score.
     */
    public void updateCodingScore(Long userId, BigDecimal score) {

        validateUserId(userId);
        BigDecimal safeScore = validateScore(score);

        Performance performance = getOrCreatePerformance(getUser(userId));

        performance.setCodingScore(safeScore);

int currentProblems = safeInt(performance.getTotalCodingProblems());
        performance.setTotalCodingProblems(currentProblems + 1);

        updateOverallScore(performance);
        performanceRepository.save(performance);
    }

    /**
     * Update communication score.
     */
    public void updateCommunicationScore(Long userId, BigDecimal score) {

        validateUserId(userId);
        BigDecimal safeScore = validateScore(score);

        Performance performance = getOrCreatePerformance(getUser(userId));

        performance.setCommunicationScore(safeScore);

        updateOverallScore(performance);
        performanceRepository.save(performance);
    }

    /**
     * Identify weak and strong performance areas.
     */
    public void identifyWeakAreas(Long userId) {

        validateUserId(userId);

        Performance performance = performanceRepository.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Performance record not found"));

        ObjectNode weakTopics = objectMapper.createObjectNode();
        ObjectNode strongTopics = objectMapper.createObjectNode();

        addScoreAnalysis(
            weakTopics,
            strongTopics,
            "technical",
            performance.getTechnicalScore()
        );

        addScoreAnalysis(
            weakTopics,
            strongTopics,
            "coding",
            performance.getCodingScore()
        );

        addScoreAnalysis(
            weakTopics,
            strongTopics,
            "hr",
            performance.getHrScore()
        );

        addScoreAnalysis(
            weakTopics,
            strongTopics,
            "communication",
            performance.getCommunicationScore()
        );

        addScoreAnalysis(
            weakTopics,
            strongTopics,
            "ats",
            performance.getAtsScore()
        );

        performance.setWeakTopics(weakTopics.toString());
        performance.setStrongTopics(strongTopics.toString());

        performanceRepository.save(performance);
    }

    /**
     * Creates weak/strong classification for a score.
     */
    private void addScoreAnalysis(
        ObjectNode weakTopics,
        ObjectNode strongTopics,
        String name,
        BigDecimal score
    ) {

        if (score == null) {
            return;
        }

        BigDecimal normalizedScore = score.setScale(2, RoundingMode.HALF_UP);

        if (normalizedScore.compareTo(new BigDecimal("60")) < 0) {

            weakTopics.put(name, normalizedScore.doubleValue());

        } else if (normalizedScore.compareTo(new BigDecimal("75")) >= 0) {

            strongTopics.put(name, normalizedScore.doubleValue());
        }
    }

    /**
     * Calculate overall placement readiness.
     *
     * Only positive scores are included, preserving the original
     * application's calculation behaviour.
     */
    private void updateOverallScore(Performance performance) {

        BigDecimal[] scores = {
            performance.getAtsScore(),
            performance.getTechnicalScore(),
            performance.getHrScore(),
            performance.getCodingScore(),
            performance.getCommunicationScore()
        };

        BigDecimal sum = BigDecimal.ZERO;
        int count = 0;

        for (BigDecimal score : scores) {

            if (score != null
                && score.compareTo(BigDecimal.ZERO) > 0
                && score.compareTo(MAX_SCORE) <= 0) {

                sum = sum.add(score);
                count++;
            }
        }

        if (count > 0) {

            BigDecimal average = sum.divide(
                BigDecimal.valueOf(count),
                2,
                RoundingMode.HALF_UP
            );

            performance.setOverallPlacementReadiness(average);

        } else {

            performance.setOverallPlacementReadiness(BigDecimal.ZERO);
        }
    }

    /**
     * Get an existing performance record or create a fully initialized one.
     */
    private Performance getOrCreatePerformance(User user) {

        Long userId = user.getUserId();

        return performanceRepository.findByUserId(userId)
            .orElseGet(() -> {

                Performance newPerformance = Performance.builder()
                    .user(user)
                    .atsScore(BigDecimal.ZERO)
                    .technicalScore(BigDecimal.ZERO)
                    .hrScore(BigDecimal.ZERO)
                    .codingScore(BigDecimal.ZERO)
                    .communicationScore(BigDecimal.ZERO)
                    .overallPlacementReadiness(BigDecimal.ZERO)
                    .totalInterviews(0)
                    .totalCodingProblems(0)
                    .build();

                return performanceRepository.save(newPerformance);
            });
    }

    /**
     * Retrieve a user without exposing database details.
     */
    private User getUser(Long userId) {

        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Validate the supplied user ID.
     */
    private void validateUserId(Long userId) {

        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user");
        }
    }

    /**
     * Validate and normalize performance scores.
     *
     * Scores are restricted to 0-100.
     */
    private BigDecimal validateScore(BigDecimal score) {

        if (score == null) {
            throw new IllegalArgumentException("Invalid score");
        }

        if (score.compareTo(MIN_SCORE) < 0
            || score.compareTo(MAX_SCORE) > 0) {

            throw new IllegalArgumentException("Invalid score");
        }

        return score.setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Prevent null counters from causing runtime failures.
     */
    private int safeInt(Integer value) {

        if (value == null || value < 0) {
            return 0;
        }

        return value;
    }

    /**
     * Convert entity to DTO without exposing internal entity fields.
     */
    private PerformanceDTO convertToDTO(Performance performance) {

        if (performance == null || performance.getUser() == null) {
            throw new RuntimeException("Performance data unavailable");
        }

        return PerformanceDTO.builder()
            .performanceId(performance.getPerformanceId())
            .userId(performance.getUser().getUserId())
            .atsScore(performance.getAtsScore())
            .technicalScore(performance.getTechnicalScore())
            .hrScore(performance.getHrScore())
            .codingScore(performance.getCodingScore())
            .communicationScore(performance.getCommunicationScore())
            .overallPlacementReadiness(performance.getOverallPlacementReadiness())
            .totalInterviews(safeInt(performance.getTotalInterviews()))
            .totalCodingProblems(safeInt(performance.getTotalCodingProblems()))
            .weakTopics(performance.getWeakTopics())
            .strongTopics(performance.getStrongTopics())
            .build();
    }
}