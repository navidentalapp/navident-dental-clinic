package com.navident.clinic.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@RequiredArgsConstructor
@Slf4j
public class HealthController {

    private final MongoTemplate mongoTemplate;

    @GetMapping
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        
        try {
            // Check database connectivity
            mongoTemplate.getDb().runCommand(org.bson.Document.parse("{ ping: 1 }"));
            health.put("database", "UP");
        } catch (Exception e) {
            health.put("database", "DOWN");
            health.put("database_error", e.getMessage());
            log.error("Database health check failed", e);
        }
        
        health.put("status", "UP");
        health.put("timestamp", LocalDateTime.now());
        health.put("application", "NAVIDENT Dental Clinic Management System");
        health.put("version", "1.0.0");
        health.put("environment", "production");
        
        return ResponseEntity.ok(health);
    }

    @GetMapping("/ping")
    public ResponseEntity<Map<String, String>> ping() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "pong");
        response.put("timestamp", LocalDateTime.now().toString());
        response.put("status", "healthy");
        return ResponseEntity.ok(response);
    }
}
