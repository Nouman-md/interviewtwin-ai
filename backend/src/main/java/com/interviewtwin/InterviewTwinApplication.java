package com.interviewtwin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
@ComponentScan(basePackages = "com.interviewtwin")
public class InterviewTwinApplication {

    public static void main(String[] args) {
        SpringApplication.run(InterviewTwinApplication.class, args);
    }
}
