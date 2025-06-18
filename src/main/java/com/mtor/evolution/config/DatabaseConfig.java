package com.mtor.evolution.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import javax.sql.DataSource;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class DatabaseConfig {

    @Value("${spring.datasource.url}")
    private String databaseUrl;

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    @Value("${spring.datasource.driver-class-name}")
    private String driverClassName;

    @Bean
    @Profile("prod")
    public DataSource productionDataSource() {
        System.out.println("🔗 Configuring Supabase PostgreSQL connection");
        System.out.println("📍 Database URL: " + (databaseUrl != null ? databaseUrl.replaceAll(":[^:@]*@", ":***@") : "not set"));
        
        return DataSourceBuilder
                .create()
                .url(databaseUrl)
                .username(username)
                .password(password)
                .driverClassName(driverClassName)
                .build();
    }
}