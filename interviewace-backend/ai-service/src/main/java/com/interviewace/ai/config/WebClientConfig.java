package com.interviewace.ai.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    
    @Value("${openai.api.key}")
    private String openaiApiKey;
    
    @Value("${openai.api.url}")
    private String openaiApiUrl;
    
    @Value("${elevenlabs.api.key}")
    private String elevenlabsApiKey;
    
    @Value("${elevenlabs.api.url}")
    private String elevenlabsApiUrl;
    
    @Bean(name = "openaiWebClient")
    public WebClient openaiWebClient() {
        return WebClient.builder()
                .baseUrl(openaiApiUrl)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + openaiApiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
    
    @Bean(name = "elevenlabsWebClient")
    public WebClient elevenlabsWebClient() {
        return WebClient.builder()
                .baseUrl(elevenlabsApiUrl)
                .defaultHeader("xi-api-key", elevenlabsApiKey)
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
    }
}
