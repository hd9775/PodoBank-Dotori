package com.yongy.dotoriAuthService;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;

@SpringBootApplication
@EnableDiscoveryClient

public class DotoriAuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(DotoriAuthServiceApplication.class, args);
	}

}
