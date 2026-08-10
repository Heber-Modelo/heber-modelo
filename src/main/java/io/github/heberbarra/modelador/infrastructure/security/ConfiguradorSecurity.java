/*
 * Copyright (C) 2025 Heber Ferreira Barra, Matheus de Assis de Paula, Matheus Jun Alves Matuda.
 *
 * Licensed under the Massachusetts Institute of Technology (MIT) License.
 * You may obtain a copy of the license at:
 *
 *   https://choosealicense.com/licenses/mit/
 *
 * A short and simple permissive license with conditions only requiring preservation of copyright and license notices.
 * Licensed works, modifications, and larger works may be distributed under different terms and without source code.
 *
 */

package io.github.heberbarra.modelador.infrastructure.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;

@Configuration
@EnableWebSecurity
public class ConfiguradorSecurity {

    @Bean
    public static PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) {
        httpSecurity.csrf(csrf -> {
            csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());
        });

        httpSecurity.authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/usuarios", "/usuarios/**")
                .hasAuthority("PROFESSOR")
                .requestMatchers("/perfil", "/perfil.html")
                .authenticated()
                .anyRequest()
                .permitAll());

        httpSecurity.formLogin(
                form -> form.loginPage("/login").loginProcessingUrl("/login").defaultSuccessUrl("/", false));

        httpSecurity.logout(logout ->
                logout.logoutUrl("/logout").deleteCookies("JSESSIONID").logoutSuccessUrl("/"));

        return httpSecurity.build();
    }
}
