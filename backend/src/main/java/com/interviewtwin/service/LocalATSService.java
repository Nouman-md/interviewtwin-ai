package com.interviewtwin.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class LocalATSService {

    // =========================================================
    // SECTION ALIASES
    // =========================================================

    private static final Map<String, List<String>> SECTION_ALIASES =
            createSectionAliases();

    private static Map<String, List<String>> createSectionAliases() {

        Map<String, List<String>> sections =
                new LinkedHashMap<>();

        sections.put("summary", Arrays.asList(
                "summary",
                "professional summary",
                "profile",
                "professional profile",
                "career summary",
                "objective",
                "career objective",
                "about me",
                "about"
        ));

        sections.put("skills", Arrays.asList(
                "skills",
                "technical skills",
                "technical skill",
                "core skills",
                "key skills",
                "skills and technologies",
                "skills & technologies",
                "technical expertise",
                "technologies",
                "technical competencies",
                "core competencies",
                "technical proficiency"
        ));

        sections.put("experience", Arrays.asList(
                "experience",
                "work experience",
                "professional experience",
                "employment",
                "employment history",
                "work history",
                "professional history",
                "internship",
                "internships",
                "internship experience",
                "internship experiences",
                "work experience and internships",
                "work experience & internships",
                "experience and internships",
                "experience & internships",
                "professional experience and internships",
                "professional experience & internships"
        ));

        sections.put("education", Arrays.asList(
                "education",
                "academic background",
                "academic qualifications",
                "educational qualifications",
                "academic qualification",
                "educational background"
        ));

        sections.put("projects", Arrays.asList(
                "projects",
                "project",
                "academic projects",
                "personal projects",
                "technical projects",
                "project experience",
                "academic project",
                "technical project",
                "major projects",
                "key projects"
        ));

        sections.put("certifications", Arrays.asList(
                "certifications",
                "certification",
                "certificates",
                "professional certifications",
                "professional certification",
                "certification and courses",
                "certifications and courses",
                "certificate and courses",
                "certificates and courses",
                "courses and certificates",
                "course and certificates",
                "courses & certificates",
                "course & certificates",
                "courses and certifications",
                "course and certifications",
                "courses & certifications",
                "course & certifications",
                "training and certifications",
                "training & certifications",
                "licenses and certifications",
                "licenses & certifications"
        ));

        sections.put("achievements", Arrays.asList(
                "achievements",
                "achievement",
                "accomplishments",
                "accomplishment",
                "awards",
                "award",
                "honors",
                "honours"
        ));

        sections.put("coursework", Arrays.asList(
                "relevant coursework",
                "coursework",
                "relevant courses",
                "academic coursework",
                "relevant academic coursework"
        ));

        return sections;
    }

    // =========================================================
    // TECHNICAL SKILLS
    // =========================================================

    private static final List<String> TECHNICAL_SKILLS =
            Collections.unmodifiableList(Arrays.asList(

                    "java",
                    "python",
                    "javascript",
                    "typescript",
                    "c",
                    "c++",
                    "c#",
                    "go",
                    "kotlin",
                    "swift",
                    "php",
                    "ruby",

                    "html",
                    "html5",
                    "css",
                    "css3",
                    "react",
                    "react.js",
                    "angular",
                    "vue",
                    "next.js",

                    "node.js",
                    "nodejs",
                    "express",
                    "express.js",
                    "spring",
                    "spring boot",
                    "hibernate",

                    "rest",
                    "rest api",
                    "restful api",
                    "microservices",

                    "sql",
                    "mysql",
                    "postgresql",
                    "mongodb",
                    "mongoose",
                    "oracle",
                    "redis",
                    "sqlite",

                    "git",
                    "github",
                    "gitlab",
                    "bitbucket",
                    "vscode",
                    "vs code",
                    "npm",
                    "postman",

                    "aws",
                    "azure",
                    "google cloud",
                    "gcp",
                    "docker",
                    "kubernetes",
                    "jenkins",

                    "data structures",
                    "algorithms",
                    "data structures and algorithms",
                    "dsa",
                    "object oriented programming",
                    "oop",
                    "operating systems",
                    "computer networks",
                    "dbms",
                    "database management",
                    "database management systems",

                    "arrays",
                    "linked lists",
                    "linked list",
                    "stacks",
                    "queues",
                    "graphs",
                    "sorting",
                    "hashing",
                    "binary trees",
                    "binary tree",

                    "artificial intelligence",
                    "machine learning",
                    "deep learning",
                    "natural language processing",
                    "computer vision",
                    "tensorflow",
                    "pytorch",
                    "scikit-learn",

                    "excel",
                    "power bi",
                    "tableau",

                    "junit",
                    "selenium",
                    "unit testing",
                    "integration testing",

                    "cloudinary",
                    "render",
                    "mongodb atlas"
            ));

    // =========================================================
    // PROFESSIONAL TERMS
    // =========================================================

    private static final List<String> PROFESSIONAL_TERMS =
            Collections.unmodifiableList(Arrays.asList(

                    "software engineer",
                    "software developer",
                    "web developer",
                    "backend developer",
                    "frontend developer",
                    "full stack developer",
                    "full-stack developer",
                    "application developer",
                    "developer",
                    "engineer",
                    "analyst",
                    "software development",
                    "debugging",
                    "deployment",
                    "testing",
                    "automation",
                    "optimization",
                    "problem solving",
                    "communication",
                    "leadership",
                    "teamwork",
                    "collaboration",
                    "internship",
                    "intern"
            ));

    // =========================================================
    // ACTION WORDS
    // =========================================================

    private static final List<String> ACTION_WORDS =
            Collections.unmodifiableList(Arrays.asList(

                    "developed",
                    "built",
                    "implemented",
                    "designed",
                    "created",
                    "engineered",
                    "integrated",
                    "deployed",
                    "tested",
                    "optimized",
                    "automated",
                    "maintained",
                    "configured",
                    "managed",
                    "contributed",
                    "used",
                    "utilized",

                    "developing",
                    "building",
                    "implementing",
                    "designing",
                    "creating",
                    "integrating",
                    "deploying",
                    "testing",
                    "optimizing",
                    "automating",
                    "managing"
            ));

    private static final List<String> RESULT_WORDS =
            Arrays.asList(
                    "%",
                    "percent",
                    "reduced",
                    "increased",
                    "improved",
                    "saved",
                    "faster",
                    "latency",
                    "users",
                    "requests",
                    "records",
                    "transactions",
                    "accuracy",
                    "score",
                    "performance",
                    "time"
            );

    // =========================================================
    // MAIN ANALYSIS
    // =========================================================

    public ATSAnalysisResult analyze(
            String resumeContent,
            String jobDescription) {

        if (resumeContent == null
                || resumeContent.isBlank()) {

            throw new IllegalArgumentException(
                    "Resume content cannot be empty."
            );
        }

        String resume =
                normalizeText(resumeContent);

        String job =
                jobDescription == null
                        ? ""
                        : normalizeText(jobDescription);

        Set<String> sections =
                detectSections(resume);

        boolean email =
                containsEmail(resume);

        boolean phone =
                containsPhone(resume);

        boolean linkedin =
                containsLinkedIn(resume);

        boolean github =
                containsGitHub(resume);

        List<String> resumeKeywords =
                extractKeywords(resume);

        List<String> jobKeywords =
                extractKeywords(job);

        List<String> foundKeywords =
                findMatchingKeywords(
                        jobKeywords,
                        resumeKeywords
                );

        List<String> missingKeywords =
                findMissingKeywords(
                        jobKeywords,
                        resumeKeywords
                );

        Map<String, Integer> skillEvidence =
                calculateSkillEvidence(
                        resume,
                        resumeKeywords
                );

        int demonstratedSkills =
                countDemonstratedSkills(
                        skillEvidence
                );

        int sectionScore =
                calculateSectionScore(
                        sections
                );

        int contactScore =
                calculateContactScore(
                        email,
                        phone,
                        linkedin,
                        github
                );

        int formattingScore =
                calculateFormattingScore(
                        resume,
                        sections
                );

        int readabilityScore =
                calculateReadabilityScore(
                        resume
                );

        int evidenceScore =
                calculateEvidenceScore(
                        resume,
                        sections,
                        skillEvidence
                );

        int contentScore =
                calculateContentScore(
                        resume,
                        sections,
                        resumeKeywords,
                        skillEvidence,
                        demonstratedSkills
                );

        int keywordScore;

        int atsScore;

        if (job.isBlank()) {

            keywordScore =
                    calculateGeneralKeywordScore(
                            resumeKeywords,
                            skillEvidence,
                            sections
                    );

            atsScore =
                    calculateGeneralATSScore(
                            keywordScore,
                            sectionScore,
                            contactScore,
                            formattingScore,
                            readabilityScore,
                            contentScore,
                            evidenceScore
                    );

        } else {

            keywordScore =
                    calculateJobKeywordScore(
                            jobKeywords,
                            foundKeywords,
                            skillEvidence
                    );

            atsScore =
                    calculateJobATSScore(
                            keywordScore,
                            sectionScore,
                            contactScore,
                            formattingScore,
                            readabilityScore,
                            contentScore,
                            evidenceScore
                    );
        }

        List<String> suggestions =
                generateSuggestions(
                        resume,
                        sections,
                        email,
                        phone,
                        linkedin,
                        github,
                        missingKeywords,
                        skillEvidence,
                        keywordScore,
                        formattingScore,
                        contentScore,
                        evidenceScore
                );

        ATSAnalysisResult result =
                new ATSAnalysisResult();

        result.setAtsScore(atsScore);

        result.setKeywordScore(
                keywordScore
        );

        result.setFormattingScore(
                formattingScore
        );

        result.setContentScore(
                contentScore
        );

        if (job.isBlank()) {

            result.setFoundKeywords(
                    filterTechnicalKeywords(
                            resumeKeywords
                    )
            );

        } else {

            result.setFoundKeywords(
                    foundKeywords
            );
        }

        result.setMissingKeywords(
                missingKeywords
        );

        result.setImprovementSuggestions(
                suggestions
        );

        result.setGrammarIssues(
                detectBasicIssues(resume)
        );

        result.setSectionAnalysis(
                createSectionAnalysis(sections)
        );

        return result;
    }

    // =========================================================
    // NORMALIZE TEXT
    // =========================================================

    private String normalizeText(
            String text) {

        return text
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .replace("\u00A0", " ")
                .replaceAll("[ \\t]+", " ")
                .replaceAll("\n{3,}", "\n\n")
                .trim();
    }

    // =========================================================
    // ROBUST SECTION DETECTION
    // =========================================================

    private Set<String> detectSections(
            String resume) {

        Set<String> found =
                new LinkedHashSet<>();

        String[] lines =
                resume.split("\\n");

        for (String line : lines) {

            String section =
                    detectSectionFromLine(line);

            if (section != null) {
                found.add(section);
            }
        }

        return found;
    }

    // =========================================================
    // DETECT SECTION FROM A LINE
    // =========================================================

    private String detectSectionFromLine(
            String line) {

        if (line == null
                || line.isBlank()) {

            return null;
        }

        String cleaned =
                cleanHeading(line);

        if (cleaned.isBlank()) {
            return null;
        }

        // -----------------------------------------------------
        // FIRST: EXACT MATCH
        // -----------------------------------------------------

        String compact =
                compactHeading(cleaned);

        String exact =
                findSectionByCompactHeading(
                        compact
                );

        if (exact != null) {
            return exact;
        }

        // -----------------------------------------------------
        // SECOND: COMBINED HEADING
        // -----------------------------------------------------

        String lower =
                cleaned
                        .toLowerCase()
                        .replace("&", " and ")
                        .replace("|", " ")
                        .replace("/", " ")
                        .replace("-", " ")
                        .replaceAll(
                                "\\s+",
                                " "
                        )
                        .trim();

        /*
         * Examples:
         *
         * EXPERIENCE & INTERNSHIPS
         * WORK EXPERIENCE / INTERNSHIP
         * PROFESSIONAL EXPERIENCE AND INTERNSHIPS
         */

        if (containsHeadingWord(
                lower,
                "experience"
        )) {

            if (
                    containsHeadingWord(
                            lower,
                            "internship"
                    )
                            || containsHeadingWord(
                            lower,
                            "internships"
                    )
            ) {

                return "experience";
            }

            if (
                    containsHeadingWord(
                            lower,
                            "work"
                    )
                            || containsHeadingWord(
                            lower,
                            "professional"
                    )
                            || lower.equals("experience")
            ) {

                return "experience";
            }
        }

        if (
                containsHeadingWord(
                        lower,
                        "employment"
                )
                        || containsHeadingWord(
                        lower,
                        "work history"
                )
                        || containsHeadingWord(
                        lower,
                        "professional history"
                )
        ) {

            return "experience";
        }

        // -----------------------------------------------------
        // SKILLS
        // -----------------------------------------------------

        if (
                containsHeadingWord(
                        lower,
                        "technical skills"
                )
                        || containsHeadingWord(
                        lower,
                        "technical expertise"
                )
                        || containsHeadingWord(
                        lower,
                        "core competencies"
                )
        ) {

            return "skills";
        }

        // -----------------------------------------------------
        // PROJECTS
        // -----------------------------------------------------

        if (
                containsHeadingWord(
                        lower,
                        "projects"
                )
                        || containsHeadingWord(
                        lower,
                        "project experience"
                )
        ) {

            return "projects";
        }

        // -----------------------------------------------------
        // EDUCATION
        // -----------------------------------------------------

        if (
                containsHeadingWord(
                        lower,
                        "education"
                )
                        || containsHeadingWord(
                        lower,
                        "academic qualifications"
                )
                        || containsHeadingWord(
                        lower,
                        "educational qualifications"
                )
        ) {

            return "education";
        }

        // -----------------------------------------------------
        // CERTIFICATIONS
        // -----------------------------------------------------

        // Certification headings are matched through the exact
        // alias list above. This supports headings such as:
        // COURSES AND CERTIFICATES
        // COURSES & CERTIFICATES
        // CERTIFICATIONS
        // LICENSES & CERTIFICATIONS
        //
        // Do not use a broad containsHeadingWord("certificates")
        // check here because normal resume content can contain
        // the word "certificate".
        if ("certifications".equals(exact)) {

            return "certifications";
        }

        // -----------------------------------------------------
        // ACHIEVEMENTS
        // -----------------------------------------------------
        //
        // Achievements must be an actual section heading.
        // Do NOT classify ordinary resume content containing
        // words such as "award", "winner", or "achievement"
        // as an Achievements section.
        //
        // The exact alias check at the beginning of this method
        // already recognizes: ACHIEVEMENTS, AWARDS, HONORS,
        // AWARDS & ACHIEVEMENTS, etc.

        // -----------------------------------------------------
        // COURSEWORK
        // -----------------------------------------------------

        if (
                containsHeadingWord(
                        lower,
                        "coursework"
                )
                        || containsHeadingWord(
                        lower,
                        "relevant courses"
                )
        ) {

            return "coursework";
        }

        // -----------------------------------------------------
        // SUMMARY
        // -----------------------------------------------------

        if (
                containsHeadingWord(
                        lower,
                        "professional summary"
                )
                        || containsHeadingWord(
                        lower,
                        "career summary"
                )
                        || lower.equals("summary")
                || lower.equals("profile")
                || lower.equals("objective")
        ) {

            return "summary";
        }

        return null;
    }

    // =========================================================
    // HEADING WORD CHECK
    // =========================================================

    private boolean containsHeadingWord(
            String text,
            String value) {

        if (text == null
                || value == null) {

            return false;
        }

        String escaped =
                Pattern.quote(
                        value.toLowerCase()
                );

        return Pattern
                .compile(
                        "(^|\\s)"
                                + escaped
                                + "(\\s|$|:)",
                        Pattern.CASE_INSENSITIVE
                )
                .matcher(text)
                .find();
    }

    // =========================================================
    // CLEAN HEADING
    // =========================================================

    private String cleanHeading(
            String line) {

        if (line == null) {
            return "";
        }

        String value =
                line.trim();

        value =
                value.replaceAll(
                        "^[•●▪◦\\-–—]+",
                        ""
                ).trim();

        value =
                value.replaceAll(
                        "[:|]+$",
                        ""
                ).trim();

        return value;
    }

    // =========================================================
    // COMPACT HEADING
    // =========================================================

    private String compactHeading(
            String value) {

        if (value == null) {
            return "";
        }

        return value
                .toLowerCase()
                .replaceAll(
                        "[^a-z0-9]+",
                        ""
                );
    }

    // =========================================================
    // FIND EXACT SECTION
    // =========================================================

    private String findSectionByCompactHeading(
            String compact) {

        if (compact == null
                || compact.isBlank()) {

            return null;
        }

        for (
                Map.Entry<String, List<String>> entry
                        : SECTION_ALIASES.entrySet()
        ) {

            for (String alias :
                    entry.getValue()) {

                if (
                        compact.equals(
                                compactHeading(alias)
                        )
                ) {

                    return entry.getKey();
                }
            }
        }

        return null;
    }

    // =========================================================
    // CONTACT
    // =========================================================

    private boolean containsEmail(
            String text) {

        return Pattern
                .compile(
                        "[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}",
                        Pattern.CASE_INSENSITIVE
                )
                .matcher(text)
                .find();
    }

    private boolean containsPhone(
            String text) {

        return Pattern
                .compile(
                        "(\\+?\\d[\\d\\s().-]{8,}\\d)"
                )
                .matcher(text)
                .find();
    }

    private boolean containsLinkedIn(
            String text) {

        return text
                .toLowerCase()
                .contains("linkedin.com");
    }

    private boolean containsGitHub(
            String text) {

        return text
                .toLowerCase()
                .contains("github.com");
    }

    // =========================================================
    // SECTION SCORE
    // =========================================================

    private int calculateSectionScore(
            Set<String> sections) {

        int score = 0;

        if (sections.contains("summary")) {
            score += 12;
        }

        if (sections.contains("skills")) {
            score += 18;
        }

        if (sections.contains("experience")) {
            score += 22;
        }

        if (sections.contains("education")) {
            score += 14;
        }

        if (sections.contains("projects")) {
            score += 18;
        }

        if (sections.contains("certifications")) {
            score += 8;
        }

        if (sections.contains("achievements")) {
            score += 4;
        }

        if (sections.contains("coursework")) {
            score += 4;
        }

        return clamp(score);
    }

    // =========================================================
    // CONTACT SCORE
    // =========================================================

    private int calculateContactScore(
            boolean email,
            boolean phone,
            boolean linkedin,
            boolean github) {

        int score = 0;

        if (email) {
            score += 35;
        }

        if (phone) {
            score += 35;
        }

        if (linkedin) {
            score += 15;
        }

        if (github) {
            score += 15;
        }

        return clamp(score);
    }

    // =========================================================
    // FORMATTING SCORE
    // =========================================================

    private int calculateFormattingScore(
            String resume,
            Set<String> sections) {

        int score = 100;

        String[] lines =
                resume.split("\\n");

        int veryLongLines = 0;
        int bulletLines = 0;
        int blankLines = 0;
        int headingLines = 0;
        int separatorRiskLines = 0;

        for (String line : lines) {

            String trimmed =
                    line.trim();

            if (trimmed.isEmpty()) {
                blankLines++;
            }

            if (trimmed.length() > 180) {
                veryLongLines++;
            }

            if (isBulletLine(trimmed)) {
                bulletLines++;
            }

            if (
                    detectSectionFromLine(
                            trimmed
                    ) != null
            ) {

                headingLines++;
            }

            if (
                    trimmed.contains("\t")
                            || trimmed.matches(
                            ".*[|]{2,}.*"
                    )
                            || trimmed.matches(
                            ".*[_]{5,}.*"
                    )
            ) {

                separatorRiskLines++;
            }
        }

        if (veryLongLines >= 8) {

            score -= 20;

        } else if (veryLongLines >= 4) {

            score -= 10;

        } else if (veryLongLines >= 2) {

            score -= 5;
        }

        if (sections.size() <= 2) {

            score -= 18;

        } else if (sections.size() == 3) {

            score -= 10;

        } else if (sections.size() == 4) {

            score -= 5;

        } else if (sections.size() == 5) {

            score -= 2;
        }

        if (
                resume.length() > 1500
                        && bulletLines == 0
        ) {

            score -= 8;

        } else if (
                resume.length() > 1500
                        && bulletLines < 3
        ) {

            score -= 3;
        }

        if (headingLines < 3) {

            score -= 5;

        } else if (headingLines == 3) {

            score -= 2;
        }

        if (
                lines.length > 0
                        && blankLines
                        > lines.length * 0.45
        ) {

            score -= 5;

        } else if (
                lines.length > 0
                        && blankLines
                        > lines.length * 0.35
        ) {

            score -= 2;
        }

        int dateSignals =
                countDateSignals(resume);

        if (dateSignals == 0) {

            score -= 5;

        } else if (dateSignals == 1) {

            score -= 2;
        }

        if (!hasContactBlock(resume)) {
            score -= 3;
        }

        if (separatorRiskLines >= 3) {

            score -= 8;

        } else if (separatorRiskLines >= 1) {

            score -= 4;
        }

        int positiveSignals = 0;

        if (sections.size() >= 6) {
            positiveSignals++;
        }

        if (headingLines >= 5) {
            positiveSignals++;
        }

        if (bulletLines >= 4) {
            positiveSignals++;
        }

        if (dateSignals >= 2) {
            positiveSignals++;
        }

        if (hasContactBlock(resume)) {
            positiveSignals++;
        }

        if (veryLongLines == 0) {
            positiveSignals++;
        }

        if (separatorRiskLines == 0) {
            positiveSignals++;
        }

        if (positiveSignals < 7) {
            score = Math.min(score, 97);
        }

        if (positiveSignals < 5) {
            score = Math.min(score, 93);
        }

        return clamp(score);
    }

    // =========================================================
    // DATE SIGNALS
    // =========================================================

    private int countDateSignals(
            String resume) {

        if (resume == null
                || resume.isBlank()) {

            return 0;
        }

        int count = 0;

        String[] patterns = {

                "\\b(?:19|20)\\d{2}\\s*(?:-|–|—|to)\\s*(?:19|20)\\d{2}\\b",

                "\\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\\s+(?:19|20)\\d{2}\\b",

                "\\b(?:19|20)\\d{2}\\b",

                "\\b(?:present|current)\\b"
        };

        for (String pattern :
                patterns) {

            if (
                    Pattern.compile(
                            pattern,
                            Pattern.CASE_INSENSITIVE
                    )
                    .matcher(resume)
                    .find()
            ) {

                count++;
            }
        }

        return Math.min(count, 4);
    }

    // =========================================================
    // CONTACT BLOCK
    // =========================================================

    private boolean hasContactBlock(
            String resume) {

        String[] lines =
                resume.split("\\n");

        int limit =
                Math.min(
                        lines.length,
                        8
                );

        for (int i = 0; i < limit; i++) {

            String line =
                    lines[i];

            if (
                    containsEmail(line)
                            || containsPhone(line)
                            || containsLinkedIn(line)
                            || containsGitHub(line)
            ) {

                return true;
            }
        }

        return false;
    }

    // =========================================================
    // BULLET
    // =========================================================

    private boolean isBulletLine(
            String line) {

        if (
                line == null
                        || line.isBlank()
        ) {

            return false;
        }

        return line.startsWith("•")
                || line.startsWith("●")
                || line.startsWith("▪")
                || line.startsWith("◦")
                || line.startsWith("-")
                || line.startsWith("*")
                || line.startsWith("–")
                || line.startsWith("—");
    }

    // =========================================================
    // READABILITY
    // =========================================================

    private int calculateReadabilityScore(
            String resume) {

        int score = 100;

        String[] words =
                resume.split("\\s+");

        if (words.length < 100) {
            score -= 15;
        }

        if (words.length > 3000) {
            score -= 15;
        }

        int suspiciousTokens = 0;

        for (String word :
                words) {

            if (word.length() > 40) {
                suspiciousTokens++;
            }
        }

        if (suspiciousTokens >= 5) {

            score -= 15;

        } else if (suspiciousTokens >= 2) {

            score -= 7;
        }

        int sentenceCount =
                resume.split(
                        "[.!?]+|\\n"
                ).length;

        if (
                sentenceCount < 5
                        && words.length > 150
        ) {

            score -= 5;
        }

        return clamp(score);
    }

    // =========================================================
    // CONTENT SCORE
    // =========================================================

    private int calculateContentScore(
            String resume,
            Set<String> sections,
            List<String> keywords,
            Map<String, Integer> skillEvidence,
            int demonstratedSkills) {

        int score = 0;

        if (sections.contains("summary")) {

            String summary =
                    extractSectionContent(
                            resume,
                            "summary"
                    );

            if (summary.length() >= 100) {

                score += 12;

            } else if (summary.length() >= 50) {

                score += 8;

            } else if (summary.length() >= 25) {

                score += 4;
            }
        }

        if (sections.contains("skills")) {

            if (keywords.size() >= 15) {

                score += 12;

            } else if (keywords.size() >= 8) {

                score += 9;

            } else if (keywords.size() >= 4) {

                score += 6;

            } else {

                score += 2;
            }
        }

        if (sections.contains("projects")) {

            String projects =
                    extractSectionContent(
                            resume,
                            "projects"
                    );

            int actions =
                    countActionWords(
                            projects
                    );

            int quantified =
                    countResultSignals(
                            projects
                    );

            if (actions >= 6) {

                score += 15;

            } else if (actions >= 3) {

                score += 11;

            } else if (actions >= 1) {

                score += 7;

            } else {

                score += 3;
            }

            if (quantified >= 2) {

                score += 5;

            } else if (quantified == 1) {

                score += 2;
            }
        }

        if (sections.contains("experience")) {

            String experience =
                    extractSectionContent(
                            resume,
                            "experience"
                    );

            int actions =
                    countActionWords(
                            experience
                    );

            int quantified =
                    countResultSignals(
                            experience
                    );

            if (actions >= 6) {

                score += 16;

            } else if (actions >= 3) {

                score += 12;

            } else if (actions >= 1) {

                score += 7;

            } else {

                score += 3;
            }

            if (quantified >= 2) {

                score += 5;

            } else if (quantified == 1) {

                score += 2;
            }
        }

        if (sections.contains("education")) {
            score += 8;
        }

        if (sections.contains("certifications")) {
            score += 6;
        }

        if (sections.contains("coursework")) {
            score += 3;
        }

        if (demonstratedSkills >= 10) {

            score += 12;

        } else if (demonstratedSkills >= 6) {

            score += 9;

        } else if (demonstratedSkills >= 3) {

            score += 5;

        } else if (demonstratedSkills >= 1) {

            score += 2;
        }

        return Math.min(
                score,
                95
        );
    }

    // =========================================================
    // EVIDENCE SCORE
    // =========================================================

    private int calculateEvidenceScore(
            String resume,
            Set<String> sections,
            Map<String, Integer> skillEvidence) {

        int score = 0;

        if (sections.contains("projects")) {
            score += 25;
        }

        if (sections.contains("experience")) {
            score += 30;
        }

        if (sections.contains("education")) {
            score += 5;
        }

        int actions =
                countActionWords(resume);

        if (actions >= 10) {

            score += 20;

        } else if (actions >= 6) {

            score += 15;

        } else if (actions >= 3) {

            score += 9;

        } else if (actions >= 1) {

            score += 4;
        }

        int quantified =
                countResultSignals(resume);

        if (quantified >= 4) {

            score += 15;

        } else if (quantified >= 2) {

            score += 10;

        } else if (quantified == 1) {

            score += 5;
        }

        int demonstrated =
                countDemonstratedSkills(
                        skillEvidence
                );

        if (demonstrated >= 10) {

            score += 20;

        } else if (demonstrated >= 6) {

            score += 15;

        } else if (demonstrated >= 3) {

            score += 9;

        } else if (demonstrated >= 1) {

            score += 4;
        }

        return clamp(
                Math.min(
                        score,
                        100
                )
        );
    }

    // =========================================================
    // ACTION WORD COUNT
    // =========================================================

    private int countActionWords(
            String text) {

        if (
                text == null
                        || text.isBlank()
        ) {

            return 0;
        }

        String lower =
                text.toLowerCase();

        int count = 0;

        for (String action :
                ACTION_WORDS) {

            if (
                    containsWholeTerm(
                            lower,
                            action
                    )
            ) {

                count++;
            }
        }

        return count;
    }

    // =========================================================
    // RESULT SIGNAL COUNT
    // =========================================================

    private int countResultSignals(
            String text) {

        if (
                text == null
                        || text.isBlank()
        ) {

            return 0;
        }

        String lower =
                text.toLowerCase();

        int count = 0;

        for (String word :
                RESULT_WORDS) {

            if (
                    containsWholeTerm(
                            lower,
                            word
                    )
            ) {

                count++;
            }
        }

        if (
                Pattern.compile(
                        "\\b\\d+(?:\\.\\d+)?%"
                )
                .matcher(text)
                .find()
        ) {

            count++;
        }

        if (
                Pattern.compile(
                        "\\b\\d+(?:\\.\\d+)?\\s*(?:ms|sec|seconds|minutes|hours|users|records)\\b",
                        Pattern.CASE_INSENSITIVE
                )
                .matcher(text)
                .find()
        ) {

            count++;
        }

        return Math.min(
                count,
                8
        );
    }

    // =========================================================
    // ROBUST SECTION CONTENT EXTRACTION
    // =========================================================

    private String extractSectionContent(
            String resume,
            String targetSection) {

        String[] lines =
                resume.split("\\n");

        boolean inside = false;

        StringBuilder content =
                new StringBuilder();

        for (String line :
                lines) {

            String currentSection =
                    detectSectionFromLine(line);

            if (
                    targetSection.equals(
                            currentSection
                    )
            ) {

                inside = true;
                continue;
            }

            /*
             * Once another recognized section begins,
             * the current section ends.
             */
            if (
                    inside
                            && currentSection != null
                            && !targetSection.equals(
                            currentSection
                    )
            ) {

                break;
            }

            if (inside) {

                content
                        .append(line)
                        .append('\n');
            }
        }

        return content
                .toString()
                .trim();
    }

    // =========================================================
    // SKILL EVIDENCE
    // =========================================================

    private Map<String, Integer> calculateSkillEvidence(
            String resume,
            List<String> keywords) {

        Map<String, Integer> result =
                new LinkedHashMap<>();

        String lower =
                resume.toLowerCase();

        String projectContent =
                extractSectionContent(
                        resume,
                        "projects"
                ).toLowerCase();

        String experienceContent =
                extractSectionContent(
                        resume,
                        "experience"
                ).toLowerCase();

        String skillsContent =
                extractSectionContent(
                        resume,
                        "skills"
                ).toLowerCase();

        for (String skill :
                keywords) {

            int score = 0;

            if (
                    containsSkillTerm(
                            lower,
                            skill
                    )
            ) {

                score += 15;
            }

            if (
                    containsSkillTerm(
                            skillsContent,
                            skill
                    )
            ) {

                score += 10;
            }

            if (
                    hasSkillNearActionWord(
                            lower,
                            skill
                    )
            ) {

                score += 25;
            }

            if (
                    containsSkillTerm(
                            projectContent,
                            skill
                    )
            ) {

                score += 25;
            }

            if (
                    containsSkillTerm(
                            experienceContent,
                            skill
                    )
            ) {

                score += 25;
            }

            int occurrences =
                    countOccurrences(
                            lower,
                            skill
                    );

            if (occurrences >= 3) {
                score += 5;
            }

            if (occurrences >= 6) {
                score += 2;
            }

            result.put(
                    skill,
                    Math.min(
                            score,
                            100
                    )
            );
        }

        return result;
    }

    // =========================================================
    // OCCURRENCES
    // =========================================================

    private int countOccurrences(
            String text,
            String term) {

        if (
                text == null
                        || term == null
                        || term.isBlank()
        ) {

            return 0;
        }

        int count = 0;
        int from = 0;

        String lowerTerm =
                term.toLowerCase();

        while (from < text.length()) {

            int index =
                    text.indexOf(
                            lowerTerm,
                            from
                    );

            if (index < 0) {
                break;
            }

            count++;

            from =
                    index
                            + Math.max(
                            1,
                            term.length()
                    );
        }

        return count;
    }

    // =========================================================
    // SKILL NEAR ACTION
    // =========================================================

    private boolean hasSkillNearActionWord(
            String text,
            String skill) {

        String[] sentences =
                text.split(
                        "[.!?\\n]+|;"
                );

        for (String sentence :
                sentences) {

            if (
                    !containsSkillTerm(
                            sentence,
                            skill
                    )
            ) {

                continue;
            }

            for (String action :
                    ACTION_WORDS) {

                if (
                        containsWholeTerm(
                                sentence,
                                action
                        )
                ) {

                    return true;
                }
            }
        }

        return false;
    }

    // =========================================================
    // DEMONSTRATED SKILLS
    // =========================================================

    private int countDemonstratedSkills(
            Map<String, Integer> evidence) {

        int count = 0;

        for (Integer value :
                evidence.values()) {

            if (
                    value != null
                            && value >= 50
            ) {

                count++;
            }
        }

        return count;
    }

    // =========================================================
    // KEYWORD EXTRACTION
    // =========================================================

    private List<String> extractKeywords(
            String text) {

        if (
                text == null
                        || text.isBlank()
        ) {

            return new ArrayList<>();
        }

        String lower =
                text.toLowerCase();

        Set<String> result =
                new LinkedHashSet<>();

        for (String skill :
                TECHNICAL_SKILLS) {

            if (
                    containsSkillTerm(
                            lower,
                            skill
                    )
            ) {

                result.add(
                        normalizeSkill(
                                skill
                        )
                );
            }
        }

        for (String term :
                PROFESSIONAL_TERMS) {

            if (
                    containsSkillTerm(
                            lower,
                            term
                    )
            ) {

                result.add(
                        normalizeSkill(
                                term
                        )
                );
            }
        }

        return new ArrayList<>(
                result
        );
    }

    // =========================================================
    // MATCHING KEYWORDS
    // =========================================================

    private List<String> findMatchingKeywords(
            List<String> jobKeywords,
            List<String> resumeKeywords) {

        List<String> matched = new ArrayList<>();

        if (jobKeywords == null || resumeKeywords == null
                || jobKeywords.isEmpty() || resumeKeywords.isEmpty()) {
            return matched;
        }

        Set<String> resumeSet = new LinkedHashSet<>();

        for (String keyword : resumeKeywords) {
            if (keyword != null && !keyword.isBlank()) {
                resumeSet.add(normalizeSkill(keyword));
            }
        }

        for (String keyword : jobKeywords) {
            if (keyword == null || keyword.isBlank()) {
                continue;
            }

            String normalized = normalizeSkill(keyword);

            if (resumeSet.contains(normalized)) {
                matched.add(normalized);
            }
        }

        return matched;
    }

    // =========================================================
    // MISSING KEYWORDS
    // =========================================================

    private List<String> findMissingKeywords(
            List<String> jobKeywords,
            List<String> resumeKeywords) {

        List<String> missing = new ArrayList<>();

        if (jobKeywords == null || jobKeywords.isEmpty()) {
            return missing;
        }

        Set<String> resumeSet = new LinkedHashSet<>();

        if (resumeKeywords != null) {
            for (String keyword : resumeKeywords) {
                if (keyword != null && !keyword.isBlank()) {
                    resumeSet.add(normalizeSkill(keyword));
                }
            }
        }

        Set<String> alreadyAdded = new LinkedHashSet<>();

        for (String keyword : jobKeywords) {
            if (keyword == null || keyword.isBlank()) {
                continue;
            }

            String normalized = normalizeSkill(keyword);

            if (!resumeSet.contains(normalized) && alreadyAdded.add(normalized)) {
                missing.add(normalized);
            }
        }

        return missing;
    }

    // =========================================================
    // SKILL TERM
    // =========================================================

    private boolean containsSkillTerm(
            String text,
            String term) {

        if (
                text == null
                        || term == null
        ) {

            return false;
        }

        String normalized =
                term.toLowerCase().trim();

        if (
                normalized.contains(" ")
        ) {

            return text.contains(
                    normalized
            );
        }

        return Pattern
                .compile(
                        "(?<![a-zA-Z0-9+#])"
                                + Pattern.quote(
                                normalized
                        )
                                + "(?![a-zA-Z0-9+#])",
                        Pattern.CASE_INSENSITIVE
                )
                .matcher(text)
                .find();
    }

    // =========================================================
    // WHOLE TERM
    // =========================================================

    private boolean containsWholeTerm(
            String text,
            String term) {

        return containsSkillTerm(
                text,
                term
        );
    }

    // =========================================================
    // NORMALIZE SKILL
    // =========================================================

    private String normalizeSkill(
            String skill) {

        String value =
                skill.toLowerCase().trim();

        switch (value) {

            case "nodejs":
                return "node.js";

            case "express.js":
                return "express";

            case "react.js":
                return "react";

            case "html5":
                return "html";

            case "css3":
                return "css";

            case "data structures and algorithms":
                return "data structures & algorithms";

            case "dsa":
                return "data structures & algorithms";

            case "object oriented programming":
                return "oop";

            case "database management systems":
                return "database management";

            case "vs code":
                return "vscode";

            case "full-stack developer":
                return "full stack developer";

            default:
                return value;
        }
    }

    // =========================================================
    // TECHNICAL CHECK
    // =========================================================

    private boolean isTechnicalSkill(
            String keyword) {

        String normalized =
                normalizeSkill(keyword);

        for (String skill :
                TECHNICAL_SKILLS) {

            if (
                    normalizeSkill(skill)
                            .equals(normalized)
            ) {

                return true;
            }
        }

        return false;
    }

    // =========================================================
    // TECHNICAL KEYWORDS
    // =========================================================

    private List<String> filterTechnicalKeywords(
            List<String> keywords) {

        List<String> technical =
                new ArrayList<>();

        for (String keyword :
                keywords) {

            if (
                    isTechnicalSkill(
                            keyword
                    )
            ) {

                technical.add(
                        keyword
                );
            }
        }

        return technical;
    }

    // =========================================================
    // GENERAL KEYWORD SCORE
    // =========================================================

    private int calculateGeneralKeywordScore(
            List<String> keywords,
            Map<String, Integer> evidence,
            Set<String> sections) {

        if (keywords.isEmpty()) {
            return 25;
        }

        int technical = 0;
        int professional = 0;
        int demonstrated = 0;

        for (String keyword :
                keywords) {

            if (
                    isTechnicalSkill(
                            keyword
                    )
            ) {

                technical++;

                Integer value =
                        evidence.get(
                                keyword
                        );

                if (
                        value != null
                                && value >= 50
                ) {

                    demonstrated++;
                }

            } else {

                professional++;
            }
        }

        double coverage =
                Math.min(
                        1.0,
                        technical / 20.0
                );

        double evidenceRatio =
                technical == 0
                        ? 0.0
                        : demonstrated
                        / (double) technical;

        double professionalValue =
                Math.min(
                        5.0,
                        professional
                ) / 5.0;

        double score =
                32
                        + coverage * 43
                        + evidenceRatio * 20
                        + professionalValue * 5;

        boolean hasEvidenceSection =
                sections.contains("projects")
                        || sections.contains("experience");

        if (!hasEvidenceSection) {
            score -= 8;
        }

        if (
                technical >= 25
                        && evidenceRatio < 0.25
        ) {

            score -= 5;
        }

        return clamp(
                (int) Math.round(
                        Math.min(
                                score,
                                95
                        )
                )
        );
    }

    // =========================================================
    // JOB KEYWORD SCORE
    // =========================================================

    private int calculateJobKeywordScore(
            List<String> jobKeywords,
            List<String> foundKeywords,
            Map<String, Integer> evidence) {

        if (jobKeywords.isEmpty()) {
            return 50;
        }

        double weightedFound = 0.0;

        for (String keyword :
                foundKeywords) {

            Integer ev =
                    evidence.get(
                            keyword
                    );

            if (ev == null) {

                weightedFound += 0.70;

            } else if (ev >= 75) {

                weightedFound += 1.00;

            } else if (ev >= 50) {

                weightedFound += 0.90;

            } else if (ev >= 30) {

                weightedFound += 0.75;

            } else {

                weightedFound += 0.60;
            }
        }

        double coverage =
                weightedFound
                        / jobKeywords.size();

        int score =
                (int) Math.round(
                        25 + coverage * 75
                );

        return clamp(
                Math.min(
                        score,
                        98
                )
        );
    }

    // =========================================================
    // GENERAL ATS SCORE
    // =========================================================

    private int calculateGeneralATSScore(
            int keywordScore,
            int sectionScore,
            int contactScore,
            int formattingScore,
            int readabilityScore,
            int contentScore,
            int evidenceScore) {

        double score =
                keywordScore * 0.18
                        + sectionScore * 0.12
                        + contactScore * 0.08
                        + formattingScore * 0.14
                        + readabilityScore * 0.08
                        + contentScore * 0.25
                        + evidenceScore * 0.15;

        return clamp(
                (int) Math.round(score)
        );
    }

    // =========================================================
    // JOB ATS SCORE
    // =========================================================

    private int calculateJobATSScore(
            int keywordScore,
            int sectionScore,
            int contactScore,
            int formattingScore,
            int readabilityScore,
            int contentScore,
            int evidenceScore) {

        double score =
                keywordScore * 0.40
                        + sectionScore * 0.08
                        + contactScore * 0.05
                        + formattingScore * 0.10
                        + readabilityScore * 0.05
                        + contentScore * 0.17
                        + evidenceScore * 0.15;

        return clamp(
                (int) Math.round(score)
        );
    }

    // =========================================================
    // SUGGESTIONS
    // =========================================================

    private List<String> generateSuggestions(
            String resume,
            Set<String> sections,
            boolean email,
            boolean phone,
            boolean linkedin,
            boolean github,
            List<String> missingKeywords,
            Map<String, Integer> skillEvidence,
            int keywordScore,
            int formattingScore,
            int contentScore,
            int evidenceScore) {

        List<String> suggestions =
                new ArrayList<>();

        if (!email) {

            suggestions.add(
                    "Add a professional email address to the contact section."
            );
        }

        if (!phone) {

            suggestions.add(
                    "Add a professional phone number to the contact section."
            );
        }

        if (!sections.contains("skills")) {

            suggestions.add(
                    "Add a clearly labeled Technical Skills or Skills section."
            );
        }

        if (!sections.contains("summary")) {

            suggestions.add(
                    "Consider adding a concise professional summary targeted to your desired role."
            );
        }

        if (!sections.contains("education")) {

            suggestions.add(
                    "Add a clearly labeled Education section with your degree and institution."
            );
        }

        if (
                !sections.contains("projects")
                        && !sections.contains("experience")
        ) {

            suggestions.add(
                    "Add Projects or Experience containing concrete contributions."
            );
        }

        if (
                keywordScore < 70
                        && !missingKeywords.isEmpty()
        ) {

            int limit =
                    Math.min(
                            5,
                            missingKeywords.size()
                    );

            suggestions.add(
                    "Consider adding relevant missing keywords when they genuinely match your experience: "
                            + String.join(
                            ", ",
                            missingKeywords.subList(
                                    0,
                                    limit
                            )
                    )
                            + "."
            );
        }

        if (formattingScore < 75) {

            suggestions.add(
                    "Improve ATS readability by using standard headings, consistent bullets, and shorter text blocks."
            );
        }

        if (contentScore < 70) {

            suggestions.add(
                    "Strengthen content by adding specific accomplishments, technical contributions, and measurable results where possible."
            );
        }

        if (evidenceScore < 60) {

            suggestions.add(
                    "Show stronger evidence of your skills by describing what you built, implemented, tested, optimized, or deployed."
            );
        }

        List<String> weakSkills =
                findWeakEvidenceSkills(
                        skillEvidence
                );

        if (!weakSkills.isEmpty()) {

            int limit =
                    Math.min(
                            3,
                            weakSkills.size()
                    );

            suggestions.add(
                    "Some listed skills have limited project or experience evidence: "
                            + String.join(
                            ", ",
                            weakSkills.subList(
                                    0,
                                    limit
                            )
                    )
                            + "."
            );
        }

        if (!linkedin) {

            suggestions.add(
                    "Consider including a LinkedIn profile if it is relevant to your job applications."
            );
        }

        if (
                !github
                        && containsTechnicalSkills(
                        resume
                )
        ) {

            suggestions.add(
                    "Consider including GitHub if you have relevant public coding projects."
            );
        }

        if (suggestions.size() > 6) {

            return new ArrayList<>(
                    suggestions.subList(
                            0,
                            6
                    )
            );
        }

        if (suggestions.isEmpty()) {

            suggestions.add(
                    "Your resume shows strong ATS compatibility. Continue tailoring it to each target role rather than adding unnecessary keywords."
            );
        }

        return suggestions;
    }

    // =========================================================
    // WEAK EVIDENCE
    // =========================================================

    private List<String> findWeakEvidenceSkills(
            Map<String, Integer> evidence) {

        List<String> weak =
                new ArrayList<>();

        for (
                Map.Entry<String, Integer> entry
                        : evidence.entrySet()
        ) {

            if (
                    entry.getValue() != null
                            && entry.getValue() < 35
                            && isTechnicalSkill(
                            entry.getKey()
                    )
            ) {

                weak.add(
                        entry.getKey()
                );
            }
        }

        return weak;
    }

    // =========================================================
    // TECHNICAL SIGNAL
    // =========================================================

    private boolean containsTechnicalSkills(
            String resume) {

        String lower =
                resume.toLowerCase();

        for (String skill :
                TECHNICAL_SKILLS) {

            if (
                    containsSkillTerm(
                            lower,
                            skill
                    )
            ) {

                return true;
            }
        }

        return false;
    }

    // =========================================================
    // SECTION ANALYSIS
    // =========================================================

    private Map<String, String> createSectionAnalysis(
            Set<String> sections) {

        Map<String, String> result =
                new LinkedHashMap<>();

        String[] standardSections = {
                "summary",
                "skills",
                "experience",
                "education",
                "projects",
                "certifications",
                "achievements",
                "coursework"
        };

        for (String section :
                standardSections) {

            result.put(
                    section,
                    sections.contains(section)
                            ? "Section detected successfully."
                            : "Section not detected."
            );
        }

        return result;
    }

    // =========================================================
    // BASIC TEXT ISSUES
    // =========================================================

    private List<String> detectBasicIssues(
            String resume) {

        List<String> issues =
                new ArrayList<>();

        for (String line :
                resume.split("\\n")) {

            if (
                    line.trim().length() > 200
            ) {

                issues.add(
                        "A very long text line was detected. Consider using shorter bullet points."
                );

                break;
            }
        }

        return issues;
    }

    // =========================================================
    // CLAMP
    // =========================================================

    private int clamp(
            int value) {

        return Math.max(
                0,
                Math.min(
                        100,
                        value
                )
        );
    }

    // =========================================================
    // RESULT CLASS
    // =========================================================

    public static class ATSAnalysisResult {

        private int atsScore;
        private int keywordScore;
        private int formattingScore;
        private int contentScore;

        private List<String> missingKeywords =
                new ArrayList<>();

        private List<String> foundKeywords =
                new ArrayList<>();

        private List<String> improvementSuggestions =
                new ArrayList<>();

        private List<String> grammarIssues =
                new ArrayList<>();

        private Map<String, String> sectionAnalysis =
                new LinkedHashMap<>();

        public int getAtsScore() {
            return atsScore;
        }

        public void setAtsScore(
                int atsScore) {

            this.atsScore = atsScore;
        }

        public int getKeywordScore() {
            return keywordScore;
        }

        public void setKeywordScore(
                int keywordScore) {

            this.keywordScore =
                    keywordScore;
        }

        public int getFormattingScore() {
            return formattingScore;
        }

        public void setFormattingScore(
                int formattingScore) {

            this.formattingScore =
                    formattingScore;
        }

        public int getContentScore() {
            return contentScore;
        }

        public void setContentScore(
                int contentScore) {

            this.contentScore =
                    contentScore;
        }

        public List<String> getMissingKeywords() {
            return missingKeywords;
        }

        public void setMissingKeywords(
                List<String> value) {

            this.missingKeywords =
                    value != null
                            ? value
                            : new ArrayList<>();
        }

        public List<String> getFoundKeywords() {
            return foundKeywords;
        }

        public void setFoundKeywords(
                List<String> value) {

            this.foundKeywords =
                    value != null
                            ? value
                            : new ArrayList<>();
        }

        public List<String> getImprovementSuggestions() {
            return improvementSuggestions;
        }

        public void setImprovementSuggestions(
                List<String> value) {

            this.improvementSuggestions =
                    value != null
                            ? value
                            : new ArrayList<>();
        }

        public List<String> getGrammarIssues() {
            return grammarIssues;
        }

        public void setGrammarIssues(
                List<String> value) {

            this.grammarIssues =
                    value != null
                            ? value
                            : new ArrayList<>();
        }

        public Map<String, String> getSectionAnalysis() {
            return sectionAnalysis;
        }

        public void setSectionAnalysis(
                Map<String, String> value) {

            this.sectionAnalysis =
                    value != null
                            ? value
                            : new LinkedHashMap<>();
        }
    }
}