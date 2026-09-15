package com.interviewtwin.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {

    @Email(message = "Email should be valid")
    @NotBlank(message = "Email is required")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(
        min = 6,
        max = 128,
        message = "Password must be between 6 and 128 characters"
    )
    private String password;

    @NotBlank(message = "First name is required")
    @Size(
        max = 100,
        message = "First name must not exceed 100 characters"
    )
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(
        max = 100,
        message = "Last name must not exceed 100 characters"
    )
    private String lastName;

    @Size(
        max = 30,
        message = "Phone must not exceed 30 characters"
    )
    private String phone;

    @Size(
        max = 100,
        message = "Current role must not exceed 100 characters"
    )
    private String currentRole;

    @Size(
        max = 100,
        message = "Target role must not exceed 100 characters"
    )
    private String targetRole;

    @Min(
        value = 0,
        message = "Years of experience must be non-negative"
    )
    @Max(
        value = 100,
        message = "Years of experience must not exceed 100"
    )
    private Integer yearsOfExperience;
}