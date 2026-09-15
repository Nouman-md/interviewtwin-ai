package com.interviewtwin.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserDTO {

    private Long userId;

    private String email;

    private String firstName;

    private String lastName;

    private String fullName;

    private String phone;

    private String currentRole;

    private String targetRole;

    private Integer yearsOfExperience;

    private Boolean isVerified;

    private Boolean isActive;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private LocalDateTime lastLogin;

    private List<String> roles;
}