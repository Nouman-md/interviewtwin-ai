package com.interviewtwin.service;

import com.interviewtwin.dto.ResumeDTO;
import com.interviewtwin.dto.ResumeSearchDTO;
import com.interviewtwin.entity.Resume;
import com.interviewtwin.entity.User;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ResumeService {

    private static final long MAX_FILE_SIZE = 10 * 1024 * 1024L;

    private static final int MAX_SEARCH_QUERY_LENGTH = 100;

    private static final int MAX_EXTRACTED_TEXT_LENGTH = 1_000_000;

    private static final int MAX_SEARCH_RESULTS = 50;

    private static final int CONTEXT_LENGTH = 50;

    private static final String PDF_MIME =
            "application/pdf";

    private static final String DOC_MIME =
            "application/msword";

    private static final String DOCX_MIME =
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    private final ResumeRepository resumeRepository;

    private final UserRepository userRepository;

    @Value("${file.upload.directory}")
    private String uploadDirectory;

    @Value("${file.upload.allowed-extensions}")
    private String allowedExtensions;


    // =========================================================
    // UPLOAD RESUME
    // =========================================================

    public ResumeDTO uploadResume(
            Long userId,
            MultipartFile file) throws IOException {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        validateFile(file);

        String originalFileName =
                sanitizeFileName(
                        file.getOriginalFilename());

        String fileExtension =
                getFileExtension(originalFileName);

        validateFileContent(
                file,
                fileExtension);

        String uniqueFileName =
                UUID.randomUUID()
                        + "."
                        + fileExtension;

        Path userDirectory =
                getUserUploadDirectory(userId);

        Files.createDirectories(userDirectory);

        Path targetPath =
                userDirectory
                        .resolve(uniqueFileName)
                        .normalize();

        ensurePathInsideUploadDirectory(
                targetPath);

        Files.write(
                targetPath,
                file.getBytes());

        boolean isFirstResume =
                resumeRepository
                        .findByUserId(userId)
                        .isEmpty();

        Resume resume =
                Resume.builder()
                        .user(user)
                        .fileName(originalFileName)
                        .filePath(targetPath.toString())
                        .fileSize(file.getSize())
                        .fileType(fileExtension)
                        .isPrimary(isFirstResume)
                        .build();

        try {

            Resume savedResume =
                    resumeRepository.save(resume);

            return convertToDTO(savedResume);

        } catch (RuntimeException e) {

            try {
                Files.deleteIfExists(targetPath);
            } catch (IOException cleanupException) {
                // Do not expose cleanup information.
            }

            throw new RuntimeException(
                    "Failed to save resume");
        }
    }


    // =========================================================
    // GET RESUME
    // =========================================================

    public ResumeDTO getResumeById(
            Long resumeId,
            Long userId) {

        Resume resume =
                resumeRepository
                        .findByResumeIdAndUserId(
                                resumeId,
                                userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"));

        return convertToDTO(resume);
    }


    // =========================================================
    // GET USER RESUMES
    // =========================================================

    public List<ResumeDTO> getUserResumes(
            Long userId) {

        return resumeRepository
                .findByUserId(userId)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // SET PRIMARY RESUME
    // =========================================================

    public ResumeDTO setPrimaryResume(
            Long resumeId,
            Long userId) {

        Resume resume =
                resumeRepository
                        .findByResumeIdAndUserId(
                                resumeId,
                                userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"));

        resumeRepository
                .findByUserIdAndIsPrimaryTrue(userId)
                .ifPresent(primary -> {

                    if (!primary
                            .getResumeId()
                            .equals(resumeId)) {

                        primary.setIsPrimary(false);

                        resumeRepository.save(primary);
                    }
                });

        resume.setIsPrimary(true);

        Resume updatedResume =
                resumeRepository.save(resume);

        return convertToDTO(updatedResume);
    }


    // =========================================================
    // DELETE RESUME
    // =========================================================

    public void deleteResume(
            Long resumeId,
            Long userId) throws IOException {

        Resume resume =
                resumeRepository
                        .findByResumeIdAndUserId(
                                resumeId,
                                userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"));

        Path filePath =
                getValidatedStoredPath(
                        resume.getFilePath());

        /*
         * Delete the physical file first.
         *
         * If deletion fails, the database record is preserved.
         */
        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }

        resumeRepository.delete(resume);
    }


    // =========================================================
    // DOWNLOAD RESUME
    // =========================================================

    public byte[] getResumeFile(
            Long resumeId,
            Long userId) throws IOException {

        Resume resume =
                resumeRepository
                        .findByResumeIdAndUserId(
                                resumeId,
                                userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"));

        Path filePath =
                getValidatedStoredPath(
                        resume.getFilePath());

        if (!Files.exists(filePath)
                || !Files.isRegularFile(filePath)) {

            throw new RuntimeException(
                    "Resume file not found");
        }

        return Files.readAllBytes(filePath);
    }


    // =========================================================
    // SEARCH INSIDE ONE RESUME
    // =========================================================

    public ResumeSearchDTO searchInResume(
            Long userId,
            Long resumeId,
            String query) {

        String validatedQuery =
                validateSearchQuery(query);

        Resume resume =
                resumeRepository
                        .findByResumeIdAndUserId(
                                resumeId,
                                userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Resume not found"));

        String content =
                extractTextContent(resume);

        List<ResumeSearchDTO.SearchResult> results =
                searchContent(
                        content,
                        validatedQuery);

        return ResumeSearchDTO.builder()
                .resumeId(resume.getResumeId())
                .fileName(resume.getFileName())
                .query(validatedQuery)
                .totalMatches(results.size())
                .results(results)
                .build();
    }


    // =========================================================
    // SEARCH ACROSS ALL USER RESUMES
    // =========================================================

    public List<ResumeSearchDTO> searchAcrossAllResumes(
            Long userId,
            String query) {

        String validatedQuery =
                validateSearchQuery(query);

        List<Resume> resumes =
                resumeRepository
                        .findByUserId(userId);

        List<ResumeSearchDTO> searchResults =
                new ArrayList<>();

        for (Resume resume : resumes) {

            String content =
                    extractTextContent(resume);

            List<ResumeSearchDTO.SearchResult> results =
                    searchContent(
                            content,
                            validatedQuery);

            if (!results.isEmpty()) {

                searchResults.add(
                        ResumeSearchDTO.builder()
                                .resumeId(
                                        resume.getResumeId())
                                .fileName(
                                        resume.getFileName())
                                .query(
                                        validatedQuery)
                                .totalMatches(
                                        results.size())
                                .results(results)
                                .build()
                );
            }
        }

        return searchResults;
    }


    // =========================================================
    // VALIDATE SEARCH QUERY
    // =========================================================

    private String validateSearchQuery(
            String query) {

        if (query == null) {
            throw new IllegalArgumentException(
                    "Search query is required");
        }

        String trimmed =
                query.trim();

        if (trimmed.isEmpty()) {

            throw new IllegalArgumentException(
                    "Search query cannot be empty");
        }

        if (trimmed.length()
                > MAX_SEARCH_QUERY_LENGTH) {

            throw new IllegalArgumentException(
                    "Search query is too long");
        }

        return trimmed;
    }


    // =========================================================
    // EXTRACT RESUME TEXT
    // =========================================================

    private String extractTextContent(
            Resume resume) {

        try {

            Path path =
                    getValidatedStoredPath(
                            resume.getFilePath());

            if (!Files.exists(path)
                    || !Files.isRegularFile(path)) {

                throw new RuntimeException(
                        "Resume file not found");
            }

            try (InputStream stream =
                         Files.newInputStream(path)) {

                /*
                 * Limit extracted text so a malicious document
                 * cannot cause unbounded memory consumption.
                 */
                BodyContentHandler handler =
                        new BodyContentHandler(
                                MAX_EXTRACTED_TEXT_LENGTH);

                Metadata metadata =
                        new Metadata();

                AutoDetectParser parser =
                        new AutoDetectParser();

                ParseContext context =
                        new ParseContext();

                /*
                 * IMPORTANT:
                 * AutoDetectParser.parse() requires
                 * ParseContext as the fourth parameter.
                 */
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
            }

        } catch (RuntimeException e) {

            throw e;

        } catch (Exception e) {

            /*
             * Never expose parser internals,
             * filesystem paths, or exception details.
             */
            throw new RuntimeException(
                    "Failed to process resume");
        }
    }


    // =========================================================
    // SEARCH CONTENT
    // =========================================================

    private List<ResumeSearchDTO.SearchResult> searchContent(
            String content,
            String query) {

        List<ResumeSearchDTO.SearchResult> results =
                new ArrayList<>();

        if (content == null
                || content.isEmpty()
                || query == null
                || query.isBlank()) {

            return results;
        }

        String lowerContent =
                content.toLowerCase();

        String lowerQuery =
                query.toLowerCase().trim();

        int fromIndex = 0;

        int matchCount = 0;

        while (matchCount
                < MAX_SEARCH_RESULTS) {

            int foundIndex =
                    lowerContent.indexOf(
                            lowerQuery,
                            fromIndex);

            if (foundIndex == -1) {
                break;
            }

            int contextStart =
                    Math.max(
                            0,
                            foundIndex - CONTEXT_LENGTH);

            int contextEnd =
                    Math.min(
                            content.length(),
                            foundIndex
                                    + query.length()
                                    + CONTEXT_LENGTH);

            String context =
                    content.substring(
                            contextStart,
                            contextEnd)
                            .trim();

            int lineNumber = 1;

            for (int i = 0;
                 i < foundIndex;
                 i++) {

                if (content.charAt(i)
                        == '\n') {

                    lineNumber++;
                }
            }

            results.add(
                    ResumeSearchDTO.SearchResult
                            .builder()
                            .matchText(query)
                            .context(context)
                            .position(foundIndex)
                            .lineNumber(lineNumber)
                            .build()
            );

            fromIndex =
                    foundIndex
                            + lowerQuery.length();

            matchCount++;
        }

        return results;
    }


    // =========================================================
    // VALIDATE UPLOADED FILE
    // =========================================================

    private void validateFile(
            MultipartFile file) {

        if (file == null
                || file.isEmpty()) {

            throw new IllegalArgumentException(
                    "File is empty");
        }

        if (file.getSize()
                > MAX_FILE_SIZE) {

            throw new IllegalArgumentException(
                    "File size exceeds maximum limit of 10MB");
        }

        String fileName =
                sanitizeFileName(
                        file.getOriginalFilename());

        String extension =
                getFileExtension(fileName);

        if (!isAllowedExtension(extension)) {

            throw new IllegalArgumentException(
                    "File type not allowed");
        }
    }


    // =========================================================
    // VALIDATE ACTUAL FILE CONTENT
    // =========================================================

    private void validateFileContent(
            MultipartFile file,
            String extension) throws IOException {

        String detectedMimeType;

        try (InputStream stream =
                     file.getInputStream()) {

            Tika tika =
                    new Tika();

            detectedMimeType =
                    tika.detect(
                            stream,
                            file.getOriginalFilename());
        }

        boolean valid =
                switch (extension) {

                    case "pdf" ->
                            PDF_MIME.equalsIgnoreCase(
                                    detectedMimeType);

                    case "doc" ->
                            DOC_MIME.equalsIgnoreCase(
                                    detectedMimeType);

                    case "docx" ->
                            DOCX_MIME.equalsIgnoreCase(
                                    detectedMimeType);

                    default ->
                            false;
                };

        if (!valid) {

            throw new IllegalArgumentException(
                    "File content does not match the selected file type");
        }
    }


    // =========================================================
    // GET FILE EXTENSION
    // =========================================================

    private String getFileExtension(
            String fileName) {

        if (fileName == null
                || fileName.isBlank()) {

            return "";
        }

        int lastDot =
                fileName.lastIndexOf('.');

        if (lastDot <= 0
                || lastDot
                == fileName.length() - 1) {

            return "";
        }

        return fileName
                .substring(lastDot + 1)
                .toLowerCase();
    }


    // =========================================================
    // CHECK ALLOWED EXTENSION
    // =========================================================

    private boolean isAllowedExtension(
            String extension) {

        if (extension == null
                || extension.isBlank()) {

            return false;
        }

        String[] allowed =
                allowedExtensions.split(",");

        for (String ext : allowed) {

            if (ext.trim()
                    .equalsIgnoreCase(extension)) {

                return true;
            }
        }

        return false;
    }


    // =========================================================
    // SANITIZE ORIGINAL FILE NAME
    // =========================================================

    private String sanitizeFileName(
            String fileName) {

        if (fileName == null
                || fileName.isBlank()) {

            return "resume";
        }

        String clean;

        try {

            clean =
                    Paths.get(fileName)
                            .getFileName()
                            .toString();

        } catch (Exception e) {

            return "resume";
        }

        clean =
                clean.replaceAll(
                        "[^a-zA-Z0-9._\\-]",
                        "_");

        if (clean.isBlank()) {
            return "resume";
        }

        clean =
                clean.replace("..", "_");

        if (clean.length() > 180) {

            clean =
                    clean.substring(
                            0,
                            180);
        }

        return clean;
    }


    // =========================================================
    // GET UPLOAD ROOT DIRECTORY
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

        Path uploadRoot;

        if (configuredDirectory.isAbsolute()) {

            uploadRoot =
                    configuredDirectory
                            .toAbsolutePath()
                            .normalize();

        } else {

            uploadRoot =
                    applicationRoot
                            .resolve(
                                    configuredDirectory)
                            .normalize();
        }

        return uploadRoot;
    }


    // =========================================================
    // GET USER RESUME DIRECTORY
    // =========================================================

    private Path getUserUploadDirectory(
            Long userId) {

        if (userId == null
                || userId <= 0) {

            throw new IllegalArgumentException(
                    "Invalid user");
        }

        Path uploadRoot =
                getUploadRootDirectory();

        Path userDirectory =
                uploadRoot
                        .resolve(
                                String.valueOf(userId))
                        .normalize();

        ensurePathInsideUploadDirectory(
                userDirectory);

        return userDirectory;
    }


    // =========================================================
    // VALIDATE STORED FILE PATH
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

        if (!path.startsWith(uploadRoot)) {

            throw new SecurityException(
                    "Invalid resume storage path");
        }

        return path;
    }


    // =========================================================
    // ENSURE PATH IS INSIDE UPLOAD DIRECTORY
    // =========================================================

    private void ensurePathInsideUploadDirectory(
            Path path) {

        Path normalizedPath =
                path.toAbsolutePath()
                        .normalize();

        Path uploadRoot =
                getUploadRootDirectory();

        if (!normalizedPath
                .startsWith(uploadRoot)) {

            throw new SecurityException(
                    "Invalid resume storage path");
        }
    }


    // =========================================================
    // CONVERT ENTITY TO DTO
    // =========================================================

    private ResumeDTO convertToDTO(
            Resume resume) {

        /*
         * IMPORTANT:
         * filePath is intentionally NOT returned.
         * The physical server filesystem path must never
         * be exposed through the API.
         */
        return ResumeDTO.builder()
                .resumeId(
                        resume.getResumeId())
                .userId(
                        resume.getUser()
                                .getUserId())
                .fileName(
                        resume.getFileName())
                .fileSize(
                        resume.getFileSize())
                .fileType(
                        resume.getFileType())
                .isPrimary(
                        resume.getIsPrimary())
                .uploadedAt(
                        resume.getUploadedAt())
                .updatedAt(
                        resume.getUpdatedAt())
                .build();
    }
}