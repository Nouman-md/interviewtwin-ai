package com.interviewtwin.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private static final String TOKEN_TYPE_CLAIM = "token_type";

    private static final String ACCESS_TOKEN = "ACCESS";
    private static final String REFRESH_TOKEN = "REFRESH";

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    @Value("${jwt.refresh-expiration}")
    private long refreshTokenExpirationMs;


    // =========================================================
    // SECRET KEY
    // =========================================================

    private SecretKey getSigningKey() {

        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException(
                    "JWT secret is missing"
            );
        }

        byte[] secretBytes =
                jwtSecret.getBytes(StandardCharsets.UTF_8);

        /*
         * HS512 requires a minimum key size of
         * 512 bits = 64 bytes.
         */
        if (secretBytes.length < 64) {
            throw new IllegalStateException(
                    "JWT secret must be at least 64 bytes for HS512"
            );
        }

        return Keys.hmacShaKeyFor(secretBytes);
    }


    // =========================================================
    // ACCESS TOKEN
    // =========================================================

    public String generateToken(Authentication authentication) {

        String userEmail = authentication.getName();

        Date now = new Date();

        Date expiryDate =
                new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(userEmail)
                .claim(TOKEN_TYPE_CLAIM, ACCESS_TOKEN)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(
                        getSigningKey(),
                        Jwts.SIG.HS512
                )
                .compact();
    }


    // =========================================================
    // REFRESH TOKEN
    // =========================================================

    public String generateRefreshToken(
            Authentication authentication
    ) {

        String userEmail = authentication.getName();

        Date now = new Date();

        Date expiryDate =
                new Date(
                        now.getTime()
                                + refreshTokenExpirationMs
                );

        return Jwts.builder()
                .subject(userEmail)
                .claim(TOKEN_TYPE_CLAIM, REFRESH_TOKEN)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(
                        getSigningKey(),
                        Jwts.SIG.HS512
                )
                .compact();
    }


    // =========================================================
    // EXTRACT USER EMAIL
    // =========================================================

    public String getUserEmailFromToken(String token) {

        Claims claims =
                Jwts.parser()
                        .verifyWith(getSigningKey())
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();

        return claims.getSubject();
    }


    // =========================================================
    // VALIDATE ACCESS TOKEN
    // =========================================================

    public boolean validateToken(String token) {

        try {

            if (token == null || token.isBlank()) {
                return false;
            }

            Claims claims =
                    Jwts.parser()
                            .verifyWith(getSigningKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

            String tokenType =
                    claims.get(
                            TOKEN_TYPE_CLAIM,
                            String.class
                    );

            return ACCESS_TOKEN.equals(tokenType);

        } catch (Exception e) {

            return false;
        }
    }


    // =========================================================
    // VALIDATE REFRESH TOKEN
    // =========================================================

    public boolean validateRefreshToken(String token) {

        try {

            if (token == null || token.isBlank()) {
                return false;
            }

            Claims claims =
                    Jwts.parser()
                            .verifyWith(getSigningKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

            String tokenType =
                    claims.get(
                            TOKEN_TYPE_CLAIM,
                            String.class
                    );

            return REFRESH_TOKEN.equals(tokenType);

        } catch (Exception e) {

            return false;
        }
    }


    // =========================================================
    // CHECK TOKEN TYPE
    // =========================================================

    public boolean isRefreshToken(String token) {

        try {

            if (token == null || token.isBlank()) {
                return false;
            }

            Claims claims =
                    Jwts.parser()
                            .verifyWith(getSigningKey())
                            .build()
                            .parseSignedClaims(token)
                            .getPayload();

            String tokenType =
                    claims.get(
                            TOKEN_TYPE_CLAIM,
                            String.class
                    );

            return REFRESH_TOKEN.equals(tokenType);

        } catch (Exception e) {

            return false;
        }
    }
}