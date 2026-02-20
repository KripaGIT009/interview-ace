package com.interviewlabpro.ai.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ElevenLabsService {
    
    @Qualifier("elevenlabsWebClient")
    private final WebClient elevenlabsWebClient;
    
    private static final String DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel voice
    
    public Mono<byte[]> synthesizeSpeech(String text) {
        Map<String, Object> requestBody = Map.of(
            "text", text,
            "model_id", "eleven_monolingual_v1",
            "voice_settings", Map.of(
                "stability", 0.5,
                "similarity_boost", 0.75
            )
        );
        
        return elevenlabsWebClient.post()
                .uri("/text-to-speech/" + DEFAULT_VOICE_ID)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(byte[].class);
    }
    
    public Mono<byte[]> synthesizeSpeechWithVoice(String text, String voiceId) {
        Map<String, Object> requestBody = Map.of(
            "text", text,
            "model_id", "eleven_monolingual_v1",
            "voice_settings", Map.of(
                "stability", 0.5,
                "similarity_boost", 0.75
            )
        );
        
        return elevenlabsWebClient.post()
                .uri("/text-to-speech/" + voiceId)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(byte[].class);
    }
}
