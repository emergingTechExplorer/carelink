package com.example.carelink.initializer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan("com.example.carelink")
@EntityScan("com.example.carelink.core.model")
@EnableJpaRepositories("com.example.carelink.core.repository")
public class CarelinkApplication {

	public static void main(String[] args) {
		SpringApplication.run(CarelinkApplication.class, args);
	}

}
