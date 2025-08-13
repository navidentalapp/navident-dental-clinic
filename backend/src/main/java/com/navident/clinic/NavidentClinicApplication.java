package com.navident.clinic;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class NavidentClinicApplication implements CommandLineRunner {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${app.cors.allowed-origins}")
    private String corsOrigins;

    public static void main(String[] args) {
        log.info("Starting NAVIDENT Dental Clinic Management System...");
        SpringApplication.run(NavidentClinicApplication.class, args);
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("=== CONFIGURATION DEBUG ===");
        log.info("MongoDB URI: {}", mongoUri.substring(0, Math.min(mongoUri.length(), 50)) + "...");
        log.info(">> Effective spring.data.mongodb.uri = {}", mongoUri);
        log.info("CORS Origins: {}", corsOrigins);
        log.info("Active Profiles: {}", System.getProperty("spring.profiles.active"));
        log.info("=== END CONFIGURATION DEBUG ===");
    }
}
