package com.mtor.evolution;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class MtorEvolutionApplication {

    public static void main(String[] args) {
        SpringApplication.run(MtorEvolutionApplication.class, args);
    }
}