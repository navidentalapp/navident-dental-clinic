package com.navident.clinic;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@Slf4j
public class NavidentClinicApplication {

    public static void main(String[] args) {
        log.info("Starting NAVIDENT Dental Clinic Management System...");
        SpringApplication.run(NavidentClinicApplication.class, args);
        System.out.println("MONGODB_URI: " + System.getenv("MONGODB_URI"));
        log.info("NAVIDENT Dental Clinic Management System started successfully!");
    }
}
