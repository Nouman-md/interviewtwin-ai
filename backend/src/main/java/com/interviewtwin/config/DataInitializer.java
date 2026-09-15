package com.interviewtwin.config;

import com.interviewtwin.entity.InterviewType;
import com.interviewtwin.repository.InterviewTypeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Seeds the interview_types table with the canonical interview type names
 * that the frontend (InterviewSelection.jsx) sends via the API.
 *
 * Root cause this fixes: application.properties uses ddl-auto=update which
 * creates tables but does NOT seed data, and there was no DataInitializer.
 * As a result typeRepository.findByTypeName(...) returned empty for every
 * type and the backend responded with "Interview type not found" for all
 * interview cards.
 *
 * The typeName values below MUST stay in sync with the `id` field of the
 * interviewTypes array in frontend/src/pages/InterviewSelection.jsx.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Order(1)
@Transactional
public class DataInitializer implements CommandLineRunner {

    private final InterviewTypeRepository interviewTypeRepository;

    @Override
    public void run(String... args) {
        seedInterviewType("TECHNICAL_INTERVIEW", "Technical interview with coding and system design questions");
        seedInterviewType("HR_INTERVIEW", "HR interview focusing on soft skills and experience");
        seedInterviewType("RESUME_BASED_INTERVIEW", "Interview based on resume content");
        seedInterviewType("JAVA_INTERVIEW", "Java-specific technical interview");
        seedInterviewType("SQL_INTERVIEW", "SQL and database interview");
        seedInterviewType("OOP_INTERVIEW", "Object-Oriented Programming interview");
        seedInterviewType("DBMS_INTERVIEW", "Database Management System interview");
        seedInterviewType("OS_INTERVIEW", "Operating System interview");
        seedInterviewType("COMPUTER_NETWORKS_INTERVIEW", "Computer Networks interview");
        seedInterviewType("CASE_INTERVIEW", "Case study interview for problem-solving and analytical skills");

        log.info("Interview type seed data verified: {} types present", interviewTypeRepository.count());
    }

    private void seedInterviewType(String typeName, String description) {
        interviewTypeRepository.findByTypeName(typeName)
            .orElseGet(() -> {
                log.info("Seeding missing interview type: {}", typeName);
                return interviewTypeRepository.save(
                    InterviewType.builder()
                        .typeName(typeName)
                        .description(description)
                        .build()
                );
            });
    }
}