package com.lambda.api.Security;

import com.lambda.api.Security.jwt.JwtAuthenticationFilter;
import com.lambda.api.Utils.FrontendURL;
import com.lambda.api.Utils.FunctionURL;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.context.DelegatingSecurityContextRepository;
import org.springframework.security.web.context.RequestAttributeSecurityContextRepository;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.web.util.matcher.OrRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;


@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final FunctionURL functionURL;
    private final FrontendURL frontendURL;


    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, FunctionURL functionURL, FrontendURL frontendURL) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.functionURL = functionURL;
        this.frontendURL = frontendURL;
    }


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(functionURL.getFunctionURL(), frontendURL.getFrontendURL(), "http://localhost:5173/"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE","PATCH"));
        configuration.setAllowedHeaders(Arrays.asList(
                "Authorization",
                "Content-Type",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
        ));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    RequestMatcher publicUrls = new OrRequestMatcher(
            new AntPathRequestMatcher("/api/user/login"),
            new AntPathRequestMatcher("/api/business/info"),
            new AntPathRequestMatcher("/api/banner"),
            new AntPathRequestMatcher("/api/category/all"),
            new AntPathRequestMatcher("/api/menu/all"),
            new AntPathRequestMatcher("/api/product"),
            new AntPathRequestMatcher("/api/about", "GET")
    );
    RequestMatcher adminUrls = new OrRequestMatcher(
            new AntPathRequestMatcher("/api/user/create"),
            new AntPathRequestMatcher("/api/image/create"),
            new AntPathRequestMatcher("/api/image/delete/{id}"),
            new AntPathRequestMatcher("/api/image/all"),
            new AntPathRequestMatcher("/api/business/update"),
            new AntPathRequestMatcher("/api/banner/images"),
            new AntPathRequestMatcher("/api/banner/update"),
            new AntPathRequestMatcher("/api/category/create"),
            new AntPathRequestMatcher("/api/category/delete/{id}"),
            new AntPathRequestMatcher("/api/category/update/{id}"),
            new AntPathRequestMatcher("/api/menu/create"),
            new AntPathRequestMatcher("/api/menu/delete/{id}"),
            new AntPathRequestMatcher("/api/menu/update"),
            new AntPathRequestMatcher("/api/product/create"),
            new AntPathRequestMatcher("/api/product/{id}"),
            new AntPathRequestMatcher("/api/product/all", "GET"),
            new AntPathRequestMatcher("/api/about/update")
    );


    @Bean
    @Lazy
    public SecurityContextRepository securityContextRepository() {
        return new DelegatingSecurityContextRepository(
                new RequestAttributeSecurityContextRepository()
        );
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .securityContext(securityContext ->
                        securityContext
                                .requireExplicitSave(true)
                                .securityContextRepository(new DelegatingSecurityContextRepository(
                                        new RequestAttributeSecurityContextRepository()
                                ))
                )
                .authorizeHttpRequests((authorize) -> authorize
                        .requestMatchers(publicUrls)
                        .permitAll()
                        .requestMatchers(adminUrls).hasRole("ADMIN")
                        .anyRequest()
                        .authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint((request, response, authException) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write(
                            "{\"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}"
                    );
                }))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
