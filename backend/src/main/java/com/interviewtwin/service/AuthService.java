package com.interviewtwin.service;

import com.interviewtwin.dto.AuthRequest;
import com.interviewtwin.dto.AuthResponse;
import com.interviewtwin.dto.RegisterRequest;
import com.interviewtwin.entity.RefreshToken;
import com.interviewtwin.entity.Role;
import com.interviewtwin.entity.User;
import com.interviewtwin.repository.RoleRepository;
import com.interviewtwin.repository.UserRepository;
import com.interviewtwin.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final PerformanceService performanceService;
    private final RefreshTokenService refreshTokenService;
    private final VerificationCodeService verificationCodeService;

    private final SecureRandom secureRandom = new SecureRandom();

    // =========================================================
    // REGISTER
    // =========================================================

    public AuthResponse register(RegisterRequest request) {

        if (request == null || request.getEmail() == null) {
            return AuthResponse.builder()
                .success(false)
                .message("Invalid registration request")
                .build();
        }

        String email = request.getEmail().trim().toLowerCase();

        if (email.isBlank()) {
            return AuthResponse.builder()
                .success(false)
                .message("Invalid registration request")
                .build();
        }

        if (userRepository.existsByEmail(email)) {
            return AuthResponse.builder()
                .success(false)
                .message("Email already exists")
                .build();
        }

        User user = User.builder()
            .email(email)
            .password(passwordEncoder.encode(request.getPassword()))
            .firstName(request.getFirstName())
            .lastName(request.getLastName())
            .phone(request.getPhone())
            .currentRole(request.getCurrentRole())
            .targetRole(request.getTargetRole())
            .yearsOfExperience(
                request.getYearsOfExperience() != null
                    ? request.getYearsOfExperience()
                    : 0
            )
            .isActive(true)
            .isVerified(false)
            .build();

        Role userRole = roleRepository.findByRoleName("USER")
            .orElseGet(() ->
                roleRepository.save(
                    Role.builder()
                        .roleName("USER")
                        .description("Regular user role")
                        .build()
                )
            );

        user.setRoles(new HashSet<>(Set.of(userRole)));

        User savedUser = userRepository.save(user);

        // -----------------------------------------------------
        // SEND EMAIL VERIFICATION CODE
        // -----------------------------------------------------

        try {
            verificationCodeService.sendVerificationCode(
                savedUser.getEmail()
            );
        } catch (Exception e) {
            log.error(
                "Failed to send verification code after registration",
                e
            );
        }

        // -----------------------------------------------------
        // INITIALIZE PERFORMANCE
        // -----------------------------------------------------

        try {
            performanceService.initializePerformance(
                savedUser.getUserId()
            );
        } catch (Exception e) {
            log.error(
                "Failed to initialize performance for newly registered user",
                e
            );
        }

        return AuthResponse.builder()
            .success(true)
            .message("User registered successfully")
            .userId(savedUser.getUserId())
            .email(savedUser.getEmail())
            .firstName(savedUser.getFirstName())
            .lastName(savedUser.getLastName())
            .build();
    }

    // =========================================================
    // LOGIN
    // =========================================================

    public AuthResponse login(AuthRequest request) {

        if (request == null ||
            request.getEmail() == null ||
            request.getPassword() == null) {

            return AuthResponse.builder()
                .success(false)
                .message("Invalid email or password")
                .build();
        }

        String email = request.getEmail().trim().toLowerCase();

        try {

            /*
             * Authenticate exactly once.
             *
             * AuthenticationManager performs the password check
             * through Spring Security's configured UserDetailsService
             * and PasswordEncoder.
             */
            Authentication authentication =
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                    )
                );

            User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException("Authentication failed")
                );

            // -------------------------------------------------
            // ACCOUNT STATUS
            // -------------------------------------------------

            if (!user.getIsActive()) {
                return AuthResponse.builder()
                    .success(false)
                    .message("Invalid email or password")
                    .build();
            }

            // -------------------------------------------------
            // EMAIL VERIFICATION
            // -------------------------------------------------

            if (!user.getIsVerified()) {
                return AuthResponse.builder()
                    .success(false)
                    .message(
                        "Please verify your email before logging in"
                    )
                    .build();
            }

            // -------------------------------------------------
            // ACCESS TOKEN
            // -------------------------------------------------

            String token =
                jwtTokenProvider.generateToken(authentication);

            // -------------------------------------------------
            // REFRESH TOKEN
            // -------------------------------------------------

            RefreshTokenService.RefreshTokenResult
                refreshTokenResult =
                    refreshTokenService.createRefreshToken(email);

            String refreshToken =
                refreshTokenResult.rawToken();

            // -------------------------------------------------
            // LAST LOGIN
            // -------------------------------------------------

            user.setLastLogin(LocalDateTime.now());
            userRepository.save(user);

            return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .type("Bearer")
                .success(true)
                .userId(user.getUserId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .message("Login successful")
                .build();

      } catch (Exception e) {

    /*
     * TEMPORARY DIAGNOSTIC LOGGING
     *
     * Never log the password, JWT, refresh token,
     * or other authentication credentials.
     */
    log.warn(
        "Authentication failed: {} - {}",
        e.getClass().getSimpleName(),
        e.getMessage()
    );

    return AuthResponse.builder()
        .success(false)
        .message("Invalid email or password")
        .build();
}
    }

    // =========================================================
    // FORGOT PASSWORD - SEND CODE
    // =========================================================

    public AuthResponse forgotPassword(String email) {

        final String genericResponse =
            "If an account exists with this email, " +
            "a password reset code has been sent.";

        try {

            if (email == null || email.isBlank()) {
                return AuthResponse.builder()
                    .success(true)
                    .message(genericResponse)
                    .build();
            }

            email = email.trim().toLowerCase();

            User user = userRepository
                .findByEmail(email)
                .orElse(null);

            /*
             * Always return the same response for:
             * - unknown email
             * - inactive account
             * - valid account
             *
             * This prevents account enumeration.
             */
            if (user == null || !user.getIsActive()) {
                return AuthResponse.builder()
                    .success(true)
                    .message(genericResponse)
                    .build();
            }

            // Clear previous reset-token state.
            user.setResetToken(null);
            user.setResetTokenExpiry(null);
            userRepository.save(user);

            verificationCodeService.sendPasswordResetCode(email);

            return AuthResponse.builder()
                .success(true)
                .message(genericResponse)
                .build();

        } catch (Exception e) {

            log.error(
                "Password reset request processing failed",
                e
            );

            /*
             * Keep the external response generic.
             */
            return AuthResponse.builder()
                .success(true)
                .message(genericResponse)
                .build();
        }
    }

    // =========================================================
    // VERIFY PASSWORD RESET CODE
    // =========================================================

    public AuthResponse verifyResetCode(
        String email,
        String code
    ) {

        try {

            if (email == null ||
                email.isBlank() ||
                code == null ||
                code.isBlank()) {

                return invalidResetCodeResponse();
            }

            email = email.trim().toLowerCase();
            code = code.trim();

            User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Invalid or expired reset code"
                    )
                );

            if (!user.getIsActive()) {
                return invalidResetCodeResponse();
            }

            // -------------------------------------------------
            // VERIFY 6-DIGIT PASSWORD RESET CODE
            // -------------------------------------------------

            verificationCodeService.verifyCode(
                email,
                code,
                "PASSWORD_RESET"
            );

            // -------------------------------------------------
            // GENERATE TEMPORARY RESET TOKEN
            // -------------------------------------------------

            String resetToken = generateSecureResetToken();

            user.setResetToken(resetToken);

            user.setResetTokenExpiry(
                LocalDateTime.now().plusMinutes(10)
            );

            userRepository.save(user);

            return AuthResponse.builder()
                .success(true)
                .message("Reset code verified successfully")
                .email(email)
                .resetToken(resetToken)
                .build();

        } catch (Exception e) {

            /*
             * Never return e.getMessage().
             * Internal exception messages can reveal implementation
             * details or database/security information.
             */
            log.warn(
                "Password reset code verification failed"
            );

            return invalidResetCodeResponse();
        }
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    public AuthResponse resetPassword(
        String email,
        String resetToken,
        String newPassword
    ) {

        try {

            // -------------------------------------------------
            // BASIC VALIDATION
            // -------------------------------------------------

            if (email == null ||
                email.isBlank() ||
                resetToken == null ||
                resetToken.isBlank() ||
                newPassword == null ||
                newPassword.length() < 6) {

                return AuthResponse.builder()
                    .success(false)
                    .message(
                        "Invalid password reset request"
                    )
                    .build();
            }

            email = email.trim().toLowerCase();
            resetToken = resetToken.trim();

            // -------------------------------------------------
            // FIND USER
            // -------------------------------------------------

            User user = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                    new RuntimeException(
                        "Invalid password reset request"
                    )
                );

            if (!user.getIsActive()) {
                return invalidResetRequestResponse();
            }

            // -------------------------------------------------
            // CHECK RESET TOKEN
            // -------------------------------------------------

            if (user.getResetToken() == null ||
                !constantTimeEquals(
                    user.getResetToken(),
                    resetToken
                )) {

                return invalidResetRequestResponse();
            }

            // -------------------------------------------------
            // CHECK TOKEN EXPIRY
            // -------------------------------------------------

            if (user.getResetTokenExpiry() == null ||
                !user.getResetTokenExpiry()
                    .isAfter(LocalDateTime.now())) {

                clearResetToken(user);

                return AuthResponse.builder()
                    .success(false)
                    .message(
                        "Password reset request has expired"
                    )
                    .build();
            }

            // -------------------------------------------------
            // SET NEW PASSWORD
            // -------------------------------------------------

            user.setPassword(
                passwordEncoder.encode(newPassword)
            );

            // -------------------------------------------------
            // INVALIDATE RESET TOKEN
            // -------------------------------------------------

            clearResetToken(user);

            userRepository.save(user);

            // -------------------------------------------------
            // SECURITY: INVALIDATE EXISTING SESSIONS
            // -------------------------------------------------

            /*
             * A password reset should terminate existing refresh
             * sessions. This prevents an attacker who already has
             * a refresh token from keeping access after the password
             * has been changed.
             */
            refreshTokenService.revokeAllUserTokens(user);

            return AuthResponse.builder()
                .success(true)
                .message("Password reset successfully")
                .build();

        } catch (Exception e) {

            log.error(
                "Password reset processing failed",
                e
            );

            return AuthResponse.builder()
                .success(false)
                .message("Unable to reset password")
                .build();
        }
    }

    // =========================================================
    // SECURITY HELPERS
    // =========================================================

    /**
     * Generates a cryptographically secure temporary reset token.
     *
     * 32 random bytes = 256 bits of entropy.
     */
    private String generateSecureResetToken() {

        byte[] randomBytes = new byte[32];

        secureRandom.nextBytes(randomBytes);

        return Base64.getUrlEncoder()
            .withoutPadding()
            .encodeToString(randomBytes);
    }

    /**
     * Constant-time comparison helps avoid timing differences
     * during reset-token comparison.
     */
    private boolean constantTimeEquals(
        String expected,
        String provided
    ) {

        if (expected == null || provided == null) {
            return false;
        }

        byte[] expectedBytes =
            expected.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        byte[] providedBytes =
            provided.getBytes(java.nio.charset.StandardCharsets.UTF_8);

        return java.security.MessageDigest.isEqual(
            expectedBytes,
            providedBytes
        );
    }

    private void clearResetToken(User user) {

        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        userRepository.save(user);
    }

    private AuthResponse invalidResetCodeResponse() {

        return AuthResponse.builder()
            .success(false)
            .message("Invalid or expired reset code")
            .build();
    }

    private AuthResponse invalidResetRequestResponse() {

        return AuthResponse.builder()
            .success(false)
            .message("Invalid or expired reset request")
            .build();
    }
}