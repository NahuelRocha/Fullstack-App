package com.lambda.api.Security.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Lazy;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    private final SecurityContextRepository securityContextRepository;

    public JwtAuthenticationFilter(JwtService jwtService, UserDetailsService userDetailsService, @Lazy SecurityContextRepository securityContextRepository) {
        this.jwtService = jwtService;
        this.userDetailsService = userDetailsService;
        this.securityContextRepository = securityContextRepository;
    }


    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException
    {
        final String authHeader = request.getHeader("Authorization");
        System.out.println("Authorization Header: " + authHeader);
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            System.out.println("Auth header vino fallido: " + authHeader);
            filterChain.doFilter(request, response);
            return;
        }

            jwt = authHeader.substring(7);
            username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

                if (jwtService.isTokenValid(jwt, userDetails)) {

                    SecurityContext context = SecurityContextHolder.createEmptyContext();

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities());

                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // Establecer la autenticación explícitamente
                    context.setAuthentication(authToken);
                    SecurityContextHolder.setContext(context);
                    securityContextRepository.saveContext(context, request, response);
                    System.out.println("Explicit Authentication Set for: " + username);
                    System.out.println("Authorities: " + authToken.getAuthorities());
                } else {
                    System.out.println("Token validation failed for user: " + username);
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid token");
                }

            }

        filterChain.doFilter(request, response);
    }
}
