package com.navident.clinic.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

@Configuration
public class MongoConfig {

    // Replace with your actual URI (or inject from properties)
    private static final String MONGO_URI = 
        "mongodb+srv://navidentalpg:25MhnHa4JeJIo8aZ@cluster0.rwxhhmt.mongodb.net/navident_clinic?retryWrites=true&w=majority&appName=Cluster0";

    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create(MONGO_URI);
    }

    @Bean
    public MongoTemplate mongoTemplate(MongoClient client) {
        // Ensure the default database is specified here as well
        return new MongoTemplate(client, "navident_clinic");
    }
}
