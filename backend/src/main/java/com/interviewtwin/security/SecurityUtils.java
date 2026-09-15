package com.interviewtwin.security;

import com.interviewtwin.entity.User;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
@RequiredArgsConstructor
public class SecurityUtils {

    private static final int MAX_EMAIL_LENGTH = 255;

    private final UserRepository userRepository;

    /**
     * Gets the authenticated user's database ID.
     *
     * The JWT subject is the user's email.
     * The email is obtained only from Spring Security's
     * authenticated Authentication object.
     *
     * No user ID is accepted from request parameters,
     * path variables, or request bodies.
     */
    public Long getCurrentUserId(Authentication authentication) {

        User user = getCurrentUser(authentication);

        Long userId = user.getUserId();

        if (userId == null || userId <= 0) {
            throw new SecurityException("Invalid authenticated user");
        }

        return userId;
    }

    /**
     * Gets the authenticated User entity.
     */
    public User getCurrentUser(Authentication authentication) {

        validateAuthentication(authentication);

        String email = authentication.getName();

        if (email == null) {
            throw new SecurityException("Invalid authentication");
        }

        String normalizedEmail = email.trim()
            .toLowerCase(Locale.ROOT);

        if (normalizedEmail.isBlank()
            || normalizedEmail.length() > MAX_EMAIL_LENGTH) {

            throw new SecurityException("Invalid authentication");
        }

        return userRepository
            .findByEmail(normalizedEmail)
            .orElseThrow(() ->
                new SecurityException("Authenticated user not found")
            );
    }

    /**
     * Ensures the request has a genuine authenticated principal.
     *
     * AnonymousAuthenticationToken is explicitly rejected because
     * Spring Security can consider anonymous authentication
     * "authenticated" at the Authentication API level.
     */
    private void validateAuthentication(
        Authentication authentication
    ) {

        if (authentication == null
            || !authentication.isAuthenticated()
            || authentication instanceof AnonymousAuthenticationToken) {

            throw new SecurityException("Authentication required");
        }
    }
}