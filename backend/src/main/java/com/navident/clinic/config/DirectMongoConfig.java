package com.navident.clinic.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class DirectMongoConfig {

    @Bean
    @Primary
    public MongoClient mongoClient() {
        String mongoUri = System.getenv("MONGODB_URI");
        
        if (mongoUri == null || mongoUri.isEmpty()) {
            // FALLBACK: Use your actual Atlas URI here
            mongoUri = "${MONGODB_URI}";
        }
        
        return MongoClients.create(mongoUri);
    }

    @Bean
    @Primary
    public MongoTemplate mongoTemplate(MongoClient mongoClient) {
        return new MongoTemplate(mongoClient, "navident_clinic");
    }
}
