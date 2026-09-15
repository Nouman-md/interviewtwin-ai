package com.interviewtwin.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.util.StringUtils;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtAuthenticationFilter
        extends OncePerRequestFilter {


    private final JwtTokenProvider tokenProvider;

    private final UserDetailsService userDetailsService;


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {

            String jwt =
                    getJwtFromRequest(request);


            // -------------------------------------------------
            // JWT EXISTS
            // -------------------------------------------------

            if (
                    StringUtils.hasText(jwt)
                            &&
                    tokenProvider.validateToken(jwt)
            ) {

                String userEmail =
                        tokenProvider.getUserEmailFromToken(jwt);


                // -------------------------------------------------
                // DO NOT OVERRIDE EXISTING AUTHENTICATION
                // -------------------------------------------------

                if (
                        StringUtils.hasText(userEmail)
                                &&
                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()
                                == null
                ) {

                    UserDetails userDetails =
                            userDetailsService
                                    .loadUserByUsername(
                                            userEmail
                                    );


                    // -------------------------------------------------
                    // CREATE AUTHENTICATION
                    // -------------------------------------------------

                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails,
                                    null,
                                    userDetails.getAuthorities()
                            );


                    authentication.setDetails(
                            new WebAuthenticationDetailsSource()
                                    .buildDetails(request)
                    );


                    SecurityContextHolder
                            .getContext()
                            .setAuthentication(
                                    authentication
                            );
                }
            }

        } catch (Exception ex) {

            /*
             * Do not expose JWT validation details to the client.
             *
             * The request continues without authentication and
             * Spring Security will return 401 for protected
             * endpoints.
             */

            logger.debug(
                    "JWT authentication failed",
                    ex
            );
        }


        filterChain.doFilter(
                request,
                response
        );
    }


    // =========================================================
    // EXTRACT JWT
    // =========================================================

    private String getJwtFromRequest(
            HttpServletRequest request
    ) {

        String bearerToken =
                request.getHeader("Authorization");


        if (
                StringUtils.hasText(bearerToken)
                        &&
                bearerToken.regionMatches(
                        true,
                        0,
                        "Bearer ",
                        0,
                        7
                )
        ) {

            String token =
                    bearerToken.substring(7).trim();

            return StringUtils.hasText(token)
                    ? token
                    : null;
        }


        return null;
    }
}