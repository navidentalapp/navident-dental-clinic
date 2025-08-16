package com.navident.clinic.config;

import com.navident.clinic.model.User;
import com.navident.clinic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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
    public void run(String... args) throws Exception {
        initializeDefaultAdmin();
    }

    private void initializeDefaultAdmin() {
        try {
            if (!userRepository.existsByUsername(adminUsername)) {
                User admin = User.builder()
                        .username(adminUsername)
                        .password(passwordEncoder.encode(adminPassword))
                        .firstName("System")
                        .lastName("Administrator")
                        .email(adminEmail)
                        .role("ADMINISTRATOR")
                        .active(true)
                        .build();

                userRepository.save(admin);
                log.info("Default admin user created successfully with username: {}", adminUsername);
            } else {
                log.info("Default admin user already exists: {}", adminUsername);
            }
        } catch (Exception e) {
            log.error("Error creating default admin user", e);
        }
    }
}
