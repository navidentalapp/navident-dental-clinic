package com.navident.clinic.config;

import com.navident.clinic.model.User;
import com.navident.clinic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.username}")
    private String adminUsername;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Override
    public void run(String... args) {
        createDefaultAdminUser();
    }

    private void createDefaultAdminUser() {
        if (!userRepository.existsByUsername(adminUsername)) {
            User adminUser = User.builder()
                .username(adminUsername)
                .password(passwordEncoder.encode(adminPassword))
                .email(adminEmail)
                .firstName("System")
                .lastName("Administrator")
                .role("ADMINISTRATOR")
                .active(true)
                .locked(false)
                .credentialsExpired(false)
                .accountExpired(false)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

            userRepository.save(adminUser);
            log.info("✅ Default admin user created: {}", adminUsername);
        } else {
            // Unlock & enable admin in case flags are wrong
            User adminUser = userRepository.findByUsername(adminUsername).get();
            boolean fixed = false;
            if (!adminUser.isActive()) {
                adminUser.setActive(true);
                fixed = true;
            }
            if (adminUser.isLocked()) {
                adminUser.setLocked(false);
                fixed = true;
            }
            if (fixed) {
                userRepository.save(adminUser);
                log.info("✅ Fixed admin user's lock/active flags: {}", adminUsername);
            } else {
                log.info("ℹ️ Admin user already exists and is active: {}", adminUsername);
            }
        }
    }
}
