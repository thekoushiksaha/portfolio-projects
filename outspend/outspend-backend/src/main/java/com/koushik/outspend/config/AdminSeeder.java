package com.koushik.outspend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.koushik.outspend.user.entity.Role;
import com.koushik.outspend.user.entity.User;
import com.koushik.outspend.user.repository.RoleRepository;
import com.koushik.outspend.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Component
@Order(2)
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        String email = adminEmail.trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            return;
        }

        Role adminRole = roleRepository.findByName(AppConstants.ROLE_ADMIN)
                .orElseThrow(() -> new IllegalStateException("ROLE_ADMIN missing, check RoleSeeder"));

        userRepository.save(User.builder()
                .name("Admin")
                .email(email)
                .password(passwordEncoder.encode(adminPassword))
                .role(adminRole)
                .build());
    }
}
