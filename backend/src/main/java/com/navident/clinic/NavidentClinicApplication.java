package com.navident.clinic;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@SpringBootApplication
public class NavidentClinicApplication {

    public static void main(String[] args) {
        // Debug environment variables
        String mongoUri = System.getenv("MONGODB_URI");
        
        if (mongoUri == null || mongoUri.contains("localhost")) {
            System.err.println("WARNING: MongoDB URI not set properly!");
        }

        SpringApplication.run(NavidentClinicApplication.class, args);
    }
}
