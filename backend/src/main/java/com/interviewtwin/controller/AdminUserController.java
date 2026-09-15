package com.interviewtwin.controller;

import com.interviewtwin.dto.AdminUserDTO;
import com.interviewtwin.service.AdminUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<AdminUserDTO>> getAllUsers() {

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(adminUserService.getAllUsers());
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{userId}")
    public ResponseEntity<AdminUserDTO> getUserById(
            @PathVariable Long userId) {

        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(adminUserService.getUserById(userId));
    }

    // =========================================================
    // ACTIVATE USER
    // =========================================================

    @PatchMapping("/{userId}/activate")
    public ResponseEntity<AdminUserDTO> activateUser(
            @PathVariable Long userId) {

        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(adminUserService.activateUser(userId));
    }

    // =========================================================
    // DEACTIVATE USER
    // =========================================================

    @PatchMapping("/{userId}/deactivate")
    public ResponseEntity<AdminUserDTO> deactivateUser(
            @PathVariable Long userId) {

        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(adminUserService.deactivateUser(userId));
    }

    // =========================================================
    // VERIFY USER
    // =========================================================

    @PatchMapping("/{userId}/verify")
    public ResponseEntity<AdminUserDTO> verifyUser(
            @PathVariable Long userId) {

        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(adminUserService.verifyUser(userId));
    }

    // =========================================================
    // UNVERIFY USER
    // =========================================================

    @PatchMapping("/{userId}/unverify")
    public ResponseEntity<AdminUserDTO> unverifyUser(
            @PathVariable Long userId) {

        if (userId == null || userId <= 0) {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(adminUserService.unverifyUser(userId));
    }
}