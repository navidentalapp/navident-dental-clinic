package com.navident.clinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class NavidentClinicApplication {

    public static void main(String[] args) {
        // Removed MongoDB URI debug prints to clean logs
        
        SpringApplication.run(NavidentClinicApplication.class, args);
    }

//String mongoUri = System.getenv("MONGODB_URI");
//
//if (mongoUri == null || mongoUri.contains("localhost")) {
//    System.err.println("WARNING: MongoDB URI not set properly!");
//
}