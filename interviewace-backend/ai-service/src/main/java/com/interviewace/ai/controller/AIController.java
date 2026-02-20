package com.interviewace.ai.controller;

import com.interviewace.ai.service.ElevenLabsService;
import com.interviewace.ai.service.OpenAIService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AIController {
    
    private final OpenAIService openAIService;
    private final ElevenLabsService elevenLabsService;
    
    @PostMapping("/feedback")
    public Mono<ResponseEntity<Map<String, String>>> generateFeedback(
            @RequestBody Map<String, String> request) {
        
        String code = request.get("code");
        String question = request.get("question");
        String language = request.getOrDefault("language", "java");
        
        return openAIService.generateFeedback(code, question, language)
                .map(feedback -> ResponseEntity.ok(Map.of("feedback", feedback)))
                .onErrorResume(error -> Mono.just(buildFeedbackErrorResponse(error)));
    }
    
    @PostMapping("/score")
    public Mono<ResponseEntity<Map<String, Integer>>> scoreCode(
            @RequestBody Map<String, String> request) {
        
        String code = request.get("code");
        String question = request.get("question");
        
        return openAIService.scoreCode(code, question)
                .map(score -> ResponseEntity.ok(Map.of("score", score)))
                .onErrorResume(error -> Mono.just(buildScoreErrorResponse(error)));
    }
    
    @PostMapping("/transcribe")
    public Mono<ResponseEntity<Map<String, String>>> transcribeAudio(
            @RequestBody byte[] audioData) {
        
        return openAIService.transcribeAudio(audioData)
                .map(transcription -> ResponseEntity.ok(Map.of("transcription", transcription)));
    }
    
    @PostMapping("/synthesize")
    public Mono<ResponseEntity<byte[]>> synthesizeSpeech(
            @RequestBody Map<String, String> request) {
        
        String text = request.get("text");
        String voiceId = request.get("voiceId");
        
        Mono<byte[]> audioMono = voiceId != null
                ? elevenLabsService.synthesizeSpeechWithVoice(text, voiceId)
                : elevenLabsService.synthesizeSpeech(text);
        
        return audioMono.map(audio -> ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "audio/mpeg")
                .body(audio));
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Service is running!");
    }

        private ResponseEntity<Map<String, String>> buildFeedbackErrorResponse(Throwable error) {
                HttpStatus status = resolveAiErrorStatus(error);
                String message = resolveAiErrorMessage(error);
                return ResponseEntity.status(status).body(Map.of("error", message));
        }

        private ResponseEntity<Map<String, Integer>> buildScoreErrorResponse(Throwable error) {
                HttpStatus status = resolveAiErrorStatus(error);
                return ResponseEntity.status(status).build();
        }

        private HttpStatus resolveAiErrorStatus(Throwable error) {
                if (error instanceof IllegalStateException) {
                        return HttpStatus.SERVICE_UNAVAILABLE;
                }
                if (error instanceof WebClientResponseException webClientException) {
                        if (webClientException.getStatusCode().is4xxClientError()) {
                                return HttpStatus.BAD_GATEWAY;
                        }
                        return HttpStatus.BAD_GATEWAY;
                }
                return HttpStatus.INTERNAL_SERVER_ERROR;
        }

        private String resolveAiErrorMessage(Throwable error) {
                if (error instanceof IllegalStateException) {
                        return "AI feedback is unavailable. Set OPENAI_API_KEY for the ai-service.";
                }
                if (error instanceof WebClientResponseException webClientException) {
                        if (webClientException.getStatusCode() == HttpStatus.UNAUTHORIZED) {
                                return "AI provider rejected the request. Verify the OPENAI_API_KEY value.";
                        }
                        return "AI provider request failed. Please try again later.";
                }
                return "AI feedback request failed. Please try again later.";
        }
}
