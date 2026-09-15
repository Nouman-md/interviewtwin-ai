package com.interviewtwin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_email", columnList = "email"),
    @Index(name = "idx_created_at", columnList = "created_at")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {
    "roles",
    "resumes",
    "interviewSessions",
    "codingSubmissions",
    "performance",
    "profilePicture"
})
@EqualsAndHashCode(exclude = {
    "roles",
    "resumes",
    "interviewSessions",
    "codingSubmissions",
    "performance",
    "profilePicture"
})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String phone;

    /*
     * Profile picture URL
     *
     * Kept for compatibility with the existing UserDTO.
     * We will use this later for the backend profile-picture endpoint.
     */
    private String profilePictureUrl;

    /*
     * Profile picture stored directly in MySQL.
     */
    @Lob
    @Column(
        name = "profile_picture",
        columnDefinition = "LONGBLOB"
    )
    @JsonIgnore
    private byte[] profilePicture;

    /*
     * Stores the MIME type of the uploaded image.
     * Examples:
     * image/jpeg
     * image/png
     * image/webp
     */
    @Column(name = "profile_picture_content_type")
    private String profilePictureContentType;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String currentRole;

    private String targetRole;

    @Builder.Default
    private Integer yearsOfExperience = 0;

    @Builder.Default
    private Boolean isVerified = false;

    private String verificationToken;

    private String resetToken;

    private LocalDateTime resetTokenExpiry;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @Builder.Default
    private Boolean isActive = true;

    private LocalDateTime lastLogin;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "user_roles",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    @JsonIgnore
    private Set<Role> roles = new HashSet<>();

    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<Resume> resumes = new ArrayList<>();

    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<InterviewSession> interviewSessions = new ArrayList<>();

    @OneToMany(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    @JsonIgnore
    private List<CodingSubmission> codingSubmissions = new ArrayList<>();

    @OneToOne(
        mappedBy = "user",
        cascade = CascadeType.ALL,
        fetch = FetchType.LAZY
    )
    @JsonIgnore
    private Performance performance;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
            .map(role ->
                new SimpleGrantedAuthority(
                    "ROLE_" + role.getRoleName()
                )
            )
            .toList();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return isActive;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive;
    }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}