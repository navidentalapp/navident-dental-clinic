package com.navident.clinic.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class HealthController {

    @Value("${spring.data.mongodb.uri}")
    private String mongoUri;

    @Value("${app.cors.allowed-origins}")
    private String corsOrigins;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "NAVIDENT Dental Clinic API is running");
        response.put("mongoUri", mongoUri.substring(0, Math.min(mongoUri.length(), 50)) + "...");
        response.put("corsOrigins", corsOrigins);
        return ResponseEntity.ok(response);
    }
}
