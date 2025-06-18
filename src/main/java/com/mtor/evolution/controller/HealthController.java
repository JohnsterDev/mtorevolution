package com.mtor.evolution.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class HealthController {

    @Autowired
    private DataSource dataSource;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Test database connection
            try (Connection connection = dataSource.getConnection()) {
                boolean isValid = connection.isValid(5); // 5 seconds timeout
                
                response.put("status", isValid ? "UP" : "DOWN");
                response.put("database", isValid ? "CONNECTED" : "DISCONNECTED");
            }
        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("database", "ERROR");
            response.put("error", e.getMessage());
        }
        
        response.put("timestamp", LocalDateTime.now());
        response.put("service", "mTOR-Evolution Backend");
        response.put("version", "2.0.0");
        response.put("environment", System.getProperty("spring.profiles.active", "default"));
        
        String status = (String) response.get("status");
        if ("UP".equals(status)) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(503).body(response);
        }
    }
}