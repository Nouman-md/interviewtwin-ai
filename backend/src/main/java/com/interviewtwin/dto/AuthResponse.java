package com.interviewtwin.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponse {

    private String token;

    private String refreshToken;

    private String type = "Bearer";

    private Long userId;

    private String email;

    private String firstName;

    private String lastName;

    private String message;

    private Boolean success;

    // Temporary token used only during password reset
    private String resetToken;
}