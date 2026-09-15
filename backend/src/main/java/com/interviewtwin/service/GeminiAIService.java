package com.interviewtwin.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class GeminiAIService {

    // =========================================================
    // GEMINI CONFIGURATION
    // =========================================================

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Value("${gemini.model.name}")
    private String modelName;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    private final ObjectMapper objectMapper;
    private final WebClient webClient;

    // =========================================================
    // REQUEST PROTECTION
    // =========================================================

    /*
     * Maximum number of Gemini requests allowed to run
     * simultaneously on this backend instance.
     *
     * Kept at 3 to protect the Gemini Free Tier quota.
     */
    private static final int MAX_CONCURRENT_REQUESTS = 3;

    private static final Semaphore GEMINI_REQUEST_LIMITER =
        new Semaphore(
            MAX_CONCURRENT_REQUESTS,
            true
        );

    /*
     * Maximum time a request waits to obtain a Gemini slot.
     */
    private static final long SLOT_WAIT_SECONDS = 30;

    /*
     * Maximum time allowed for one Gemini HTTP request.
     *
     * Reduced from 45 seconds to 30 seconds.
     */
    private static final long REQUEST_TIMEOUT_SECONDS = 30;

    /*
     * No automatic retries.
     *
     * This is important for the Free Tier because retrying
     * a rate-limited request can make the situation worse
     * and unnecessarily delay the user.
     */
    private static final int MAX_RETRIES = 0;

    // =========================================================
    // RESUME ANALYSIS
    // =========================================================

    public ObjectNode analyzeResume(String resumeContent) {

        String prompt =
            buildResumeAnalysisPrompt(resumeContent);

        String aiResponse =
            callGeminiAPI(prompt);

        return parseResumeAnalysisResponse(
            aiResponse
        );
    }

    // =========================================================
    // INTERVIEW QUESTION
    // =========================================================

    public String generateInterviewQuestion(
            String interviewType,
            String category) {

        String prompt =
            "Generate a "
            + interviewType
            + " interview question for "
            + category
            + ". Provide only the question, no additional text.";

        return callGeminiAPI(prompt);
    }

    // =========================================================
    // INTERVIEW ANSWER EVALUATION
    // =========================================================

    public ObjectNode evaluateInterviewAnswer(
            String question,
            String userAnswer,
            String modelAnswer) {

        String prompt =
            buildEvaluationPrompt(
                question,
                userAnswer,
                modelAnswer
            );

        String aiResponse =
            callGeminiAPI(prompt);

        return parseEvaluationResponse(
            aiResponse
        );
    }

    // =========================================================
    // CODING ANALYSIS
    // =========================================================

    public String analyzeCodingSubmission(
            String code,
            String testResults) {

        String prompt =
            buildCodingAnalysisPrompt(
                code,
                testResults
            );

        return callGeminiAPI(prompt);
    }

    // =========================================================
    // JOB MATCH
    // =========================================================

    public ObjectNode analyzeJobDescription(
            String jobDescription,
            String resumeContent) {

        String prompt =
            buildJobMatchPrompt(
                jobDescription,
                resumeContent
            );

        String aiResponse =
            callGeminiAPI(prompt);

        return parseJobMatchResponse(
            aiResponse
        );
    }

    // =========================================================
    // LEARNING ROADMAP
    // =========================================================

    public String generateLearningRoadmap(
            String weakAreas) {

        String prompt =
            "Create a personalized learning roadmap for someone weak in: "
            + weakAreas
            + ". Include topics, resources, and estimated time.";

        return callGeminiAPI(prompt);
    }

    // =========================================================
    // CENTRAL GEMINI API METHOD
    // =========================================================

    private String callGeminiAPI(
            String prompt) {

        // -----------------------------------------------------
        // Validate API key
        // -----------------------------------------------------

        if (geminiApiKey == null
                || geminiApiKey.isEmpty()
                || geminiApiKey.contains(
                    "your-gemini-api-key")) {

            throw new RuntimeException(
                "Gemini API key not configured. "
                + "Please set GEMINI_API_KEY environment variable."
            );
        }

        // -----------------------------------------------------
        // Validate prompt
        // -----------------------------------------------------

        if (prompt == null || prompt.isBlank()) {

            throw new RuntimeException(
                "Gemini request prompt cannot be empty."
            );
        }

        // -----------------------------------------------------
        // Build request
        // -----------------------------------------------------

        String requestBody =
            buildGeminiRequest(prompt);

        String url =
            geminiApiUrl
                + "/v1beta/models/"
                + modelName
                + ":generateContent?key="
                + geminiApiKey;

        // -----------------------------------------------------
        // Acquire concurrency slot
        // -----------------------------------------------------

        boolean acquired = false;

        try {

            acquired =
                GEMINI_REQUEST_LIMITER.tryAcquire(
                    SLOT_WAIT_SECONDS,
                    TimeUnit.SECONDS
                );

            if (!acquired) {

                throw new RuntimeException(
                    "Gemini service is currently busy. "
                    + "Please try again in a few moments."
                );
            }

            // -------------------------------------------------
            // Execute one request
            // -------------------------------------------------

            return executeWithRetry(
                url,
                requestBody
            );

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            throw new RuntimeException(
                "Gemini request was interrupted.",
                e
            );

        } finally {

            if (acquired) {
                GEMINI_REQUEST_LIMITER.release();
            }
        }
    }

    // =========================================================
    // REQUEST HANDLER
    // =========================================================

    private String executeWithRetry(
            String url,
            String requestBody) {

        Exception lastException = null;

        /*
         * MAX_RETRIES = 0 means this loop executes exactly once.
         */
        for (
            int attempt = 0;
            attempt <= MAX_RETRIES;
            attempt++
        ) {

            try {

                GeminiResponse response =
                    sendGeminiRequest(
                        url,
                        requestBody
                    );

                // -------------------------------------------------
                // SUCCESS
                // -------------------------------------------------

                if (response.statusCode >= 200
                        && response.statusCode < 300) {

                    if (response.body == null
                            || response.body.isEmpty()) {

                        throw new RuntimeException(
                            "Gemini API returned empty response."
                        );
                    }

                    return extractTextFromResponse(
                        response.body
                    );
                }

                // -------------------------------------------------
                // RATE LIMIT
                // -------------------------------------------------

                if (response.statusCode == 429) {

                    String errorMessage =
                        extractErrorMessage(
                            response.body
                        );

                    throw new RuntimeException(
                        "Gemini API rate limit reached. "
                        + errorMessage
                        + ". Please try again later."
                    );
                }

                // -------------------------------------------------
                // SERVER ERRORS
                // -------------------------------------------------

                if (response.statusCode >= 500) {

                    String errorMessage =
                        extractErrorMessage(
                            response.body
                        );

                    throw new RuntimeException(
                        "Gemini service is temporarily unavailable. "
                        + errorMessage
                        + ". Please try again shortly."
                    );
                }

                // -------------------------------------------------
                // OTHER ERRORS
                // -------------------------------------------------

                String errorMessage =
                    extractErrorMessage(
                        response.body
                    );

                throw new RuntimeException(
                    "Gemini API error (HTTP "
                    + response.statusCode
                    + "): "
                    + errorMessage
                );

            } catch (RuntimeException e) {

                lastException = e;

                /*
                 * No retry because MAX_RETRIES = 0.
                 */
                if (attempt == MAX_RETRIES) {
                    break;
                }
            }
        }

        throw new RuntimeException(
            "Failed to call Gemini API: "
            + (
                lastException != null
                    ? lastException.getMessage()
                    : "Unknown error"
            ),
            lastException
        );
    }

    // =========================================================
    // SEND ONE GEMINI REQUEST
    // =========================================================

    private GeminiResponse sendGeminiRequest(
            String url,
            String requestBody) {

        try {

            GeminiResponse response =
                webClient.post()
                    .uri(url)
                    .header(
                        "Content-Type",
                        "application/json"
                    )
                    .bodyValue(requestBody)
                    .exchangeToMono(
                        clientResponse ->

                            clientResponse
                                .bodyToMono(
                                    String.class
                                )
                                .defaultIfEmpty("")
                                .map(
                                    body ->
                                        new GeminiResponse(
                                            clientResponse
                                                .statusCode()
                                                .value(),
                                            body
                                        )
                                )
                    )
                    .block(
                        Duration.ofSeconds(
                            REQUEST_TIMEOUT_SECONDS
                        )
                    );

            if (response == null) {

                throw new RuntimeException(
                    "Gemini API returned no response."
                );
            }

            return response;

        } catch (Exception e) {

            throw new RuntimeException(
                "Gemini HTTP request failed: "
                + (
                    e.getMessage() != null
                        ? e.getMessage()
                        : e.getClass()
                            .getSimpleName()
                ),
                e
            );
        }
    }

    // =========================================================
    // GEMINI REQUEST BODY
    // =========================================================

    private String buildGeminiRequest(
            String prompt) {

        return "{\n"
            + "  \"contents\": [{\n"
            + "    \"parts\": [{\n"
            + "      \"text\": \""
            + escapeJson(prompt)
            + "\"\n"
            + "    }]\n"
            + "  }]\n"
            + "}";
    }

    // =========================================================
    // RESUME ANALYSIS PROMPT
    // =========================================================

    private String buildResumeAnalysisPrompt(
            String resumeContent) {

        return """
            Analyze the following resume for ATS compatibility.

            Return ONLY valid JSON.
            Do not use markdown.
            Do not use ```json.
            Do not add any explanation before or after the JSON.

            The JSON MUST have exactly these fields:

            {
              "atsScore": 0,
              "keywordScore": 0,
              "formattingScore": 0,
              "contentScore": 0,
              "missingKeywords": [],
              "foundKeywords": [],
              "improvementSuggestions": [],
              "grammarIssues": [],
              "sectionAnalysis": {}
            }

            Rules:
            - atsScore must be a number from 0 to 100.
            - keywordScore must be a number from 0 to 100.
            - formattingScore must be a number from 0 to 100.
            - contentScore must be a number from 0 to 100.
            - missingKeywords must contain specific useful keywords that are absent or weak in the resume.
            - foundKeywords must contain important keywords actually found in the resume.
            - improvementSuggestions must contain at least 3 specific, actionable improvements whenever improvements are possible.
            - grammarIssues must contain actual grammar, spelling, wording, or clarity issues found in the resume. If there are genuinely none, return [].
            - sectionAnalysis must contain useful observations for sections such as Summary, Skills, Education, Experience, and Projects when those sections exist.
            - Do not invent skills or experience that are not present in the resume.

            Resume:
            """ + resumeContent;
    }

    // =========================================================
    // INTERVIEW EVALUATION PROMPT
    // =========================================================

    private String buildEvaluationPrompt(
            String question,
            String userAnswer,
            String modelAnswer) {

        return "Evaluate the following interview answer:\n\n"
            + "Question: "
            + question
            + "\n\n"
            + "User's Answer: "
            + userAnswer
            + "\n\n"
            + "Model Answer: "
            + modelAnswer
            + "\n\n"
            + "Provide JSON response with:\n"
            + "- score (0-100)\n"
            + "- feedback\n"
            + "- strengths: array\n"
            + "- improvements: array\n"
            + "- keyPointsMissed: array";
    }

    // =========================================================
    // CODING ANALYSIS PROMPT
    // =========================================================

    private String buildCodingAnalysisPrompt(
            String code,
            String testResults) {

        return "Analyze the following code submission:\n\n"
            + "Code:\n"
            + code
            + "\n\n"
            + "Test Results:\n"
            + testResults
            + "\n\n"
            + "Provide:\n"
            + "1. Time Complexity analysis\n"
            + "2. Space Complexity analysis\n"
            + "3. Code quality assessment\n"
            + "4. Suggestions for improvement\n"
            + "5. Test coverage feedback";
    }

    // =========================================================
    // JOB MATCH PROMPT
    // =========================================================

    private String buildJobMatchPrompt(
            String jobDescription,
            String resumeContent) {

        return """
            Compare the resume against the job description carefully.

            Return ONLY valid JSON.
            Do not use markdown.
            Do not use ```json.
            Do not add any explanation before or after the JSON.

            The JSON MUST have exactly these fields:

            {
              "matchPercentage": 0,
              "matchingSkills": [],
              "missingSkills": [],
              "suggestions": []
            }

            Rules:
            - matchPercentage must be a number from 0 to 100.
            - matchingSkills must contain skills from the job description that are clearly present in the resume.
            - missingSkills must contain important skills required by the job description that are missing or weak in the resume.
            - suggestions must contain at least 3 specific and actionable recommendations for improving the resume's match with this job description whenever improvements are possible.
            - Suggestions must be based specifically on the supplied job description and resume.
            - Do not recommend claiming skills, experience, or technologies that the candidate does not actually have.
            - Prioritize important missing required skills and weak keyword coverage.

            Job Description:
            """ + jobDescription + """

            Resume:
            """ + resumeContent;
    }

    // =========================================================
    // RESUME RESPONSE PARSER
    // =========================================================

    private ObjectNode parseResumeAnalysisResponse(
            String response) {

        try {

            String json =
                cleanJsonResponse(response);

            JsonNode parsed =
                objectMapper.readTree(json);

            ObjectNode result =
                objectMapper.createObjectNode();

            result.put(
                "atsScore",
                parsed
                    .path("atsScore")
                    .asDouble(65.0)
            );

            result.put(
                "keywordScore",
                parsed
                    .path("keywordScore")
                    .asDouble(70.0)
            );

            result.put(
                "formattingScore",
                parsed
                    .path("formattingScore")
                    .asDouble(75.0)
            );

            result.put(
                "contentScore",
                parsed
                    .path("contentScore")
                    .asDouble(72.0)
            );

            result.set(
                "missingKeywords",
                getArrayOrEmpty(
                    parsed,
                    "missingKeywords"
                )
            );

            result.set(
                "foundKeywords",
                getArrayOrEmpty(
                    parsed,
                    "foundKeywords"
                )
            );

            result.set(
                "improvementSuggestions",
                getArrayOrEmpty(
                    parsed,
                    "improvementSuggestions"
                )
            );

            result.set(
                "grammarIssues",
                getArrayOrEmpty(
                    parsed,
                    "grammarIssues"
                )
            );

            result.set(
                "sectionAnalysis",
                parsed.has("sectionAnalysis")
                    ? parsed.get("sectionAnalysis")
                    : objectMapper.createObjectNode()
            );

            return result;

        } catch (Exception e) {

            throw new RuntimeException(
                "Failed to parse resume analysis response: "
                + e.getMessage(),
                e
            );
        }
    }

    // =========================================================
    // INTERVIEW RESPONSE PARSER
    // =========================================================

    private ObjectNode parseEvaluationResponse(
            String response) {

        try {

            ObjectNode result =
                objectMapper.createObjectNode();

            result.put(
                "score",
                extractDouble(
                    response,
                    "score",
                    70.0
                )
            );

            result.put(
                "feedback",
                extractString(
                    response,
                    "feedback",
                    "No feedback available"
                )
            );

            result.set(
                "strengths",
                objectMapper.valueToTree(
                    extractArray(
                        response,
                        "strengths"
                    )
                )
            );

            result.set(
                "improvements",
                objectMapper.valueToTree(
                    extractArray(
                        response,
                        "improvements"
                    )
                )
            );

            result.set(
                "keyPointsMissed",
                objectMapper.valueToTree(
                    extractArray(
                        response,
                        "keyPointsMissed"
                    )
                )
            );

            return result;

        } catch (Exception e) {

            throw new RuntimeException(
                "Failed to parse evaluation response: "
                + e.getMessage(),
                e
            );
        }
    }

    // =========================================================
    // JOB MATCH RESPONSE PARSER
    // =========================================================

    private ObjectNode parseJobMatchResponse(
            String response) {

        try {

            String json =
                cleanJsonResponse(response);

            JsonNode parsed =
                objectMapper.readTree(json);

            ObjectNode result =
                objectMapper.createObjectNode();

            result.put(
                "matchPercentage",
                parsed
                    .path("matchPercentage")
                    .asDouble(65.0)
            );

            result.set(
                "matchingSkills",
                getArrayOrEmpty(
                    parsed,
                    "matchingSkills"
                )
            );

            result.set(
                "missingSkills",
                getArrayOrEmpty(
                    parsed,
                    "missingSkills"
                )
            );

            result.set(
                "suggestions",
                getArrayOrEmpty(
                    parsed,
                    "suggestions"
                )
            );

            return result;

        } catch (Exception e) {

            throw new RuntimeException(
                "Failed to parse job match response: "
                + e.getMessage(),
                e
            );
        }
    }

    // =========================================================
    // CLEAN JSON
    // =========================================================

    private String cleanJsonResponse(
            String response) {

        if (response == null) {

            throw new RuntimeException(
                "Gemini returned null response"
            );
        }

        String cleaned =
            response.trim();

        if (cleaned.startsWith("```json")) {

            cleaned =
                cleaned.substring(7);

        } else if (cleaned.startsWith("```")) {

            cleaned =
                cleaned.substring(3);
        }

        if (cleaned.endsWith("```")) {

            cleaned =
                cleaned.substring(
                    0,
                    cleaned.length() - 3
                );
        }

        return cleaned.trim();
    }

    // =========================================================
    // JSON ARRAY HELPER
    // =========================================================

    private JsonNode getArrayOrEmpty(
            JsonNode parent,
            String fieldName) {

        JsonNode node =
            parent.get(fieldName);

        if (node != null
                && node.isArray()) {

            return node;
        }

        return objectMapper.createArrayNode();
    }

    // =========================================================
    // EXTRACT TEXT FROM GEMINI RESPONSE
    // =========================================================

    private String extractTextFromResponse(
            String response) {

        try {

            JsonNode root =
                objectMapper.readTree(response);

            JsonNode textNode =
                root
                    .path("candidates")
                    .path(0)
                    .path("content")
                    .path("parts")
                    .path(0)
                    .path("text");

            if (!textNode.isMissingNode()
                    && !textNode.isNull()) {

                return textNode.asText();
            }

            return response;

        } catch (Exception e) {

            return response;
        }
    }

    // =========================================================
    // ERROR MESSAGE
    // =========================================================

    private String extractErrorMessage(
            String response) {

        try {

            if (response == null
                    || response.isEmpty()) {

                return "Unknown Gemini API error";
            }

            JsonNode root =
                objectMapper.readTree(response);

            JsonNode message =
                root
                    .path("error")
                    .path("message");

            if (!message.isMissingNode()
                    && !message.isNull()) {

                return message.asText();
            }

            JsonNode status =
                root
                    .path("error")
                    .path("status");

            if (!status.isMissingNode()
                    && !status.isNull()) {

                return "Status: "
                    + status.asText();
            }

            return "Unknown Gemini API error";

        } catch (Exception e) {

            return "Error parsing Gemini API error message";
        }
    }

    // =========================================================
    // EXTRACT DOUBLE
    // =========================================================

    private double extractDouble(
            String response,
            String key,
            double defaultValue) {

        try {

            int index =
                response.indexOf(
                    "\"" + key + "\""
                );

            if (index != -1) {

                int colonIndex =
                    response.indexOf(
                        ":",
                        index
                    );

                int commaIndex =
                    response.indexOf(
                        ",",
                        colonIndex
                    );

                if (commaIndex == -1) {

                    commaIndex =
                        response.indexOf(
                            "}",
                            colonIndex
                        );
                }

                String value =
                    response
                        .substring(
                            colonIndex + 1,
                            commaIndex
                        )
                        .trim();

                return Double.parseDouble(
                    value
                );
            }

        } catch (Exception e) {
            // Return default value.
        }

        return defaultValue;
    }

    // =========================================================
    // EXTRACT STRING
    // =========================================================

    private String extractString(
            String response,
            String key,
            String defaultValue) {

        try {

            int index =
                response.indexOf(
                    "\"" + key + "\""
                );

            if (index != -1) {

                int colonIndex =
                    response.indexOf(
                        ":",
                        index
                    );

                int quoteStart =
                    response.indexOf(
                        "\"",
                        colonIndex
                    ) + 1;

                int quoteEnd =
                    response.indexOf(
                        "\"",
                        quoteStart
                    );

                return response.substring(
                    quoteStart,
                    quoteEnd
                );
            }

        } catch (Exception e) {
            // Return default value.
        }

        return defaultValue;
    }

    // =========================================================
    // EXTRACT ARRAY
    // =========================================================

    private List<String> extractArray(
            String response,
            String key) {

        List<String> result =
            new ArrayList<>();

        try {

            int index =
                response.indexOf(
                    "\"" + key + "\""
                );

            if (index != -1) {

                int arrayStart =
                    response.indexOf(
                        "[",
                        index
                    );

                int arrayEnd =
                    response.indexOf(
                        "]",
                        arrayStart
                    );

                String arrayContent =
                    response.substring(
                        arrayStart + 1,
                        arrayEnd
                    );

                StringBuilder currentItem =
                    new StringBuilder();

                boolean inQuotes = false;

                for (
                    int i = 0;
                    i < arrayContent.length();
                    i++
                ) {

                    char c =
                        arrayContent.charAt(i);

                    if (c == '"') {

                        inQuotes =
                            !inQuotes;

                    } else if (
                        c == ','
                            && !inQuotes
                    ) {

                        String cleaned =
                            currentItem
                                .toString()
                                .trim()
                                .replaceAll(
                                    "\"",
                                    ""
                                );

                        if (!cleaned.isEmpty()) {

                            result.add(
                                cleaned
                            );
                        }

                        currentItem =
                            new StringBuilder();

                    } else {

                        currentItem.append(c);
                    }
                }

                String cleaned =
                    currentItem
                        .toString()
                        .trim()
                        .replaceAll(
                            "\"",
                            ""
                        );

                if (!cleaned.isEmpty()) {

                    result.add(cleaned);
                }
            }

        } catch (Exception e) {
            // Return empty list.
        }

        return result;
    }

    // =========================================================
    // ESCAPE JSON
    // =========================================================

    private String escapeJson(
            String input) {

        if (input == null) {
            return "";
        }

        return input
            .replace("\\", "\\\\")
            .replace("\"", "\\\"")
            .replace("\n", "\\n")
            .replace("\r", "\\r")
            .replace("\t", "\\t");
    }

    // =========================================================
    // GEMINI RESPONSE HOLDER
    // =========================================================

    private static class GeminiResponse {

        private final int statusCode;
        private final String body;

        private GeminiResponse(
                int statusCode,
                String body) {

            this.statusCode =
                statusCode;

            this.body =
                body;
        }
    }
}