package com.navident.clinic.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseDebugger implements CommandLineRunner {

    @Autowired
    private Environment env;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("=== DATABASE CONNECTION DEBUG ===");
        System.out.println("Active profiles: " + String.join(",", env.getActiveProfiles()));
        System.out.println("MongoDB URI from env: " + env.getProperty("spring.data.mongodb.uri"));
        System.out.println("Database name: " + mongoTemplate.getDb().getName());
        System.out.println("=================================");
    }
}
