package com.interviewtwin.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.interviewtwin.dto.ATSReportDTO;
import com.interviewtwin.dto.JobMatchDTO;
import com.interviewtwin.dto.JobMatchRequestDTO;
import com.interviewtwin.entity.ATSReport;
import com.interviewtwin.entity.JobDescription;
import com.interviewtwin.entity.Resume;
import com.interviewtwin.entity.User;
import com.interviewtwin.repository.ATSReportRepository;
import com.interviewtwin.repository.JobDescriptionRepository;
import com.interviewtwin.repository.ResumeRepository;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ATSReportService {

    private static final int MAX_EXTRACTED_TEXT_LENGTH = 1_000_000;

    private final ATSReportRepository atsReportRepository;
    private final ResumeRepository resumeRepository;
    private final UserRepository userRepository;
    private final JobDescriptionRepository jobDescriptionRepository;

    /*
     * Gemini is intentionally kept.
     *
     * It can still be used by other AI features.
     * Basic ATS analysis does NOT depend on Gemini.
     */
    private final GeminiAIService geminiAIService;

    /*
     * Primary ATS engine.
     */
    private final LocalATSService localATSService;

    /*
     * Fast local Job Match engine.
     */
    private final JobMatchService jobMatchService;

    private final PerformanceService performanceService;
    private final ObjectMapper objectMapper;

    /*
     * Resume upload directory must match ResumeService.
     */
    @Value("${file.upload.directory}")
    private String uploadDirectory;

    // =========================================================
    // ATS ANALYSIS LOCKS
    // =========================================================

    private final Map<String, Object> analysisLocks =
            new ConcurrentHashMap<>();


    // =========================================================
    // RESUME ATS ANALYSIS
    // =========================================================

    public ATSReportDTO analyzeResume(
            Long userId,
            Long resumeId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        /*
         * IMPORTANT:
         * Resume ownership is checked at database level.
         */
        Resume resume =
                resumeRepository
                        .findByResumeIdAndUserId(
                                resumeId,
                                userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"));

        String lockKey =
                userId + ":" + resumeId;

        Object lock =
                analysisLocks.computeIfAbsent(
                        lockKey,
                        key -> new Object());

        try {

            synchronized (lock) {

                /*
                 * Check whether this user already has an ATS
                 * report for this resume.
                 */
                ATSReport existingReport =
                        atsReportRepository
                                .findByUserId(userId)
                                .stream()
                                .filter(report ->
                                        report.getResume() != null
                                                && report.getResume()
                                                .getResumeId()
                                                .equals(resumeId))
                                .findFirst()
                                .orElse(null);

                if (existingReport != null) {

                    return convertToDTO(
                            existingReport);
                }

                String resumeContent =
                        extractResumeContent(resume);

                if (resumeContent == null
                        || resumeContent.isBlank()) {

                    throw new RuntimeException(
                            "Could not extract any text from the resume.");
                }

                /*
                 * Local ATS analysis.
                 *
                 * Gemini is NOT required here.
                 */
                LocalATSService.ATSAnalysisResult analysis =
                        localATSService.analyze(
                                resumeContent,
                                null);

                if (analysis == null) {

                    throw new RuntimeException(
                            "Local ATS analysis returned an empty result.");
                }

                ObjectNode analysisResult =
                        objectMapper.createObjectNode();

                analysisResult.put(
                        "atsScore",
                        analysis.getAtsScore());

                analysisResult.put(
                        "keywordScore",
                        analysis.getKeywordScore());

                analysisResult.put(
                        "formattingScore",
                        analysis.getFormattingScore());

                analysisResult.put(
                        "contentScore",
                        analysis.getContentScore());

                analysisResult.set(
                        "missingKeywords",
                        objectMapper.valueToTree(
                                analysis.getMissingKeywords()));

                analysisResult.set(
                        "foundKeywords",
                        objectMapper.valueToTree(
                                analysis.getFoundKeywords()));

                analysisResult.set(
                        "improvementSuggestions",
                        objectMapper.valueToTree(
                                analysis.getImprovementSuggestions()));

                analysisResult.set(
                        "grammarIssues",
                        objectMapper.valueToTree(
                                analysis.getGrammarIssues()));

                analysisResult.set(
                        "sectionAnalysis",
                        objectMapper.valueToTree(
                                analysis.getSectionAnalysis()));

                ATSReport report =
                        ATSReport.builder()
                                .user(user)
                                .resume(resume)

                                .atsScore(
                                        BigDecimal.valueOf(
                                                analysis.getAtsScore()))

                                .keywordScore(
                                        BigDecimal.valueOf(
                                                analysis.getKeywordScore()))

                                .formattingScore(
                                        BigDecimal.valueOf(
                                                analysis.getFormattingScore()))

                                .contentScore(
                                        BigDecimal.valueOf(
                                                analysis.getContentScore()))

                                .missingKeywords(
                                        serializeJsonNode(
                                                analysisResult.get(
                                                        "missingKeywords")))

                                .foundKeywords(
                                        serializeJsonNode(
                                                analysisResult.get(
                                                        "foundKeywords")))

                                .improvementSuggestions(
                                        serializeJsonNode(
                                                analysisResult.get(
                                                        "improvementSuggestions")))

                                .grammarIssues(
                                        serializeJsonNode(
                                                analysisResult.get(
                                                        "grammarIssues")))

                                .sectionAnalysis(
                                        serializeJsonNode(
                                                analysisResult.get(
                                                        "sectionAnalysis")))

                                .reportData(
                                        serializeJsonNode(
                                                analysisResult))

                                .build();

                ATSReport savedReport =
                        atsReportRepository.save(report);

                performanceService.updateATSScore(
                        userId,
                        savedReport.getAtsScore());

                return convertToDTO(
                        savedReport);
            }

        } finally {

            analysisLocks.remove(
                    lockKey,
                    lock);
        }
    }


    // =========================================================
    // GET REPORT BY ID
    // =========================================================

    public ATSReportDTO getReportById(
            Long reportId,
            Long userId) {

        /*
         * IMPORTANT:
         * Ownership is now enforced directly by the
         * database query instead of loading an arbitrary
         * report first.
         */
        ATSReport report =
                atsReportRepository
                        .findByReportIdAndUserId(
                                reportId,
                                userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Report not found"));

        return convertToDTO(report);
    }


    // =========================================================
    // GET USER REPORTS
    // =========================================================

    public List<ATSReportDTO> getUserReports(
            Long userId) {

        return atsReportRepository
                .findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // GET LATEST REPORT
    // =========================================================

    public ATSReportDTO getLatestReport(
            Long userId) {

        return atsReportRepository
                .findTopByUserOrderByCreatedAtDesc(
                        userId)
                .map(this::convertToDTO)
                .orElseThrow(() ->
                        new RuntimeException(
                                "No reports found"));
    }


    // =========================================================
    // JOB MATCH
    // =========================================================

    public JobMatchDTO analyzeJobMatch(
            Long userId,
            Long jobId,
            Long resumeId) {

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        /*
         * Job ownership is enforced by repository query.
         */
        JobDescription jobDescription =
                jobDescriptionRepository
                        .findByJobIdAndUserId(
                                jobId,
                                userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Job description not found"));

        /*
         * Resume ownership is enforced by repository query.
         */
        Resume resume =
                resumeRepository
                        .findByResumeIdAndUserId(
                                resumeId,
                                userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"));

        /*
         * Build request for local Job Match engine.
         */
        JobMatchRequestDTO request =
                JobMatchRequestDTO.builder()
                        .resumeId(resumeId)
                        .jobTitle(
                                jobDescription.getJobTitle())
                        .companyName(
                                jobDescription.getCompanyName())
                        .jobDescription(
                                jobDescription.getJobDescription())
                        .build();

        /*
         * Fast local analysis.
         */
        JobMatchDTO localResult =
                jobMatchService.analyze(
                        userId,
                        request);

        /*
         * Preserve real database Job ID.
         */
        return JobMatchDTO.builder()
                .jobId(jobId)
                .resumeId(resumeId)
                .jobTitle(
                        jobDescription.getJobTitle())
                .companyName(
                        jobDescription.getCompanyName())
                .matchPercentage(
                        localResult.getMatchPercentage())
                .matchingSkills(
                        localResult.getMatchingSkills())
                .missingSkills(
                        localResult.getMissingSkills())
                .suggestions(
                        localResult.getSuggestions())
                .analyzedAt(
                        localResult.getAnalyzedAt())
                .build();
    }


    // =========================================================
    // EXTRACT RESUME CONTENT
    // =========================================================

    public String extractResumeContent(
            Resume resume) {

        if (resume == null) {
            throw new RuntimeException(
                    "Resume not found");
        }

        try {

            Path path =
                    getValidatedStoredPath(
                            resume.getFilePath());

            if (!Files.exists(path)
                    || !Files.isRegularFile(path)) {

                throw new RuntimeException(
                        "Resume file not found");
            }

            String fileType =
                    resume.getFileType();

            if (fileType == null
                    || fileType.isBlank()) {

                throw new RuntimeException(
                        "Unsupported file format");
            }

            if (!fileType.equalsIgnoreCase("pdf")
                    && !fileType.equalsIgnoreCase("docx")
                    && !fileType.equalsIgnoreCase("doc")) {

                throw new RuntimeException(
                        "Unsupported file format");
            }

            return extractWithTika(path);

        } catch (RuntimeException e) {

            throw e;

        } catch (Exception e) {

            /*
             * Do not expose filesystem paths or parser
             * exception messages.
             */
            throw new RuntimeException(
                    "Failed to process resume");
        }
    }


    // =========================================================
    // SECURE TIKA EXTRACTION
    // =========================================================

    private String extractWithTika(
            Path path) {

        try (InputStream stream =
                     Files.newInputStream(path)) {

            BodyContentHandler handler =
                    new BodyContentHandler(
                            MAX_EXTRACTED_TEXT_LENGTH);

            Metadata metadata =
                    new Metadata();

            AutoDetectParser parser =
                    new AutoDetectParser();

            ParseContext context =
                    new ParseContext();

            parser.parse(
                    stream,
                    handler,
                    metadata,
                    context);

            String content =
                    handler.toString();

            return content != null
                    ? content.trim()
                    : "";

        } catch (Exception e) {

            throw new RuntimeException(
                    "Failed to process resume");
        }
    }


    // =========================================================
    // SECURE UPLOAD ROOT
    // =========================================================

    private Path getUploadRootDirectory() {

        Path applicationRoot =
                Paths.get(
                        System.getProperty(
                                "user.dir"))
                        .toAbsolutePath()
                        .normalize();

        Path configuredDirectory =
                Paths.get(uploadDirectory);

        if (configuredDirectory.isAbsolute()) {

            return configuredDirectory
                    .toAbsolutePath()
                    .normalize();
        }

        return applicationRoot
                .resolve(configuredDirectory)
                .normalize();
    }


    // =========================================================
    // VALIDATE STORED RESUME PATH
    // =========================================================

    private Path getValidatedStoredPath(
            String storedPath) {

        if (storedPath == null
                || storedPath.isBlank()) {

            throw new RuntimeException(
                    "Resume file not found");
        }

        Path uploadRoot =
                getUploadRootDirectory();

        Path path;

        try {

            path =
                    Paths.get(storedPath)
                            .toAbsolutePath()
                            .normalize();

        } catch (Exception e) {

            throw new RuntimeException(
                    "Resume file not found");
        }

        /*
         * Prevent a manipulated database path from escaping
         * the configured resume directory.
         */
        if (!path.startsWith(uploadRoot)) {

            throw new SecurityException(
                    "Invalid resume storage path");
        }

        return path;
    }


    // =========================================================
    // PARSE JSON ARRAY
    // =========================================================

    private List<String> parseJsonArray(
            JsonNode node) {

        List<String> result =
                new ArrayList<>();

        if (node == null
                || !node.isArray()) {

            return result;
        }

        for (JsonNode item : node) {

            if (item != null
                    && !item.isNull()) {

                result.add(
                        item.asText());
            }
        }

        return result;
    }


    // =========================================================
    // SERIALIZE JSON
    // =========================================================

    private String serializeJsonNode(
            JsonNode node) {

        if (node == null
                || node.isNull()) {

            return null;
        }

        try {

            return objectMapper.writeValueAsString(
                    node);

        } catch (Exception e) {

            /*
             * This is internal serialization data.
             * Returning node.toString() is safe here because
             * it does not expose filesystem or authentication
             * secrets.
             */
            return node.toString();
        }
    }


    // =========================================================
    // CONVERT TO DTO
    // =========================================================

    private ATSReportDTO convertToDTO(
            ATSReport report) {

        return ATSReportDTO.builder()

                .reportId(
                        report.getReportId())

                .userId(
                        report.getUser()
                                .getUserId())

                .resumeId(
                        report.getResume() != null
                                ? report.getResume()
                                        .getResumeId()
                                : null)

                .atsScore(
                        report.getAtsScore())

                .keywordScore(
                        report.getKeywordScore())

                .formattingScore(
                        report.getFormattingScore())

                .contentScore(
                        report.getContentScore())

                .missingKeywords(
                        report.getMissingKeywords())

                .foundKeywords(
                        report.getFoundKeywords())

                .improvementSuggestions(
                        report.getImprovementSuggestions())

                .grammarIssues(
                        report.getGrammarIssues())

                .sectionAnalysis(
                        report.getSectionAnalysis())

                .reportData(
                        report.getReportData())

                .createdAt(
                        report.getCreatedAt())

                .updatedAt(
                        report.getUpdatedAt())

                .build();
    }
}