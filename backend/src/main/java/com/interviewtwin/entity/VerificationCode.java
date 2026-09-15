package com.interviewtwin.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
    name = "verification_codes",
    indexes = {
        @Index(
            name = "idx_verification_email_purpose",
            columnList = "email,purpose"
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String email;

    /*
     * Stores ONLY the SHA-256 hash of the verification code.
     *
     * The actual 6-digit code is sent by email but is never
     * stored in the database.
     */
    @Column(nullable = false, length = 64)
    private String code;

    @Column(nullable = false)
    private LocalDateTime expiryDate;

    @Column(nullable = false)
    @Builder.Default
    private boolean used = false;

    @Column(nullable = false, length = 50)
    private String purpose;

    /*
     * Number of failed verification attempts.
     */
    @Column(nullable = false)
    @Builder.Default
    private int attempts = 0;
}