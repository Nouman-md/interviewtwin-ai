
package com.interviewtwin.service;

import java.net.http.HttpClient;
import java.time.Duration;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class EmailService {

    @Value("${brevo.api.key:}")
    private String apiKey;

    @Value("${brevo.from.email:}")
    private String fromEmail;

    private final RestClient restClient;

    public EmailService() {
        HttpClient httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(15))
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        JdkClientHttpRequestFactory requestFactory =
                new JdkClientHttpRequestFactory(httpClient);

        this.restClient = RestClient.builder()
                .baseUrl("https://api.brevo.com")
                .requestFactory(requestFactory)
                .build();
    }

    public void sendVerificationCode(String email, String code) {
        String subject = "Verify Your Email - InterviewTwin AI";

        String message = """
                Hello,

                Your email verification code for InterviewTwin AI is:

                %s

                Please enter this code in the application to verify your email.

                Regards,
                InterviewTwin AI Team
                """.formatted(code);

        sendEmail(email, subject, message);
    }

    public void sendPasswordResetCode(String email, String code) {
        String subject = "Password Reset Code - InterviewTwin AI";

        String message = """
                Hello,

                Your password reset verification code for InterviewTwin AI is:

                %s

                Enter this code in the application to continue resetting your password.

                If you did not request a password reset, you can ignore this email.

                Regards,
                InterviewTwin AI Team
                """.formatted(code);

        sendEmail(email, subject, message);
    }

    private void sendEmail(String recipient, String subject, String message) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "Brevo API key is not configured."
            );
        }

        if (fromEmail == null || fromEmail.isBlank()) {
            throw new IllegalStateException(
                    "Brevo sender email is not configured."
            );
        }

        if (recipient == null || recipient.isBlank()) {
            throw new IllegalArgumentException(
                    "Recipient email cannot be empty."
            );
        }

        Map<String, Object> sender = Map.of(
                "name", "InterviewTwin AI",
                "email", fromEmail
        );

        Map<String, Object> recipientDetails = Map.of(
                "email", recipient
        );

        Map<String, Object> payload = Map.of(
                "sender", sender,
                "to", List.of(recipientDetails),
                "subject", subject,
                "textContent", message
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