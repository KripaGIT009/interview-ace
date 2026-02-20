package com.interviewace.ai.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class OpenAIService {
    
    @Qualifier("openaiWebClient")
    private final WebClient openaiWebClient;

    @Value("${openai.api.key}")
    private String openaiApiKey;
    
    public Mono<String> generateFeedback(String code, String question, String language) {
        if (isApiKeyMissing()) {
            return Mono.error(new IllegalStateException("OpenAI API key is not configured."));
        }
        Map<String, Object> requestBody = Map.of(
            "model", "gpt-4",
            "messages", List.of(
                Map.of("role", "system", "content", 
                    "You are an experienced technical interviewer. Provide detailed feedback on the candidate's code, " +
                    "including correctness, time complexity, space complexity, code quality, and suggestions for improvement."),
                Map.of("role", "user", "content", 
                    String.format("Question: %s\n\nLanguage: %s\n\nCandidate's Code:\n%s\n\n" +
                    "Please provide comprehensive feedback.", question, language, code))
            ),
            "temperature", 0.7,
            "max_tokens", 1000
        );
        
        return openaiWebClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                        return (String) message.get("content");
                    }
                    return "Unable to generate feedback.";
                });
    }
    
    public Mono<String> transcribeAudio(byte[] audioData) {
        // Note: Whisper requires multipart/form-data which is more complex
        // This is a simplified version. In production, use proper multipart handling
        return Mono.just("Audio transcription requires multipart upload implementation");
    }
    
    public Mono<Integer> scoreCode(String code, String question) {
        if (isApiKeyMissing()) {
            return Mono.error(new IllegalStateException("OpenAI API key is not configured."));
        }
        Map<String, Object> requestBody = Map.of(
            "model", "gpt-4",
            "messages", List.of(
                Map.of("role", "system", "content", 
                    "You are a technical interviewer. Score the candidate's code from 0-100 based on " +
                    "correctness (40%), efficiency (30%), code quality (20%), and best practices (10%). " +
                    "Respond with ONLY a number between 0 and 100."),
                Map.of("role", "user", "content", 
                    String.format("Question: %s\n\nCode:\n%s", question, code))
            ),
            "temperature", 0.3,
            "max_tokens", 10
        );
        
        return openaiWebClient.post()
                .uri("/chat/completions")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(Map.class)
                .map(response -> {
                    List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                    if (choices != null && !choices.isEmpty()) {
                        Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                        String content = (String) message.get("content");
                        try {
                            return Integer.parseInt(content.trim());
                        } catch (NumberFormatException e) {
                            return 50; // Default score if parsing fails
                        }
                    }
                    return 50;
                });
    }
}


    private boolean isApiKeyMissing() {
        return openaiApiKey == null
                || openaiApiKey.isBlank()
                || "your-openai-api-key".equals(openaiApiKey);
    }
