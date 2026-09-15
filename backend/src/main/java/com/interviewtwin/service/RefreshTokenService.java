package com.interviewtwin.service;

import com.interviewtwin.entity.RefreshToken;
import com.interviewtwin.entity.User;
import com.interviewtwin.repository.RefreshTokenRepository;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
@Transactional
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;

    @Value("${jwt.refresh-expiration}")
    private long refreshTokenExpirationMs;

    private final SecureRandom secureRandom = new SecureRandom();

    /**
     * Creates a new refresh token.
     *
     * The raw token is returned to the caller so it can be
     * placed inside the HttpOnly cookie.
     *
     * Only the SHA-256 hash is stored in the database.
     */
    public RefreshTokenResult createRefreshToken(String email) {

        User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                new RuntimeException("User not found")
            );

        // Remove previous refresh tokens for this user.
        refreshTokenRepository.deleteByUser(user);

        String rawToken = generateRawToken();

        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken = RefreshToken.builder()
            .token(tokenHash)
            .user(user)
            .expiryDate(
                LocalDateTime.now()
                    .plusNanos(
                        refreshTokenExpirationMs * 1_000_000
                    )
            )
            .revoked(false)
            .build();

        RefreshToken savedToken =
            refreshTokenRepository.save(refreshToken);

        return new RefreshTokenResult(
            rawToken,
            savedToken
        );
    }

    /**
     * Verifies a raw refresh token received from the browser.
     *
     * The raw token is hashed before database lookup.
     */
    public RefreshToken verifyRefreshToken(String rawToken) {

        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken =
            refreshTokenRepository
                .findByTokenAndRevokedFalse(tokenHash)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Refresh token not found or revoked"
                    )
                );

        if (
            refreshToken.getExpiryDate()
                .isBefore(LocalDateTime.now())
        ) {

            refreshTokenRepository.delete(refreshToken);

            throw new RuntimeException(
                "Refresh token expired"
            );
        }

        return refreshToken;
    }

    /**
     * Rotates a refresh token.
     *
     * The old token becomes invalid and a completely new
     * raw token is generated.
     */
    public RefreshTokenResult rotateRefreshToken(
        String rawToken
    ) {

        RefreshToken oldToken =
            verifyRefreshToken(rawToken);

        User user = oldToken.getUser();

        // Invalidate the old token.
        refreshTokenRepository.delete(oldToken);

        String newRawToken = generateRawToken();

        String newTokenHash =
            hashToken(newRawToken);

        RefreshToken newRefreshToken =
            RefreshToken.builder()
                .token(newTokenHash)
                .user(user)
                .expiryDate(
                    LocalDateTime.now()
                        .plusNanos(
                            refreshTokenExpirationMs * 1_000_000
                        )
                )
                .revoked(false)
                .build();

        RefreshToken savedToken =
            refreshTokenRepository.save(newRefreshToken);

        return new RefreshTokenResult(
            newRawToken,
            savedToken
        );
    }

    /**
     * Revokes a refresh token received from the browser.
     */
    public void revokeToken(String rawToken) {

        String tokenHash = hashToken(rawToken);

        refreshTokenRepository
            .findByToken(tokenHash)
            .ifPresent(refreshToken -> {

                refreshToken.setRevoked(true);

                refreshTokenRepository.save(
                    refreshToken
                );
            });
    }

    /**
     * Revokes all refresh tokens belonging to a user.
     */
    public void revokeAllUserTokens(User user) {

        refreshTokenRepository.deleteByUser(user);
    }

    /**
     * Generates a cryptographically secure 256-bit token.
     */
    private String generateRawToken() {

        byte[] randomBytes = new byte[32];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(randomBytes);
    }

    /**
     * Creates a SHA-256 hash of the raw refresh token.
     */
    private String hashToken(String rawToken) {

        if (rawToken == null || rawToken.isBlank()) {
            throw new IllegalArgumentException(
                "Refresh token cannot be empty"
            );
        }

        try {

            MessageDigest digest =
                MessageDigest.getInstance("SHA-256");

            byte[] hash =
                digest.digest(
                    rawToken.getBytes(
                        StandardCharsets.UTF_8
                    )
                );

            StringBuilder hexString =
                new StringBuilder();

            for (byte b : hash) {

                String hex =
                    Integer.toHexString(
                        0xff & b
                    );

                if (hex.length() == 1) {
                    hexString.append('0');
                }

                hexString.append(hex);
            }

            return hexString.toString();

        } catch (NoSuchAlgorithmException e) {

            throw new IllegalStateException(
                "SHA-256 algorithm is not available",
                e
            );
        }
    }

    /**
     * Contains both:
     *
     * 1. rawToken  -> sent to the browser
     * 2. refreshToken -> database entity containing only the hash
     */
    public record RefreshTokenResult(
        String rawToken,
        RefreshToken refreshToken
    ) {
    }
}