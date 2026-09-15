package com.interviewtwin.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.unit.DataSize;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.boot.web.servlet.MultipartConfigFactory;
import jakarta.servlet.MultipartConfigElement;

@Configuration
public class MultipartConfig {

    @Value("${file.upload.max-size:10485760}")
    private long maxFileSize;

    @Value("${file.upload.max-request-size:10485760}")
    private long maxRequestSize;

    @Bean
    public MultipartConfigElement multipartConfigElement() {
        MultipartConfigFactory factory = new MultipartConfigFactory();
        factory.setMaxFileSize(DataSize.ofBytes(maxFileSize));
        factory.setMaxRequestSize(DataSize.ofBytes(maxRequestSize));
        return factory.createMultipartConfig();
    }

    @Bean
    public MultipartResolver multipartResolver() {
        return new StandardServletMultipartResolver();
    }
}