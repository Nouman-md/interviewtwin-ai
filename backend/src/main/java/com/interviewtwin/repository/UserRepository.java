package com.interviewtwin.repository;

import com.interviewtwin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    Optional<User> findByVerificationToken(String token);

    Optional<User> findByResetToken(String token);

    Boolean existsByEmail(String email);

    List<User> findByIsActiveTrueAndIsVerifiedTrue();

    List<User> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
