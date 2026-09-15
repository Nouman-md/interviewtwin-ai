package com.interviewtwin.config;

import com.interviewtwin.entity.User;
import com.interviewtwin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        if (email == null || email.isBlank()) {
            throw new UsernameNotFoundException(
                "Invalid authentication credentials"
            );
        }

        String normalizedEmail =
            email.trim().toLowerCase();

        User user = userRepository
            .findByEmail(normalizedEmail)
            .orElseThrow(() ->
                new UsernameNotFoundException(
                    "Invalid authentication credentials"
                )
            );

        return user;
    }
}