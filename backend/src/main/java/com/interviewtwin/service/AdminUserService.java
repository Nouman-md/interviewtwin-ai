package com.interviewtwin.service;

import com.interviewtwin.dto.AdminUserDTO;
import com.interviewtwin.entity.User;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AdminUserService {

    private final UserRepository userRepository;
    private final RefreshTokenService refreshTokenService;

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @Transactional(readOnly = true)
    public List<AdminUserDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @Transactional(readOnly = true)
    public AdminUserDTO getUserById(Long userId) {

        validateUserId(userId);

        User user = getUserOrThrow(userId);

        return convertToDTO(user);
    }

    // =========================================================
    // ACTIVATE USER
    // =========================================================

    public AdminUserDTO activateUser(Long userId) {

        validateUserId(userId);

        User user = getUserOrThrow(userId);

        user.setIsActive(true);

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    // =========================================================
    // DEACTIVATE USER
    // =========================================================

    public AdminUserDTO deactivateUser(Long userId) {

        validateUserId(userId);

        User user = getUserOrThrow(userId);

        user.setIsActive(false);

        /*
         * Immediately invalidate all refresh tokens belonging
         * to the deactivated account.
         *
         * Existing short-lived access tokens will expire
         * normally, while refresh-token based reauthentication
         * is prevented immediately.
         */
        refreshTokenService.revokeAllUserTokens(user);

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    // =========================================================
    // VERIFY USER
    // =========================================================

    public AdminUserDTO verifyUser(Long userId) {

        validateUserId(userId);

        User user = getUserOrThrow(userId);

        user.setIsVerified(true);

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    // =========================================================
    // UNVERIFY USER
    // =========================================================

    public AdminUserDTO unverifyUser(Long userId) {

        validateUserId(userId);

        User user = getUserOrThrow(userId);

        user.setIsVerified(false);

        /*
         * Prevent the user from continuing to obtain new
         * sessions through refresh tokens after verification
         * has been revoked.
         */
        refreshTokenService.revokeAllUserTokens(user);

        User savedUser = userRepository.save(user);

        return convertToDTO(savedUser);
    }

    // =========================================================
    // FIND USER
    // =========================================================

    private User getUserOrThrow(Long userId) {

        return userRepository.findById(userId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );
    }

    // =========================================================
    // VALIDATE USER ID
    // =========================================================

    private void validateUserId(Long userId) {

        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException(
                    "Invalid user ID"
            );
        }
    }

    // =========================================================
    // ENTITY → DTO
    // =========================================================

    private AdminUserDTO convertToDTO(User user) {

        List<String> roles;

        if (user.getRoles() == null) {
            roles = Collections.emptyList();
        } else {
            roles = user.getRoles()
                    .stream()
                    .filter(role -> role != null)
                    .map(role -> role.getRoleName())
                    .filter(roleName -> roleName != null)
                    .sorted()
                    .collect(Collectors.toList());
        }

        return AdminUserDTO.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .phone(user.getPhone())
                .currentRole(user.getCurrentRole())
                .targetRole(user.getTargetRole())
                .yearsOfExperience(user.getYearsOfExperience())
                .isVerified(user.getIsVerified())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .lastLogin(user.getLastLogin())
                .roles(roles)
                .build();
    }
}