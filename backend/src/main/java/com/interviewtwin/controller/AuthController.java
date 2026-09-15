package com.interviewtwin.controller;

import com.interviewtwin.dto.AuthRequest;
import com.interviewtwin.dto.AuthResponse;
import com.interviewtwin.dto.RegisterRequest;
import com.interviewtwin.dto.ResetPasswordRequest;
import com.interviewtwin.entity.RefreshToken;
import com.interviewtwin.entity.User;
import com.interviewtwin.repository.UserRepository;
import com.interviewtwin.security.JwtTokenProvider;
import com.interviewtwin.service.AuthService;
import com.interviewtwin.service.RefreshTokenService;
import com.interviewtwin.service.VerificationCodeService;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;
    private final JwtTokenProvider jwtTokenProvider;
    private final VerificationCodeService verificationCodeService;
    private final UserRepository userRepository;

    /*
     * Local development:
     * APP_COOKIE_SECURE=false
     *
     * Production HTTPS:
     * APP_COOKIE_SECURE=true
     */
    @Value("${app.cookie.secure:false}")
    private boolean secureCookie;


    // =========================================================
    // REGISTER
    // =========================================================

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {

        try {

            AuthResponse response =
                    authService.register(request);

            if (response.getSuccess()) {

                return ResponseEntity
                        .status(HttpStatus.CREATED)
                        .body(response);
            }

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(response);

        } catch (Exception e) {

            log.error(
                    "Registration error: {}",
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message("Registration failed")
                                    .build()
                    );
        }
    }


    // =========================================================
    // VERIFY EMAIL
    // =========================================================

    @PostMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(
            @RequestParam String email,
            @RequestParam String code
    ) {

        try {

            verificationCodeService.verifyCode(
                    email,
                    code,
                    "EMAIL_VERIFICATION"
            );

            User user =
                    userRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            user.setIsVerified(true);
            userRepository.save(user);

            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .success(true)
                            .message(
                                    "Email verified successfully"
                            )
                            .build()
            );

        } catch (Exception e) {

            log.error(
                    "Email verification failed for {}: {}",
                    email,
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message(e.getMessage())
                                    .build()
                    );
        }
    }


    // =========================================================
    // RESEND EMAIL VERIFICATION CODE
    // =========================================================

    @PostMapping("/resend-verification")
    public ResponseEntity<AuthResponse> resendVerification(
            @RequestParam String email
    ) {

        try {

            User user =
                    userRepository.findByEmail(email)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"
                                    )
                            );

            if (user.getIsVerified()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                AuthResponse.builder()
                                        .success(false)
                                        .message(
                                                "Email is already verified"
                                        )
                                        .build()
                        );
            }

            verificationCodeService
                    .sendVerificationCode(email);

            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .success(true)
                            .message(
                                    "Verification code sent successfully"
                            )
                            .build()
            );

        } catch (Exception e) {

            log.error(
                    "Failed to resend verification code to {}: {}",
                    email,
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message(
                                            "Failed to send verification code"
                                    )
                                    .build()
                    );
        }
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody AuthRequest request,
            HttpServletResponse response
    ) {

        try {

            AuthResponse authResponse =
                    authService.login(request);

            if (authResponse.getSuccess()) {

                /*
                 * Refresh token is stored only in a secure
                 * HttpOnly cookie.
                 *
                 * SameSite=Lax provides browser-level
                 * CSRF protection.
                 */
                addRefreshCookie(
                        response,
                        authResponse.getRefreshToken(),
                        7 * 24 * 60 * 60
                );

                /*
                 * Never expose the refresh token in JSON.
                 */
                authResponse.setRefreshToken(null);

                return ResponseEntity.ok(authResponse);
            }

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(authResponse);

        } catch (Exception e) {

            log.error(
                    "Login error: {}",
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message("Login failed")
                                    .build()
                    );
        }
    }


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    @PostMapping("/forgot-password")
    public ResponseEntity<AuthResponse> forgotPassword(
            @RequestParam String email
    ) {

        try {

            AuthResponse response =
                    authService.forgotPassword(email);

            return ResponseEntity.ok(response);

        } catch (Exception e) {

            log.error(
                    "Forgot password error for {}: {}",
                    email,
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message(
                                            "Unable to process password reset request"
                                    )
                                    .build()
                    );
        }
    }


    // =========================================================
    // VERIFY PASSWORD RESET CODE
    // =========================================================

    @PostMapping("/verify-reset-code")
    public ResponseEntity<AuthResponse> verifyResetCode(
            @RequestParam String email,
            @RequestParam String code
    ) {

        try {

            AuthResponse response =
                    authService.verifyResetCode(
                            email,
                            code
                    );

            if (response.getSuccess()) {

                return ResponseEntity.ok(response);
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);

        } catch (Exception e) {

            log.error(
                    "Reset code verification error for {}: {}",
                    email,
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message(
                                            "Invalid or expired reset code"
                                    )
                                    .build()
                    );
        }
    }


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @PostMapping("/reset-password")
    public ResponseEntity<AuthResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request
    ) {

        try {

            AuthResponse response =
                    authService.resetPassword(
                            request.getEmail(),
                            request.getResetToken(),
                            request.getNewPassword()
                    );

            if (response.getSuccess()) {

                return ResponseEntity.ok(response);
            }

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);

        } catch (Exception e) {

            log.error(
                    "Password reset error for {}: {}",
                    request.getEmail(),
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message(
                                            "Unable to reset password"
                                    )
                                    .build()
                    );
        }
    }


    // =========================================================
    // REFRESH TOKEN
    // =========================================================

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refreshToken(
            @CookieValue(
                    value = "refreshToken",
                    required = false
            )
            String refreshToken,
            HttpServletResponse response
    ) {

        try {

            if (
                    refreshToken == null ||
                    refreshToken.isBlank()
            ) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(
                                AuthResponse.builder()
                                        .success(false)
                                        .message(
                                                "Refresh token is missing"
                                        )
                                        .build()
                        );
            }


            // -------------------------------------------------
            // ROTATE REFRESH TOKEN
            // -------------------------------------------------

            RefreshTokenService.RefreshTokenResult rotatedResult =
                    refreshTokenService.rotateRefreshToken(
                            refreshToken
                    );


            // -------------------------------------------------
            // GET USER FROM ROTATED TOKEN
            // -------------------------------------------------

            RefreshToken rotatedToken =
                    rotatedResult.refreshToken();


            // -------------------------------------------------
            // GENERATE NEW ACCESS TOKEN
            // -------------------------------------------------

            String newAccessToken =
                    jwtTokenProvider.generateToken(
                            new UsernamePasswordAuthenticationToken(
                                    rotatedToken.getUser().getEmail(),
                                    null,
                                    rotatedToken.getUser().getAuthorities()
                            )
                    );


            // -------------------------------------------------
            // SEND NEW REFRESH TOKEN COOKIE
            // -------------------------------------------------

            addRefreshCookie(
                    response,
                    rotatedResult.rawToken(),
                    7 * 24 * 60 * 60
            );


            // -------------------------------------------------
            // RETURN ONLY NEW ACCESS TOKEN
            // -------------------------------------------------

            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .token(newAccessToken)
                            .type("Bearer")
                            .success(true)
                            .message(
                                    "Token refreshed successfully"
                            )
                            .build()
            );

        } catch (Exception e) {

            log.error(
                    "Refresh token failed: {}",
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message(
                                            "Invalid or expired refresh token"
                                    )
                                    .build()
                    );
        }
    }


    // =========================================================
    // LOGOUT
    // =========================================================

    @PostMapping("/logout")
    public ResponseEntity<AuthResponse> logout(
            @CookieValue(
                    value = "refreshToken",
                    required = false
            )
            String refreshToken,
            HttpServletResponse response
    ) {

        try {

            if (
                    refreshToken != null &&
                    !refreshToken.isBlank()
            ) {

                refreshTokenService
                        .revokeToken(refreshToken);
            }


            // -------------------------------------------------
            // CLEAR REFRESH TOKEN COOKIE
            // -------------------------------------------------

            addRefreshCookie(
                    response,
                    "",
                    0
            );


            return ResponseEntity.ok(
                    AuthResponse.builder()
                            .success(true)
                            .message("Logout successful")
                            .build()
            );

        } catch (Exception e) {

            log.error(
                    "Logout error: {}",
                    e.getMessage()
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(
                            AuthResponse.builder()
                                    .success(false)
                                    .message("Logout failed")
                                    .build()
                    );
        }
    }


    // =========================================================
    // REFRESH COOKIE HELPER
    // =========================================================

    /**
     * Creates the refresh-token cookie with consistent
     * security attributes.
     *
     * HttpOnly:
     * Prevents JavaScript from reading the refresh token.
     *
     * Secure:
     * Controlled by APP_COOKIE_SECURE.
     *
     * Local HTTP:
     * false
     *
     * Production HTTPS:
     * true
     *
     * SameSite:
     * Lax
     *
     * Path:
     * /api/auth
     */
    private void addRefreshCookie(
            HttpServletResponse response,
            String token,
            long maxAge
    ) {

        ResponseCookie cookie =
                ResponseCookie
                        .from(
                                "refreshToken",
                                token == null ? "" : token
                        )
                        .httpOnly(true)
                        .secure(secureCookie)
                        .sameSite("Lax")
                        .path("/api/auth")
                        .maxAge(maxAge)
                        .build();

        response.addHeader(
                "Set-Cookie",
                cookie.toString()
        );
    }
}