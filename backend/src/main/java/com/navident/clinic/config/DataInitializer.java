package com.navident.clinic.config;

import com.navident.clinic.model.User;
import com.navident.clinic.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        createIfNotExists("administrator", "admin@navident.com", "admin123", "ROLE_ADMIN");
        createIfNotExists("chiefdentist", "chiefdentist@navident.com", "chief123", "ROLE_CHIEFDENTIST");
        createIfNotExists("clinicassistant", "clinicassistant@navident.com", "assistant123", "ROLE_CLINICASSISTANT");
        createIfNotExists("printingonly", "printing@navident.com", "print123", "ROLE_PRINTINGONLY");
    }

    private void createIfNotExists(String username, String email, String rawPassword, String role) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setRole(role);
            userRepository.save(user);
            System.out.println("Created default user: " + username);
        }
    }
}
