package com.interviewtwin.config;

import com.interviewtwin.security.JwtAuthenticationFilter;
import com.interviewtwin.security.JwtTokenProvider;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;


    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // =========================================================
    // AUTHENTICATION MANAGER
    // =========================================================

    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration config
    ) throws Exception {

        return config.getAuthenticationManager();
    }


    // =========================================================
    // JWT AUTHENTICATION FILTER
    // =========================================================

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {

        return new JwtAuthenticationFilter(
                jwtTokenProvider,
                userDetailsService
        );
    }


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain filterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // -------------------------------------------------
                // CSRF
                // -------------------------------------------------
                //
                // Normal API authentication uses:
                //
                // Authorization: Bearer <ACCESS_TOKEN>
                //
                // CSRF protection is therefore disabled for the
                // stateless Bearer-token API.
                //
                // IMPORTANT:
                // If the refresh-token endpoint authenticates
                // exclusively through an HttpOnly cookie, we will
                // apply dedicated CSRF protection to that endpoint
                // after reviewing the refresh implementation.
                // -------------------------------------------------

                .csrf(csrf -> csrf.disable())


                // -------------------------------------------------
                // CORS
                // -------------------------------------------------

                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )


                // -------------------------------------------------
                // STATELESS SESSION
                // -------------------------------------------------

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // -------------------------------------------------
                // SECURITY HEADERS
                // -------------------------------------------------

                .headers(headers -> headers

                        // Prevent MIME-type sniffing
                        .contentTypeOptions(
                                contentTypeOptions -> {
                                }
                        )

                        // Prevent clickjacking
                        .frameOptions(frameOptions ->
                                frameOptions.deny()
                        )

                        // Restrict referrer information
                        .referrerPolicy(referrerPolicy ->
                                referrerPolicy.policy(
                                        org.springframework.security.web.header.writers
                                                .ReferrerPolicyHeaderWriter
                                                .ReferrerPolicy
                                                .STRICT_ORIGIN_WHEN_CROSS_ORIGIN
                                )
                        )

                        // Restrict browser capabilities
                        .permissionsPolicy(permissionsPolicy ->
                                permissionsPolicy.policy(
                                        "camera=(), microphone=(), geolocation=()"
                                )
                        )
                )


                // -------------------------------------------------
                // AUTHORIZATION
                // -------------------------------------------------

                .authorizeHttpRequests(authorize -> authorize

                        // -----------------------------------------
                        // CORS preflight
                        // -----------------------------------------

                        .requestMatchers(
                                HttpMethod.OPTIONS,
                                "/**"
                        )
                        .permitAll()


                        // -----------------------------------------
                        // Authentication endpoints
                        // -----------------------------------------

                        .requestMatchers(
                                "/api/auth/**"
                        )
                        .permitAll()


                        // -----------------------------------------
                        // Public endpoints
                        // -----------------------------------------

                        .requestMatchers(
                                "/api/public/**"
                        )
                        .permitAll()


                        // -----------------------------------------
                        // Admin endpoints
                        // -----------------------------------------

                        .requestMatchers(
                                "/api/admin/**"
                        )
                        .hasRole("ADMIN")


                        // -----------------------------------------
                        // Everything else
                        // -----------------------------------------

                        .anyRequest()
                        .authenticated()
                )


                // -------------------------------------------------
                // AUTHENTICATION FAILURE RESPONSE
                // -------------------------------------------------

                .exceptionHandling(exception ->
                        exception.authenticationEntryPoint(
                                (request, response, authException) -> {

                                    response.setStatus(
                                            HttpStatus.UNAUTHORIZED.value()
                                    );

                                    response.setContentType(
                                            "application/json"
                                    );

                                    response.setCharacterEncoding(
                                            "UTF-8"
                                    );

                                    response.getWriter().write(
                                            "{\"success\":false,\"message\":\"Authentication required\"}"
                                    );
                                }
                        )
                )


                // -------------------------------------------------
                // JWT FILTER
                // -------------------------------------------------

                .addFilterBefore(
                        jwtAuthenticationFilter(),
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();


        // ---------------------------------------------------------
        // ALLOWED ORIGINS
        // ---------------------------------------------------------

        List<String> origins = Arrays.stream(
                        allowedOrigins.split(",")
                )
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .distinct()
                .toList();

        configuration.setAllowedOrigins(origins);


        // ---------------------------------------------------------
        // ALLOWED METHODS
        // ---------------------------------------------------------

        configuration.setAllowedMethods(
                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "PATCH",
                        "OPTIONS"
                )
        );


        // ---------------------------------------------------------
        // ALLOWED HEADERS
        // ---------------------------------------------------------

        configuration.setAllowedHeaders(
                List.of(
                        "Authorization",
                        "Content-Type",
                        "Accept",
                        "Origin"
                )
        );


        // ---------------------------------------------------------
        // EXPOSED HEADERS
        // ---------------------------------------------------------

        configuration.setExposedHeaders(
                List.of(
                        "Authorization"
                )
        );


        // ---------------------------------------------------------
        // CREDENTIALS
        // ---------------------------------------------------------

        configuration.setAllowCredentials(true);


        // ---------------------------------------------------------
        // PREFLIGHT CACHE
        // ---------------------------------------------------------

        configuration.setMaxAge(3600L);


        // ---------------------------------------------------------
        // REGISTER CORS CONFIGURATION
        // ---------------------------------------------------------

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration
        );


        return source;
    }
}