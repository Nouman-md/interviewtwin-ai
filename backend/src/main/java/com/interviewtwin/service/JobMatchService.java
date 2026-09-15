package com.interviewtwin.service;

import com.interviewtwin.dto.JobMatchDTO;
import com.interviewtwin.dto.JobMatchRequestDTO;
import com.interviewtwin.entity.Resume;
import com.interviewtwin.repository.ResumeRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class JobMatchService {

    private final ResumeRepository resumeRepository;

    @Value("${file.upload.directory:uploads/resumes/}")
    private String uploadDirectory;

    private static final Tika TIKA = new Tika();

    private static final int MAX_JOB_TITLE_LENGTH = 200;
    private static final int MAX_COMPANY_NAME_LENGTH = 200;
    private static final int MAX_JOB_DESCRIPTION_LENGTH = 50_000;
    private static final int MAX_RESUME_TEXT_LENGTH = 1_000_000;
    private static final long MAX_RESUME_FILE_SIZE =
            10L * 1024L * 1024L;

    // =========================================================
    // ROLE PROFILES
    // =========================================================

    private static final Map<String, RoleProfile> ROLE_PROFILES =
            new LinkedHashMap<>();

    static {

        addRole(
                "data analyst",
                set(
                        "data analysis",
                        "sql",
                        "excel",
                        "python",
                        "data cleaning",
                        "data visualization",
                        "statistics",
                        "power bi"
                ),
                set(
                        "pandas",
                        "numpy",
                        "tableau",
                        "power query",
                        "power pivot",
                        "dax",
                        "kpi analysis",
                        "trend analysis",
                        "business intelligence",
                        "business reporting",
                        "etl",
                        "data interpretation",
                        "data analytics"
                )
        );

        addRole(
                "data analytics",
                set(
                        "data analysis",
                        "sql",
                        "excel",
                        "python",
                        "data cleaning",
                        "data visualization",
                        "statistics",
                        "power bi"
                ),
                set(
                        "pandas",
                        "numpy",
                        "tableau",
                        "power query",
                        "power pivot",
                        "dax",
                        "kpi analysis",
                        "trend analysis",
                        "business intelligence",
                        "business reporting",
                        "etl",
                        "data interpretation",
                        "data analytics"
                )
        );

        addRole(
                "java developer",
                set(
                        "java",
                        "object oriented programming",
                        "data structures",
                        "algorithms"
                ),
                set(
                        "spring boot",
                        "spring",
                        "sql",
                        "mysql",
                        "rest api",
                        "hibernate",
                        "jpa",
                        "git",
                        "github",
                        "maven",
                        "junit"
                )
        );

        addRole(
                "backend developer",
                set(
                        "backend development",
                        "rest api",
                        "database"
                ),
                set(
                        "java",
                        "python",
                        "node.js",
                        "spring boot",
                        "express",
                        "sql",
                        "mysql",
                        "postgresql",
                        "mongodb",
                        "git",
                        "docker",
                        "microservices"
                )
        );

        addRole(
                "frontend developer",
                set(
                        "html",
                        "css",
                        "javascript",
                        "react"
                ),
                set(
                        "typescript",
                        "angular",
                        "vue",
                        "bootstrap",
                        "tailwind",
                        "redux",
                        "git",
                        "responsive design",
                        "rest api"
                )
        );

        addRole(
                "full stack developer",
                set(
                        "html",
                        "css",
                        "javascript",
                        "backend development",
                        "database"
                ),
                set(
                        "react",
                        "angular",
                        "vue",
                        "node.js",
                        "express",
                        "java",
                        "spring boot",
                        "sql",
                        "mysql",
                        "mongodb",
                        "rest api",
                        "git",
                        "docker"
                )
        );

        addRole(
                "python developer",
                set(
                        "python",
                        "object oriented programming"
                ),
                set(
                        "django",
                        "flask",
                        "fastapi",
                        "rest api",
                        "sql",
                        "mysql",
                        "postgresql",
                        "mongodb",
                        "git",
                        "docker",
                        "pytest"
                )
        );

        addRole(
                "software developer",
                set(
                        "software development",
                        "object oriented programming",
                        "data structures",
                        "algorithms",
                        "problem solving"
                ),
                set(
                        "java",
                        "python",
                        "javascript",
                        "sql",
                        "git",
                        "github",
                        "rest api",
                        "testing",
                        "debugging"
                )
        );

        addRole(
                "software engineer",
                set(
                        "software development",
                        "data structures",
                        "algorithms",
                        "problem solving"
                ),
                set(
                        "java",
                        "python",
                        "javascript",
                        "sql",
                        "git",
                        "rest api",
                        "testing",
                        "system design"
                )
        );

        addRole(
                "data scientist",
                set(
                        "python",
                        "statistics",
                        "machine learning",
                        "data analysis"
                ),
                set(
                        "pandas",
                        "numpy",
                        "scikit-learn",
                        "matplotlib",
                        "seaborn",
                        "sql",
                        "data visualization",
                        "deep learning",
                        "tensorflow",
                        "pytorch",
                        "feature engineering",
                        "predictive analytics"
                )
        );

        addRole(
                "machine learning engineer",
                set(
                        "python",
                        "machine learning",
                        "statistics",
                        "data structures",
                        "algorithms"
                ),
                set(
                        "scikit-learn",
                        "tensorflow",
                        "pytorch",
                        "pandas",
                        "numpy",
                        "deep learning",
                        "docker",
                        "git",
                        "aws",
                        "model deployment",
                        "mlops"
                )
        );

        addRole(
                "ai engineer",
                set(
                        "python",
                        "artificial intelligence",
                        "machine learning"
                ),
                set(
                        "deep learning",
                        "natural language processing",
                        "computer vision",
                        "tensorflow",
                        "pytorch",
                        "scikit-learn",
                        "generative ai",
                        "large language models",
                        "docker",
                        "git"
                )
        );

        addRole(
                "devops engineer",
                set(
                        "linux",
                        "docker",
                        "ci/cd"
                ),
                set(
                        "kubernetes",
                        "jenkins",
                        "aws",
                        "azure",
                        "terraform",
                        "ansible",
                        "git",
                        "github",
                        "bash",
                        "monitoring"
                )
        );

        addRole(
                "cloud engineer",
                set(
                        "cloud computing",
                        "linux"
                ),
                set(
                        "aws",
                        "azure",
                        "gcp",
                        "docker",
                        "kubernetes",
                        "terraform",
                        "networking",
                        "security",
                        "devops"
                )
        );

        addRole(
                "qa engineer",
                set(
                        "software testing",
                        "testing",
                        "quality assurance"
                ),
                set(
                        "manual testing",
                        "automation testing",
                        "selenium",
                        "junit",
                        "test automation",
                        "api testing",
                        "postman",
                        "cypress",
                        "integration testing",
                        "regression testing"
                )
        );

        addRole(
                "cybersecurity analyst",
                set(
                        "cybersecurity",
                        "network security",
                        "information security"
                ),
                set(
                        "penetration testing",
                        "vulnerability assessment",
                        "ethical hacking",
                        "linux",
                        "firewalls",
                        "siem",
                        "incident response",
                        "encryption",
                        "authentication"
                )
        );

        addRole(
                "business analyst",
                set(
                        "business analysis",
                        "requirements analysis",
                        "communication"
                ),
                set(
                        "sql",
                        "excel",
                        "power bi",
                        "data analysis",
                        "business intelligence",
                        "stakeholder management",
                        "jira",
                        "agile",
                        "scrum",
                        "documentation"
                )
        );
    }

    // =========================================================
    // MAIN ANALYSIS
    // =========================================================

    public JobMatchDTO analyze(
            Long userId,
            JobMatchRequestDTO request) {

        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException(
                    "Invalid user ID"
            );
        }

        if (request == null) {
            throw new IllegalArgumentException(
                    "Job match request cannot be null"
            );
        }

        validateInputLength(
                request.getJobTitle(),
                MAX_JOB_TITLE_LENGTH,
                "Job title"
        );

        validateInputLength(
                request.getCompanyName(),
                MAX_COMPANY_NAME_LENGTH,
                "Company name"
        );

        validateInputLength(
                request.getJobDescription(),
                MAX_JOB_DESCRIPTION_LENGTH,
                "Job description"
        );

        if (request.getResumeId() == null) {
            throw new IllegalArgumentException(
                    "Resume ID is required"
            );
        }

        Resume resume =
                resumeRepository
                        .findByResumeIdAndUserId(
                                request.getResumeId(),
                                userId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Resume not found"
                                )
                        );

        String resumeText =
                extractResumeText(resume);

        if (resumeText == null
                || resumeText.isBlank()) {

            throw new RuntimeException(
                    "Unable to extract text from resume"
            );
        }

        String normalizedResume =
                normalize(resumeText);

        String suppliedRole =
                normalize(request.getJobTitle());

        String jobDescription =
                normalize(request.getJobDescription());

        String effectiveRole =
                determineEffectiveRole(
                        suppliedRole,
                        jobDescription
                );

        RoleProfile profile =
                findRoleProfile(effectiveRole);

        List<String> coreSkills =
                new ArrayList<>();

        List<String> supportingSkills =
                new ArrayList<>();

        if (profile != null) {

            coreSkills.addAll(
                    profile.coreSkills
            );

            supportingSkills.addAll(
                    profile.supportingSkills
            );
        }

        if (!jobDescription.isBlank()) {

            List<String> jdSkills =
                    extractKnownSkills(
                            jobDescription
                    );

            for (String skill : jdSkills) {

                if (!containsEquivalent(
                        skill,
                        coreSkills
                )
                        && !containsEquivalent(
                        skill,
                        supportingSkills
                )) {

                    supportingSkills.add(skill);
                }
            }
        }

        if (profile == null) {

            List<String> discoveredSkills =
                    new ArrayList<>();

            discoveredSkills.addAll(
                    extractKnownSkills(
                            effectiveRole
                    )
            );

            discoveredSkills.addAll(
                    extractKnownSkills(
                            jobDescription
                    )
            );

            supportingSkills.addAll(
                    discoveredSkills
            );
        }

        coreSkills =
                unique(coreSkills);

        supportingSkills =
                unique(
                        removeDuplicatesAlreadyIn(
                                supportingSkills,
                                coreSkills
                        )
                );

        List<String> matchingCore =
                new ArrayList<>();

        List<String> missingCore =
                new ArrayList<>();

        for (String skill : coreSkills) {

            if (matchesSkill(
                    skill,
                    normalizedResume
            )) {

                matchingCore.add(skill);

            } else {

                missingCore.add(skill);
            }
        }

        List<String> matchingSupporting =
                new ArrayList<>();

        List<String> missingSupporting =
                new ArrayList<>();

        for (String skill : supportingSkills) {

            if (matchesSkill(
                    skill,
                    normalizedResume
            )) {

                matchingSupporting.add(skill);

            } else {

                missingSupporting.add(skill);
            }
        }

        List<String> matchingSkills =
                new ArrayList<>();

        matchingSkills.addAll(
                matchingCore
        );

        matchingSkills.addAll(
                matchingSupporting
        );

        List<String> missingSkills =
                new ArrayList<>();

        missingSkills.addAll(
                missingCore
        );

        missingSkills.addAll(
                missingSupporting
        );

        matchingSkills =
                unique(matchingSkills);

        missingSkills =
                unique(missingSkills);

        double coreScore =
                calculatePercentage(
                        matchingCore.size(),
                        coreSkills.size()
                );

        double supportingScore =
                calculatePercentage(
                        matchingSupporting.size(),
                        supportingSkills.size()
                );

        double technicalScore;

        if (!coreSkills.isEmpty()
                && !supportingSkills.isEmpty()) {

            technicalScore =
                    (coreScore * 0.70)
                            + (supportingScore * 0.30);

        } else if (!coreSkills.isEmpty()) {

            technicalScore = coreScore;

        } else {

            technicalScore = supportingScore;
        }

        double roleScore =
                calculateRoleScore(
                        effectiveRole,
                        normalizedResume
                );

        double jdScore;

        if (jobDescription.isBlank()) {

            jdScore = technicalScore;

        } else {

            jdScore =
                    calculateJDScore(
                            jobDescription,
                            normalizedResume
                    );
        }

        double finalScore =
                (technicalScore * 0.65)
                        + (roleScore * 0.15)
                        + (jdScore * 0.20);

        finalScore =
                clamp(
                        finalScore,
                        0,
                        100
                );

        List<String> suggestions =
                buildSuggestions(
                        effectiveRole,
                        matchingCore,
                        missingCore,
                        missingSupporting,
                        finalScore
                );

        return JobMatchDTO.builder()
                .jobId(null)
                .resumeId(resume.getResumeId())
                .jobTitle(request.getJobTitle())
                .companyName(request.getCompanyName())
                .matchPercentage(
                        BigDecimal
                                .valueOf(finalScore)
                                .setScale(
                                        2,
                                        RoundingMode.HALF_UP
                                )
                )
                .matchingSkills(matchingSkills)
                .missingSkills(missingSkills)
                .suggestions(suggestions)
                .analyzedAt(LocalDateTime.now())
                .build();
    }

    // =========================================================
    // INPUT VALIDATION
    // =========================================================

    private void validateInputLength(
            String value,
            int maximum,
            String fieldName) {

        if (value != null
                && value.length() > maximum) {

            throw new IllegalArgumentException(
                    fieldName + " is too long"
            );
        }
    }

    // =========================================================
    // DETERMINE EFFECTIVE ROLE
    // =========================================================

    private String determineEffectiveRole(
            String suppliedRole,
            String jobDescription) {

        boolean validSuppliedRole =
                suppliedRole != null
                        && !suppliedRole.isBlank()
                        && !suppliedRole.equals(
                        "custom job description"
                )
                        && !suppliedRole.equals("n/a");

        if (validSuppliedRole) {
            return suppliedRole;
        }

        String detectedRole =
                detectRoleFromJobDescription(
                        jobDescription
                );

        if (detectedRole != null) {
            return detectedRole;
        }

        return "";
    }

    // =========================================================
    // DETECT ROLE FROM JOB DESCRIPTION
    // =========================================================

    private String detectRoleFromJobDescription(
            String jobDescription) {

        if (jobDescription == null
                || jobDescription.isBlank()) {

            return null;
        }

        String text =
                normalize(jobDescription);

        List<String> roleOrder =
                Arrays.asList(
                        "machine learning engineer",
                        "full stack developer",
                        "frontend developer",
                        "backend developer",
                        "java developer",
                        "python developer",
                        "data scientist",
                        "data analyst",
                        "data analytics",
                        "software engineer",
                        "software developer",
                        "ai engineer",
                        "devops engineer",
                        "cloud engineer",
                        "qa engineer",
                        "cybersecurity analyst",
                        "business analyst"
                );

        for (String role : roleOrder) {

            if (containsPhrase(
                    text,
                    role
            )) {

                return role;
            }
        }

        if (containsPhrase(
                text,
                "data analyst"
        )
                || containsPhrase(
                text,
                "data analytics"
        )) {

            return "data analyst";
        }

        if (containsPhrase(
                text,
                "java developer"
        )
                || containsPhrase(
                text,
                "java engineer"
        )) {

            return "java developer";
        }

        if (containsPhrase(
                text,
                "backend developer"
        )
                || containsPhrase(
                text,
                "back end developer"
        )) {

            return "backend developer";
        }

        if (containsPhrase(
                text,
                "frontend developer"
        )
                || containsPhrase(
                text,
                "front end developer"
        )) {

            return "frontend developer";
        }

        if (containsPhrase(
                text,
                "full stack developer"
        )
                || containsPhrase(
                text,
                "fullstack developer"
        )) {

            return "full stack developer";
        }

        if (containsPhrase(
                text,
                "data scientist"
        )) {

            return "data scientist";
        }

        if (containsPhrase(
                text,
                "machine learning engineer"
        )
                || containsPhrase(
                text,
                "ml engineer"
        )) {

            return "machine learning engineer";
        }

        if (containsPhrase(
                text,
                "devops engineer"
        )) {

            return "devops engineer";
        }

        if (containsPhrase(
                text,
                "cloud engineer"
        )) {

            return "cloud engineer";
        }

        if (containsPhrase(
                text,
                "qa engineer"
        )
                || containsPhrase(
                text,
                "quality assurance engineer"
        )) {

            return "qa engineer";
        }

        if (containsPhrase(
                text,
                "cybersecurity analyst"
        )
                || containsPhrase(
                text,
                "cyber security analyst"
        )) {

            return "cybersecurity analyst";
        }

        if (containsPhrase(
                text,
                "business analyst"
        )) {

            return "business analyst";
        }

        return null;
    }

    // =========================================================
    // RESUME TEXT EXTRACTION
    // =========================================================

    private String extractResumeText(
            Resume resume) {

        if (resume == null) {
            throw new RuntimeException(
                    "Resume not found"
            );
        }

        if (resume.getFilePath() == null
                || resume.getFilePath().isBlank()) {

            throw new RuntimeException(
                    "Resume file not found"
            );
        }

        try {

            Path uploadRoot =
                    Path.of(uploadDirectory)
                            .toAbsolutePath()
                            .normalize();

            Path resumePath =
                    Path.of(resume.getFilePath())
                            .toAbsolutePath()
                            .normalize();

            /*
             * SECURITY:
             * The database-stored resume path must remain
             * inside the configured upload directory.
             */
            if (!resumePath.startsWith(uploadRoot)) {

                throw new RuntimeException(
                        "Invalid resume file location"
                );
            }

            if (!Files.exists(resumePath)
                    || !Files.isRegularFile(resumePath)) {

                throw new RuntimeException(
                        "Resume file not found"
                );
            }

            String fileName =
                    resumePath.getFileName()
                            .toString()
                            .toLowerCase(Locale.ROOT);

            if (!fileName.endsWith(".pdf")
                    && !fileName.endsWith(".doc")
                    && !fileName.endsWith(".docx")) {

                throw new RuntimeException(
                        "Unsupported resume format"
                );
            }

            long fileSize =
                    Files.size(resumePath);

            if (fileSize <= 0) {

                throw new RuntimeException(
                        "Resume file is empty"
                );
            }

            if (fileSize > MAX_RESUME_FILE_SIZE) {

                throw new RuntimeException(
                        "Resume file is too large"
                );
            }

            try (var inputStream =
                         Files.newInputStream(resumePath)) {

                String text =
                        TIKA.parseToString(
                                inputStream
                        );

                if (text == null) {
                    return "";
                }

                if (text.length()
                        > MAX_RESUME_TEXT_LENGTH) {

                    text =
                            text.substring(
                                    0,
                                    MAX_RESUME_TEXT_LENGTH
                            );
                }

                return text.trim();
            }

        } catch (RuntimeException e) {

            throw e;

        } catch (Exception e) {

            /*
             * Do not expose internal filesystem/parser
             * exception details.
             */
            throw new RuntimeException(
                    "Failed to extract resume content"
            );
        }
    }

    // =========================================================
    // FIND ROLE PROFILE
    // =========================================================

    private RoleProfile findRoleProfile(
            String role) {

        if (role == null
                || role.isBlank()) {

            return null;
        }

        if (ROLE_PROFILES.containsKey(role)) {

            return ROLE_PROFILES.get(role);
        }

        for (Map.Entry<String, RoleProfile> entry :
                ROLE_PROFILES.entrySet()) {

            String profileName =
                    entry.getKey();

            if (role.contains(profileName)
                    || profileName.contains(role)) {

                return entry.getValue();
            }
        }

        return null;
    }

    // =========================================================
    // EXTRACT KNOWN SKILLS
    // =========================================================

    private List<String> extractKnownSkills(
            String text) {

        List<String> result =
                new ArrayList<>();

        if (text == null
                || text.isBlank()) {

            return result;
        }

        Map<String, Set<String>> aliases =
                createSkillAliases();

        List<String> skills =
                new ArrayList<>(
                        aliases.keySet()
                );

        skills.sort(
                Comparator
                        .comparingInt(
                                String::length
                        )
                        .reversed()
        );

        for (String canonical : skills) {

            Set<String> skillAliases =
                    aliases.get(canonical);

            for (String alias : skillAliases) {

                if (containsPhrase(
                        text,
                        alias
                )) {

                    result.add(canonical);
                    break;
                }
            }
        }

        return unique(result);
    }

    // =========================================================
    // SKILL ALIASES
    // =========================================================

    private Map<String, Set<String>>
    createSkillAliases() {

        Map<String, Set<String>> map =
                new LinkedHashMap<>();

        alias(map, "java",
                "java");

        alias(map, "python",
                "python");

        alias(map, "javascript",
                "javascript",
                "js");

        alias(map, "typescript",
                "typescript",
                "ts");

        alias(map, "c++",
                "c++",
                "cpp");

        alias(map, "c#",
                "c#",
                "c sharp");

        alias(map, "html",
                "html",
                "html5");

        alias(map, "css",
                "css",
                "css3");

        alias(map, "react",
                "react",
                "react.js",
                "reactjs");

        alias(map, "angular",
                "angular",
                "angular.js",
                "angularjs");

        alias(map, "vue",
                "vue",
                "vue.js",
                "vuejs");

        alias(map, "node.js",
                "node.js",
                "nodejs",
                "node js");

        alias(map, "express",
                "express",
                "express.js",
                "expressjs");

        alias(map, "spring boot",
                "spring boot",
                "springboot");

        alias(map, "spring",
                "spring",
                "spring framework");

        alias(map, "hibernate",
                "hibernate");

        alias(map, "jpa",
                "jpa",
                "java persistence api");

        alias(map, "sql",
                "sql",
                "structured query language");

        alias(map, "mysql",
                "mysql");

        alias(map, "postgresql",
                "postgresql",
                "postgres");

        alias(map, "oracle",
                "oracle",
                "oracle database");

        alias(map, "mongodb",
                "mongodb",
                "mongo db");

        alias(map, "redis",
                "redis");

        alias(map, "database",
                "database",
                "databases");

        alias(map, "rest api",
                "rest api",
                "rest apis",
                "restful api",
                "restful apis",
                "rest services");

        alias(map, "graphql",
                "graphql");

        alias(map, "git",
                "git");

        alias(map, "github",
                "github",
                "git hub");

        alias(map, "docker",
                "docker");

        alias(map, "kubernetes",
                "kubernetes",
                "k8s");

        alias(map, "jenkins",
                "jenkins");

        alias(map, "aws",
                "aws",
                "amazon web services");

        alias(map, "azure",
                "azure",
                "microsoft azure");

        alias(map, "gcp",
                "gcp",
                "google cloud",
                "google cloud platform");

        alias(map, "linux",
                "linux",
                "unix");

        alias(map, "data structures",
                "data structures",
                "data structure");

        alias(map, "algorithms",
                "algorithms",
                "algorithm");

        alias(map, "object oriented programming",
                "object oriented programming",
                "object-oriented programming",
                "oop");

        alias(map, "problem solving",
                "problem solving",
                "problem-solving");

        alias(map, "software development",
                "software development");

        alias(map, "backend development",
                "backend development",
                "backend developer");

        alias(map, "frontend development",
                "frontend development",
                "frontend developer",
                "front end development");

        alias(map, "data analytics",
                "data analytics",
                "data analyst");

        alias(map, "data analysis",
                "data analysis",
                "data analyses");

        alias(map, "data cleaning",
                "data cleaning",
                "data cleansing",
                "cleaning data");

        alias(map, "data visualization",
                "data visualization",
                "data visualisation",
                "visualization",
                "visualisation",
                "basic visualization",
                "data visualizations",
                "data visualisations");

        alias(map, "data interpretation",
                "data interpretation",
                "interpreting data");

        alias(map, "exploratory data analysis",
                "exploratory data analysis",
                "eda");

        alias(map, "business intelligence",
                "business intelligence");

        alias(map, "business reporting",
                "business reporting",
                "business reports");

        alias(map, "statistics",
                "statistics",
                "statistical analysis");

        alias(map, "advanced statistics",
                "advanced statistics");

        alias(map, "statistical modeling",
                "statistical modeling",
                "statistical modelling");

        alias(map, "hypothesis testing",
                "hypothesis testing");

        alias(map, "regression analysis",
                "regression analysis",
                "regression");

        alias(map, "predictive analytics",
                "predictive analytics");

        alias(map, "excel",
                "excel",
                "microsoft excel",
                "ms excel");

        alias(map, "power bi",
                "power bi",
                "powerbi");

        alias(map, "tableau",
                "tableau");

        alias(map, "power query",
                "power query");

        alias(map, "power pivot",
                "power pivot");

        alias(map, "dax",
                "dax");

        alias(map, "pandas",
                "pandas");

        alias(map, "numpy",
                "numpy");

        alias(map, "matplotlib",
                "matplotlib");

        alias(map, "seaborn",
                "seaborn");

        alias(map, "kpi analysis",
                "kpi analysis",
                "kpi tracking");

        alias(map, "trend analysis",
                "trend analysis");

        alias(map, "etl",
                "etl",
                "extract transform load");

        alias(map, "data pipelines",
                "data pipeline",
                "data pipelines");

        alias(map, "data warehousing",
                "data warehousing",
                "data warehouse");

        alias(map, "machine learning",
                "machine learning");

        alias(map, "deep learning",
                "deep learning");

        alias(map, "artificial intelligence",
                "artificial intelligence",
                "ai");

        alias(map, "natural language processing",
                "natural language processing",
                "nlp");

        alias(map, "computer vision",
                "computer vision");

        alias(map, "generative ai",
                "generative ai",
                "generative artificial intelligence");

        alias(map, "large language models",
                "large language models",
                "llm",
                "llms");

        alias(map, "scikit-learn",
                "scikit-learn",
                "scikit learn",
                "sklearn");

        alias(map, "tensorflow",
                "tensorflow");

        alias(map, "pytorch",
                "pytorch");

        alias(map, "software testing",
                "software testing");

        alias(map, "testing",
                "testing");

        alias(map, "quality assurance",
                "quality assurance");

        alias(map, "unit testing",
                "unit testing",
                "unit tests");

        alias(map, "integration testing",
                "integration testing",
                "integration tests");

        alias(map, "automation testing",
                "automation testing",
                "automated testing");

        alias(map, "selenium",
                "selenium");

        alias(map, "junit",
                "junit");

        alias(map, "postman",
                "postman");

        alias(map, "api testing",
                "api testing");

        alias(map, "ci/cd",
                "ci/cd",
                "continuous integration",
                "continuous deployment");

        alias(map, "devops",
                "devops",
                "dev ops");

        alias(map, "terraform",
                "terraform");

        alias(map, "ansible",
                "ansible");

        alias(map, "cloud computing",
                "cloud computing",
                "cloud technology");

        alias(map, "microservices",
                "microservices",
                "microservice");

        alias(map, "agile",
                "agile");

        alias(map, "scrum",
                "scrum");

        alias(map, "jira",
                "jira");

        alias(map, "communication",
                "communication",
                "communication skills");

        alias(map, "leadership",
                "leadership",
                "leadership skills");

        alias(map, "teamwork",
                "teamwork",
                "team work");

        alias(map, "critical thinking",
                "critical thinking");

        alias(map, "analytical thinking",
                "analytical thinking",
                "analytical skills");

        return map;
    }

    private void alias(
            Map<String, Set<String>> map,
            String canonical,
            String... aliases) {

        map.put(
                canonical,
                new LinkedHashSet<>(
                        Arrays.asList(aliases)
                )
        );
    }

    // =========================================================
    // MATCH SKILL
    // =========================================================

    private boolean matchesSkill(
            String skill,
            String resume) {

        Map<String, Set<String>> aliases =
                createSkillAliases();

        Set<String> possibleAliases =
                aliases.get(skill);

        if (possibleAliases != null) {

            for (String alias :
                    possibleAliases) {

                if (containsPhrase(
                        resume,
                        alias
                )) {

                    return true;
                }
            }
        }

        return containsPhrase(
                resume,
                skill
        );
    }

    // =========================================================
    // JD SCORE
    // =========================================================

    private double calculateJDScore(
            String jobDescription,
            String resume) {

        List<String> jdSkills =
                extractKnownSkills(
                        jobDescription
                );

        if (jdSkills.isEmpty()) {
            return 50;
        }

        int matched = 0;

        for (String skill : jdSkills) {

            if (matchesSkill(
                    skill,
                    resume
            )) {

                matched++;
            }
        }

        return calculatePercentage(
                matched,
                jdSkills.size()
        );
    }

    // =========================================================
    // ROLE SCORE
    // =========================================================

    private double calculateRoleScore(
            String role,
            String resume) {

        if (role == null
                || role.isBlank()) {

            return 50;
        }

        RoleProfile profile =
                findRoleProfile(role);

        if (profile != null) {

            List<String> allSkills =
                    new ArrayList<>();

            allSkills.addAll(
                    profile.coreSkills
            );

            allSkills.addAll(
                    profile.supportingSkills
            );

            int matched = 0;

            for (String skill : allSkills) {

                if (matchesSkill(
                        skill,
                        resume
                )) {

                    matched++;
                }
            }

            if (!allSkills.isEmpty()) {

                return calculatePercentage(
                        matched,
                        allSkills.size()
                );
            }
        }

        String[] words =
                role.split("\\s+");

        Set<String> ignored =
                Set.of(
                        "the",
                        "and",
                        "or",
                        "for",
                        "with",
                        "a",
                        "an",
                        "developer",
                        "engineer",
                        "analyst",
                        "intern",
                        "internship",
                        "senior",
                        "junior",
                        "associate",
                        "lead",
                        "software"
                );

        int total = 0;
        int matched = 0;

        for (String word : words) {

            if (word.length() < 3
                    || ignored.contains(word)) {

                continue;
            }

            total++;

            if (containsPhrase(
                    resume,
                    word
            )) {

                matched++;
            }
        }

        if (total == 0) {
            return 50;
        }

        return calculatePercentage(
                matched,
                total
        );
    }

    // =========================================================
    // SUGGESTIONS
    // =========================================================

    private List<String> buildSuggestions(
            String role,
            List<String> matchingCore,
            List<String> missingCore,
            List<String> missingSupporting,
            double finalScore) {

        List<String> suggestions =
                new ArrayList<>();

        if (!missingCore.isEmpty()) {

            suggestions.add(
                    "Strengthen your resume with evidence "
                            + "for these core "
                            + role
                            + " requirements: "
                            + String.join(
                            ", ",
                            limit(
                                    missingCore,
                                    6
                            )
                    )
            );
        }

        if (!missingSupporting.isEmpty()) {

            suggestions.add(
                    "If you have genuine experience with them, "
                            + "consider highlighting these supporting "
                            + "skills: "
                            + String.join(
                            ", ",
                            limit(
                                    missingSupporting,
                                    6
                            )
                    )
            );
        }

        if (finalScore < 50) {

            suggestions.add(
                    "Tailor your resume more closely to "
                            + "the target role and emphasize "
                            + "relevant technical skills, projects "
                            + "and experience."
            );

        } else if (finalScore < 75) {

            suggestions.add(
                    "Your resume has a moderate match. "
                            + "Strengthen evidence for your relevant "
                            + "skills with specific projects, "
                            + "technical contributions and measurable results."
            );

        } else {

            suggestions.add(
                    "Your resume has a strong alignment "
                            + "with the target role. Focus on "
                            + "measurable achievements and impact."
            );
        }

        if (matchingCore.isEmpty()) {

            suggestions.add(
                    "No core role skills were detected "
                            + "in the resume. Make sure relevant "
                            + "skills are clearly listed or demonstrated "
                            + "through projects and experience."
            );
        }

        return unique(suggestions);
    }

    // =========================================================
    // ADD ROLE
    // =========================================================

    private static void addRole(
            String name,
            Set<String> coreSkills,
            Set<String> supportingSkills) {

        ROLE_PROFILES.put(
                name,
                new RoleProfile(
                        coreSkills,
                        supportingSkills
                )
        );
    }

    // =========================================================
    // SET
    // =========================================================

    private static Set<String> set(
            String... values) {

        return new LinkedHashSet<>(
                Arrays.asList(values)
        );
    }

    // =========================================================
    // REMOVE DUPLICATES
    // =========================================================

    private List<String> removeDuplicatesAlreadyIn(
            List<String> values,
            List<String> existing) {

        List<String> result =
                new ArrayList<>();

        for (String value : values) {

            if (!containsEquivalent(
                    value,
                    existing
            )) {

                result.add(value);
            }
        }

        return result;
    }

    // =========================================================
    // EQUIVALENT
    // =========================================================

    private boolean containsEquivalent(
            String value,
            Collection<String> values) {

        String normalizedValue =
                normalize(value);

        for (String existing : values) {

            if (normalize(existing)
                    .equals(normalizedValue)) {

                return true;
            }
        }

        return false;
    }

    // =========================================================
    // UNIQUE
    // =========================================================

    private List<String> unique(
            Collection<String> values) {

        return new ArrayList<>(
                new LinkedHashSet<>(values)
        );
    }

    // =========================================================
    // LIMIT
    // =========================================================

    private List<String> limit(
            List<String> values,
            int maximum) {

        if (values.size() <= maximum) {
            return values;
        }

        return values.subList(
                0,
                maximum
        );
    }

    // =========================================================
    // PERCENTAGE
    // =========================================================

    private double calculatePercentage(
            int matched,
            int total) {

        if (total <= 0) {
            return 50.0;
        }

        return clamp(
                matched * 100.0 / total,
                0,
                100
        );
    }

    // =========================================================
    // PHRASE MATCH
    // =========================================================

    private boolean containsPhrase(
            String text,
            String phrase) {

        if (text == null
                || phrase == null
                || phrase.isBlank()) {

            return false;
        }

        String normalizedText =
                normalize(text);

        String normalizedPhrase =
                normalize(phrase);

        if (normalizedPhrase.contains("+")
                || normalizedPhrase.contains("#")
                || normalizedPhrase.contains("/")
                || normalizedPhrase.contains(".")) {

            return normalizedText.contains(
                    normalizedPhrase
            );
        }

        Pattern pattern =
                Pattern.compile(
                        "(?i)(?<![a-z0-9])"
                                + Pattern.quote(
                                normalizedPhrase
                        )
                                + "(?![a-z0-9])"
                );

        return pattern
                .matcher(normalizedText)
                .find();
    }

    // =========================================================
    // NORMALIZE
    // =========================================================

    private String normalize(
            String text) {

        if (text == null) {
            return "";
        }

        return text
                .toLowerCase(Locale.ROOT)
                .replace(
                        '\u00A0',
                        ' '
                )
                .replaceAll(
                        "\\s+",
                        " "
                )
                .trim();
    }

    // =========================================================
    // CLAMP
    // =========================================================

    private double clamp(
            double value,
            double minimum,
            double maximum) {

        return Math.max(
                minimum,
                Math.min(
                        maximum,
                        value
                )
        );
    }

    // =========================================================
    // ROLE PROFILE
    // =========================================================

    private static class RoleProfile {

        private final Set<String> coreSkills;
        private final Set<String> supportingSkills;

        private RoleProfile(
                Set<String> coreSkills,
                Set<String> supportingSkills) {

            this.coreSkills =
                    coreSkills;

            this.supportingSkills =
                    supportingSkills;
        }
    }
}