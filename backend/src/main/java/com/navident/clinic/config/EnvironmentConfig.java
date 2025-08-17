package com.navident.clinic.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:application-prod.properties")
public class EnvironmentConfig {
    
    static {
        // Force load environment variables
        String mongoUri = System.getenv("MONGODB_URI");
        if (mongoUri != null && !mongoUri.isEmpty()) {
            System.setProperty("spring.data.mongodb.uri", mongoUri);
            System.out.println("Set MongoDB URI from environment: " + mongoUri.substring(0, 20) + "...");
        } else {
            System.err.println("MONGODB_URI environment variable not found!");
        }
    }
}
