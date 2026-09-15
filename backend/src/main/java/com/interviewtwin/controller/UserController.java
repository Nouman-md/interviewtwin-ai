package com.interviewtwin.controller;

import com.interviewtwin.dto.UserDTO;
import com.interviewtwin.entity.User;
import com.interviewtwin.security.SecurityUtils;
import com.interviewtwin.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final SecurityUtils securityUtils;


    // =========================================================
    // GET PROFILE
    // =========================================================

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            Authentication authentication) {

        try {

            if (authentication == null
                    || !authentication.isAuthenticated()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message",
                                "Authentication required",
                                "success",
                                false
                        ));
            }

            String email = authentication.getName();

            if (email == null || email.isBlank()) {

                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of(
                                "message",
                                "Authentication required",
                                "success",
                                false
                        ));
            }

            UserDTO user =
                    userService.getUserByEmail(email);

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "User profile not found",
                            "success",
                            false
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to retrieve profile",
                            "success",
                            false
                    ));
        }
    }


    // =========================================================
    // GET USER
    // =========================================================

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(
            Authentication authentication,
            @PathVariable Long userId) {

        try {

            if (userId == null || userId <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Invalid user ID",
                                "success",
                                false
                        ));
            }

            /*
             * IMPORTANT:
             * Users must not be able to retrieve another
             * user's private profile by changing the URL ID.
             */
            Long currentUserId =
                    securityUtils.getCurrentUserId(
                            authentication);

            if (!currentUserId.equals(userId)) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "message",
                                "You can only access your own profile",
                                "success",
                                false
                        ));
            }

            UserDTO user =
                    userService.getUserById(userId);

            return ResponseEntity.ok(user);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "User not found",
                            "success",
                            false
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to retrieve user",
                            "success",
                            false
                    ));
        }
    }


    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(
            Authentication authentication,
            @PathVariable Long userId,
            @Valid @RequestBody UserDTO userDTO) {

        try {

            if (userId == null || userId <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Invalid user ID",
                                "success",
                                false
                        ));
            }

            Long currentUserId =
                    securityUtils.getCurrentUserId(
                            authentication);

            if (!currentUserId.equals(userId)) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "message",
                                "You can only update your own profile",
                                "success",
                                false
                        ));
            }

            if (userDTO == null) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Invalid profile data",
                                "success",
                                false
                        ));
            }

            /*
             * Never trust a client-provided user ID.
             * The authenticated path ID is authoritative.
             */
            userDTO.setUserId(userId);

            UserDTO updated =
                    userService.updateUser(
                            userId,
                            userDTO);

            return ResponseEntity.ok(updated);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Unable to update profile",
                            "success",
                            false
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to update profile",
                            "success",
                            false
                    ));
        }
    }


    // =========================================================
    // UPLOAD PROFILE PICTURE
    // =========================================================

    @PostMapping(
            value = "/profile-picture",
            consumes = MediaType.MULTIPART_FORM_DATA_VALUE
    )
    public ResponseEntity<?> uploadProfilePicture(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) {

        try {

            Long currentUserId =
                    securityUtils.getCurrentUserId(
                            authentication);

            if (file == null
                    || file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Profile picture is required",
                                "success",
                                false
                        ));
            }

            /*
             * The service performs the actual file validation.
             * Controller only rejects obviously invalid requests.
             */
            if (file.getSize() <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Invalid profile picture",
                                "success",
                                false
                        ));
            }

            UserDTO updated =
                    userService.uploadProfilePicture(
                            currentUserId,
                            file);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Profile picture uploaded successfully",
                            "success",
                            true,
                            "user",
                            updated
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Unable to upload profile picture",
                            "success",
                            false
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to upload profile picture",
                            "success",
                            false
                    ));
        }
    }


    // =========================================================
    // GET PROFILE PICTURE
    // =========================================================

    @GetMapping("/profile-picture")
    public ResponseEntity<?> getProfilePicture(
            Authentication authentication) {

        try {

            Long currentUserId =
                    securityUtils.getCurrentUserId(
                            authentication);

            User user =
                    userService.getUserWithProfilePicture(
                            currentUserId);

            if (user.getProfilePicture() == null
                    || user.getProfilePictureContentType() == null) {

                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(Map.of(
                                "message",
                                "Profile picture not found",
                                "success",
                                false
                        ));
            }

            /*
             * Only allow image content types.
             * This prevents a malicious database value from
             * turning this endpoint into an arbitrary content
             * response.
             */
            String contentType =
                    user.getProfilePictureContentType()
                            .trim()
                            .toLowerCase();

            if (!contentType.equals("image/jpeg")
                    && !contentType.equals("image/png")
                    && !contentType.equals("image/webp")) {

                return ResponseEntity
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of(
                                "message",
                                "Invalid profile picture format",
                                "success",
                                false
                        ));
            }

            MediaType mediaType =
                    MediaType.parseMediaType(
                            contentType);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(
                            HttpHeaders.CACHE_CONTROL,
                            "no-cache, no-store, must-revalidate"
                    )
                    .header(
                            HttpHeaders.PRAGMA,
                            "no-cache"
                    )
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "inline"
                    )
                    .body(user.getProfilePicture());

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(Map.of(
                            "message",
                            "Profile picture not found",
                            "success",
                            false
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to retrieve profile picture",
                            "success",
                            false
                    ));
        }
    }


    // =========================================================
    // REMOVE PROFILE PICTURE
    // =========================================================

    @DeleteMapping("/profile-picture")
    public ResponseEntity<?> removeProfilePicture(
            Authentication authentication) {

        try {

            Long currentUserId =
                    securityUtils.getCurrentUserId(
                            authentication);

            userService.removeProfilePicture(
                    currentUserId);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Profile picture removed successfully",
                            "success",
                            true
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Unable to remove profile picture",
                            "success",
                            false
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to remove profile picture",
                            "success",
                            false
                    ));
        }
    }


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {

        try {

            if (userId == null || userId <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Invalid user ID",
                                "success",
                                false
                        ));
            }

            Long currentUserId =
                    securityUtils.getCurrentUserId(
                            authentication);

            if (!currentUserId.equals(userId)) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "message",
                                "You can only change your own password",
                                "success",
                                false
                        ));
            }

            if (request == null) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Password data is required",
                                "success",
                                false
                        ));
            }

            String oldPassword =
                    request.get("oldPassword");

            String newPassword =
                    request.get("newPassword");

            if (oldPassword == null
                    || oldPassword.isBlank()
                    || newPassword == null
                    || newPassword.isBlank()) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Current and new passwords are required",
                                "success",
                                false
                        ));
            }

            /*
             * Never log or return either password.
             */
            userService.changePassword(
                    userId,
                    oldPassword,
                    newPassword);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Password changed successfully",
                            "success",
                            true
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Unable to change password",
                            "success",
                            false
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to change password",
                            "success",
                            false
                    ));
        }
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deleteUser(
            Authentication authentication,
            @PathVariable Long userId) {

        try {

            if (userId == null || userId <= 0) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "message",
                                "Invalid user ID",
                                "success",
                                false
                        ));
            }

            Long currentUserId =
                    securityUtils.getCurrentUserId(
                            authentication);

            if (!currentUserId.equals(userId)) {

                return ResponseEntity
                        .status(HttpStatus.FORBIDDEN)
                        .body(Map.of(
                                "message",
                                "You can only delete your own account",
                                "success",
                                false
                        ));
            }

            userService.deleteUser(userId);

            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "User deleted successfully",
                            "success",
                            true
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "message",
                            "Unable to delete account",
                            "success",
                            false
                    ));

        } catch (Exception e) {

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "message",
                            "Failed to delete account",
                            "success",
                            false
                    ));
        }
    }
}