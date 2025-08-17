package com.navident.clinic.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.AbstractMongoClientConfiguration;

@Configuration
public class MongoConfig extends AbstractMongoClientConfiguration {

    @Value("${MONGODB_URI}")
    private String mongoUri;

    @Override
    protected String getDatabaseName() {
        return "navident_clinic";
    }

    protected String getMongoClientUri() {
        System.out.println("Using MongoDB URI: " + mongoUri);
        return mongoUri;
    }
}
// Note: Ensure that the MONGODB_URI environment variable is set correctly in your application properties or environment.