package com.interviewtwin.service;

import com.interviewtwin.dto.UserDTO;
import com.interviewtwin.entity.User;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.tika.Tika;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private static final long MAX_PROFILE_PICTURE_SIZE =
            2L * 1024L * 1024L;

    private static final String JPEG = "image/jpeg";
    private static final String PNG = "image/png";
    private static final String WEBP = "image/webp";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    private static final Tika TIKA = new Tika();


    // =========================================================
    // GET USER
    // =========================================================

    public UserDTO getUserById(Long userId) {

        validateUserId(userId);

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        return convertToDTO(user);
    }


    // =========================================================
    // GET USER BY EMAIL
    // =========================================================

    public UserDTO getUserByEmail(String email) {

        if (email == null || email.isBlank()) {
            throw new RuntimeException(
                    "User not found");
        }

        String normalizedEmail =
                email.trim().toLowerCase(Locale.ROOT);

        User user =
                userRepository.findByEmail(
                                normalizedEmail)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        return convertToDTO(user);
    }


    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    public UserDTO updateUser(
            Long userId,
            UserDTO userDTO) {

        validateUserId(userId);

        if (userDTO == null) {
            throw new RuntimeException(
                    "Invalid profile data");
        }

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        /*
         * Only profile fields that the user is allowed to
         * change are copied from the DTO.
         *
         * IMPORTANT:
         * Do NOT copy email, role, verification state,
         * active state, timestamps, or profile picture URL
         * from client input.
         */

        if (userDTO.getFirstName() != null) {
            user.setFirstName(
                    userDTO.getFirstName().trim());
        }

        if (userDTO.getLastName() != null) {
            user.setLastName(
                    userDTO.getLastName().trim());
        }

        if (userDTO.getPhone() != null) {
            user.setPhone(
                    userDTO.getPhone().trim());
        }

        if (userDTO.getBio() != null) {
            user.setBio(
                    userDTO.getBio().trim());
        }

        if (userDTO.getCurrentRole() != null) {
            user.setCurrentRole(
                    userDTO.getCurrentRole().trim());
        }

        if (userDTO.getTargetRole() != null) {
            user.setTargetRole(
                    userDTO.getTargetRole().trim());
        }

        if (userDTO.getYearsOfExperience() != null) {

            if (userDTO.getYearsOfExperience() < 0) {
                throw new RuntimeException(
                        "Years of experience cannot be negative");
            }

            if (userDTO.getYearsOfExperience() > 100) {
                throw new RuntimeException(
                        "Invalid years of experience");
            }

            user.setYearsOfExperience(
                    userDTO.getYearsOfExperience());
        }

        /*
         * profilePictureUrl is intentionally NOT copied
         * from the request.
         *
         * It is controlled exclusively by the server.
         */

        User updatedUser =
                userRepository.save(user);

        return convertToDTO(updatedUser);
    }


    // =========================================================
    // PROFILE PICTURE
    // =========================================================

    /**
     * Upload profile picture and store it directly in MySQL.
     *
     * Maximum size: 2 MB
     *
     * Allowed formats:
     * - JPEG
     * - PNG
     * - WebP
     *
     * The actual file bytes are inspected instead of
     * trusting only MultipartFile.getContentType().
     */
    public UserDTO uploadProfilePicture(
            Long userId,
            MultipartFile file) {

        validateUserId(userId);

        if (file == null || file.isEmpty()) {
            throw new RuntimeException(
                    "Please select an image");
        }

        if (file.getSize() <= 0) {
            throw new RuntimeException(
                    "Invalid profile picture");
        }

        if (file.getSize() > MAX_PROFILE_PICTURE_SIZE) {
            throw new RuntimeException(
                    "Profile picture must be smaller than 2 MB");
        }

        /*
         * The browser-provided MIME type is not trusted.
         * We use the actual bytes below.
         */
        String detectedContentType;

        try {

            byte[] imageBytes =
                    file.getBytes();

            if (imageBytes.length == 0) {
                throw new RuntimeException(
                        "Invalid profile picture");
            }

            detectedContentType =
                    TIKA.detect(imageBytes);

            if (!isAllowedImageType(
                    detectedContentType)) {

                throw new RuntimeException(
                        "Only JPG, PNG and WebP images are allowed");
            }

            /*
             * Make sure the detected content type agrees
             * with the supported image formats.
             */
            detectedContentType =
                    normalizeImageContentType(
                            detectedContentType);

            User user =
                    userRepository.findById(userId)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "User not found"));

            user.setProfilePicture(
                    imageBytes);

            user.setProfilePictureContentType(
                    detectedContentType);

            /*
             * Server-controlled URL.
             */
            user.setProfilePictureUrl(
                    "/api/users/profile-picture");

            User updatedUser =
                    userRepository.save(user);

            return convertToDTO(updatedUser);

        } catch (RuntimeException e) {

            throw e;

        } catch (IOException e) {

            /*
             * Do not expose the underlying exception message.
             */
            throw new RuntimeException(
                    "Failed to process profile picture");
        }
    }


    // =========================================================
    // REMOVE PROFILE PICTURE
    // =========================================================

    public void removeProfilePicture(
            Long userId) {

        validateUserId(userId);

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        user.setProfilePicture(null);
        user.setProfilePictureContentType(null);
        user.setProfilePictureUrl(null);

        userRepository.save(user);
    }


    // =========================================================
    // GET PROFILE PICTURE
    // =========================================================

    @Transactional(readOnly = true)
    public User getUserWithProfilePicture(
            Long userId) {

        validateUserId(userId);

        return userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found"));
    }


    // =========================================================
    // PASSWORD
    // =========================================================

    public void changePassword(
            Long userId,
            String oldPassword,
            String newPassword) {

        validateUserId(userId);

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        if (oldPassword == null
                || oldPassword.isBlank()) {

            throw new RuntimeException(
                    "Old password is required");
        }

        if (newPassword == null
                || newPassword.isBlank()) {

            throw new RuntimeException(
                    "New password is required");
        }

        if (newPassword.length() < 6) {

            throw new RuntimeException(
                    "New password must be at least 6 characters");
        }

        if (newPassword.length() > 128) {

            throw new RuntimeException(
                    "New password is too long");
        }

        if (!passwordEncoder.matches(
                oldPassword,
                user.getPassword())) {

            throw new RuntimeException(
                    "Old password is incorrect");
        }

        /*
         * Prevent accidentally accepting the same password.
         */
        if (passwordEncoder.matches(
                newPassword,
                user.getPassword())) {

            throw new RuntimeException(
                    "New password must be different from the old password");
        }

        user.setPassword(
                passwordEncoder.encode(newPassword));

        userRepository.save(user);

        /*
         * IMPORTANT:
         * Any previously issued refresh token must no longer
         * be usable after a password change.
         */
        refreshTokenService.revokeAllUserTokens(user);
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    public void deleteUser(
            Long userId) {

        validateUserId(userId);

        User user =
                userRepository.findById(userId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User not found"));

        /*
         * Soft delete.
         */
        user.setIsActive(false);

        /*
         * Immediately invalidate all refresh sessions.
         */
        refreshTokenService.revokeAllUserTokens(user);

        userRepository.save(user);
    }


    // =========================================================
    // ACTIVE USERS
    // =========================================================

    public List<UserDTO> getAllActiveUsers() {

        return userRepository
                .findByIsActiveTrueAndIsVerifiedTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }


    // =========================================================
    // VALIDATE USER ID
    // =========================================================

    private void validateUserId(
            Long userId) {

        if (userId == null || userId <= 0) {
            throw new RuntimeException(
                    "Invalid user ID");
        }
    }


    // =========================================================
    // IMAGE TYPE VALIDATION
    // =========================================================

    private boolean isAllowedImageType(
            String contentType) {

        if (contentType == null) {
            return false;
        }

        String normalized =
                contentType
                        .trim()
                        .toLowerCase(Locale.ROOT);

        return JPEG.equals(normalized)
                || PNG.equals(normalized)
                || WEBP.equals(normalized);
    }


    // =========================================================
    // NORMALIZE IMAGE CONTENT TYPE
    // =========================================================

    private String normalizeImageContentType(
            String contentType) {

        if (contentType == null) {
            throw new RuntimeException(
                    "Invalid image type");
        }

        String normalized =
                contentType
                        .trim()
                        .toLowerCase(Locale.ROOT);

        if (JPEG.equals(normalized)) {
            return JPEG;
        }

        if (PNG.equals(normalized)) {
            return PNG;
        }

        if (WEBP.equals(normalized)) {
            return WEBP;
        }

        throw new RuntimeException(
                "Only JPG, PNG and WebP images are allowed");
    }


    // =========================================================
    // DTO CONVERSION
    // =========================================================

    private UserDTO convertToDTO(
            User user) {

        String firstName =
                user.getFirstName() != null
                        ? user.getFirstName()
                        : "";

        String lastName =
                user.getLastName() != null
                        ? user.getLastName()
                        : "";

        String fullName =
                user.getFullName() != null
                        && !user.getFullName().isBlank()
                        ? user.getFullName()
                        : (firstName + " " + lastName).trim();

        return UserDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(fullName)
                .phone(user.getPhone())
                .profilePictureUrl(
                        user.getProfilePictureUrl())
                .bio(user.getBio())
                .currentRole(
                        user.getCurrentRole())
                .targetRole(
                        user.getTargetRole())
                .yearsOfExperience(
                        user.getYearsOfExperience())
                .isVerified(
                        user.getIsVerified())
                .isActive(
                        user.getIsActive())
                .createdAt(
                        user.getCreatedAt())
                .updatedAt(
                        user.getUpdatedAt())
                .lastLogin(
                        user.getLastLogin())
                .build();
    }
}