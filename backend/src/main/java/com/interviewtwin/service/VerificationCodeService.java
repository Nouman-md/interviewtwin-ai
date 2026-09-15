package com.interviewtwin.service;

import com.interviewtwin.entity.VerificationCode;
import com.interviewtwin.repository.VerificationCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class VerificationCodeService {

    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;

    private final SecureRandom secureRandom = new SecureRandom();

    private static final int CODE_EXPIRATION_MINUTES = 10;
    private static final int MAX_ATTEMPTS = 5;

    // =========================================================
    // PUBLIC METHODS
    // =========================================================

    public void sendVerificationCode(String email) {

        sendCode(
            normalizeEmail(email),
            "EMAIL_VERIFICATION"
        );
    }

    public void sendPasswordResetCode(String email) {

        sendCode(
            normalizeEmail(email),
            "PASSWORD_RESET"
        );
    }

    // =========================================================
    // SEND CODE
    // =========================================================

    private void sendCode(
        String email,
        String purpose
    ) {

        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(
                "Email cannot be empty"
            );
        }

        // -----------------------------------------------------
        // Remove previous unused codes
        // -----------------------------------------------------

        verificationCodeRepository
            .deleteByEmailAndPurpose(
                email,
                purpose
            );

        // -----------------------------------------------------
        // Generate cryptographically secure 6-digit code
        // -----------------------------------------------------

        String rawCode = String.format(
            "%06d",
            secureRandom.nextInt(1_000_000)
        );

        // -----------------------------------------------------
        // NEVER store raw code
        // -----------------------------------------------------

        String codeHash = hashCode(rawCode);

        VerificationCode verificationCode =
            VerificationCode.builder()
                .email(email)
                .code(codeHash)
                .expiryDate(
                    LocalDateTime.now()
                        .plusMinutes(
                            CODE_EXPIRATION_MINUTES
                        )
                )
                .used(false)
                .purpose(purpose)
                .attempts(0)
                .build();

        verificationCodeRepository.save(
            verificationCode
        );

        // -----------------------------------------------------
        // Send raw code ONLY through email
        // -----------------------------------------------------

        if ("EMAIL_VERIFICATION".equals(purpose)) {

            emailService.sendVerificationCode(
                email,
                rawCode
            );

        } else if ("PASSWORD_RESET".equals(purpose)) {

            emailService.sendPasswordResetCode(
                email,
                rawCode
            );
        }
    }

    // =========================================================
    // VERIFY CODE
    // =========================================================

    public boolean verifyCode(
        String email,
        String code,
        String purpose
    ) {

        String normalizedEmail =
            normalizeEmail(email);

        String normalizedCode =
            normalizeCode(code);

        if (normalizedEmail == null ||
            normalizedCode == null) {

            throw new RuntimeException(
                "Invalid or expired verification code"
            );
        }

        if (!normalizedCode.matches("\\d{6}")) {

            throw new RuntimeException(
                "Invalid or expired verification code"
            );
        }

        // -----------------------------------------------------
        // Find latest active code
        // -----------------------------------------------------

        VerificationCode verificationCode =
            verificationCodeRepository
                .findTopByEmailAndPurposeAndUsedFalseOrderByIdDesc(
                    normalizedEmail,
                    purpose
                )
                .orElseThrow(() ->
                    new RuntimeException(
                        "Invalid or expired verification code"
                    )
                );

        // -----------------------------------------------------
        // Check expiry
        // -----------------------------------------------------

        if (!verificationCode
                .getExpiryDate()
                .isAfter(LocalDateTime.now())) {

            verificationCodeRepository.delete(
                verificationCode
            );

            throw new RuntimeException(
                "Invalid or expired verification code"
            );
        }

        // -----------------------------------------------------
        // Check maximum attempts
        // -----------------------------------------------------

        if (verificationCode.getAttempts() >= MAX_ATTEMPTS) {

            verificationCode.setUsed(true);

            verificationCodeRepository.save(
                verificationCode
            );

            throw new RuntimeException(
                "Invalid or expired verification code"
            );
        }

        // -----------------------------------------------------
        // Hash submitted code
        // -----------------------------------------------------

        String submittedHash =
            hashCode(normalizedCode);

        // -----------------------------------------------------
        // Constant-time comparison
        // -----------------------------------------------------

        boolean matches =
            MessageDigest.isEqual(
                verificationCode
                    .getCode()
                    .getBytes(StandardCharsets.UTF_8),

                submittedHash
                    .getBytes(StandardCharsets.UTF_8)
            );

        // -----------------------------------------------------
        // INVALID CODE
        // -----------------------------------------------------

        if (!matches) {

            int newAttempts =
                verificationCode.getAttempts() + 1;

            verificationCode.setAttempts(
                newAttempts
            );

            /*
             * Invalidate the code after the maximum number
             * of failed attempts.
             */
            if (newAttempts >= MAX_ATTEMPTS) {
                verificationCode.setUsed(true);
            }

            verificationCodeRepository.save(
                verificationCode
            );

            throw new RuntimeException(
                "Invalid or expired verification code"
            );
        }

        // -----------------------------------------------------
        // SUCCESS
        // -----------------------------------------------------

        verificationCode.setUsed(true);

        verificationCodeRepository.save(
            verificationCode
        );

        return true;
    }

    // =========================================================
    // HASHING
    // =========================================================

    /**
     * Creates a SHA-256 hash.
     *
     * The database stores this hash instead of the actual
     * 6-digit verification code.
     */
    private String hashCode(String value) {

        try {

            MessageDigest digest =
                MessageDigest.getInstance("SHA-256");

            byte[] hash =
                digest.digest(
                    value.getBytes(
                        StandardCharsets.UTF_8
                    )
                );

            StringBuilder hex =
                new StringBuilder(
                    hash.length * 2
                );

            for (byte b : hash) {

                hex.append(
                    String.format(
                        "%02x",
                        b & 0xff
                    )
                );
            }

            return hex.toString();

        } catch (Exception e) {

            throw new IllegalStateException(
                "Unable to securely process verification code",
                e
            );
        }
    }

    // =========================================================
    // NORMALIZATION
    // =========================================================

    private String normalizeEmail(String email) {

        if (email == null) {
            return null;
        }

        String normalized =
            email.trim().toLowerCase();

        return normalized.isBlank()
            ? null
            : normalized;
    }

    private String normalizeCode(String code) {

        if (code == null) {
            return null;
        }

        String normalized =
            code.trim();

        return normalized.isBlank()
            ? null
            : normalized;
    }
}