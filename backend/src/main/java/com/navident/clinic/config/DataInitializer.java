package com.navident.clinic.config;

import com.navident.clinic.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserService userService;

    @Override
    public void run(String... args) {
        createDefaultUsers();
    }

    private void createDefaultUsers() {
        createUserIfNotExists("administrator", "admin123", "admin@navident.com", 
                              "Admin", "User", "ROLE_ADMIN");
        createUserIfNotExists("chiefdentist", "chief123", "chiefdentist@navident.com", 
                              "Chief", "Dentist", "ROLE_CHIEFDENTIST");
        createUserIfNotExists("clinicassistant", "assistant123", "clinicassistant@navident.com", 
                              "Clinic", "Assistant", "ROLE_CLINICASSISTANT");
        createUserIfNotExists("printingonly", "print123", "printing@navident.com", 
                              "Printing", "User", "ROLE_PRINTINGONLY");
    }

    private void createUserIfNotExists(String username, String password, String email, 
                                       String firstName, String lastName, String role) {
        if (!userService.existsByUsername(username)) {
            userService.createUser(username, password, email, firstName, lastName, role);
            log.info("Created default user: {}", username);
        } else {
            log.info("User already exists: {}", username);
        }
    }
}
