package com.koushik.outspend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class OutspendApplication {

	public static void main(String[] args) {
		SpringApplication.run(OutspendApplication.class, args);
	}

}
