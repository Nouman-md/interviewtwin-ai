
package com.interviewtwin.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final RestClient restClient =
            RestClient.create("https://api.brevo.com");

    @Value("${brevo.api.key}")
    private String apiKey;

    @Value("${brevo.from.email}")
    private String fromEmail;

    public void sendVerificationCode(String email, String code) {
        String subject = "InterviewTwin AI - Email Verification Code";

        String text = "Hello,\n\n" +
                "Your InterviewTwin AI email verification code is:\n\n" +
                code + "\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "If you did not create an InterviewTwin AI account, please ignore this email.\n\n" +
                "Regards,\n" +
                "InterviewTwin AI Team";

        sendEmail(email, subject, text);
    }

    public void sendPasswordResetCode(String email, String code) {
        String subject = "InterviewTwin AI - Password Reset Code";

        String text = "Hello,\n\n" +
                "Your InterviewTwin AI password reset code is:\n\n" +
                code + "\n\n" +
                "This code will expire in 10 minutes.\n\n" +
                "If you did not request a password reset, please ignore this email.\n\n" +
                "Regards,\n" +
                "InterviewTwin AI Team";

        sendEmail(email, subject, text);
    }

    private void sendEmail(String email, String subject, String text) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("Brevo API key is not configured");
        }

        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalStateException("Brevo sender email is not configured");
        }

        Map<String, Object> payload = Map.of(
                "sender", Map.of(
                        "name", "InterviewTwin AI",
                        "email", fromEmail
                ),
                "to", List.of(
                        Map.of("email", email)
                ),
                "subject", subject,
                "textContent", text
        );

        restClient.post()
                .uri("/v3/smtp/email")
                .header("api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .toBodilessEntity();
    }
}