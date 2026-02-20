package com.interviewlabpro.interview.controller;

import com.interviewlabpro.interview.model.InterviewSession;
import com.interviewlabpro.interview.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/interviews")
@RequiredArgsConstructor
public class InterviewController {
    
    private final InterviewService interviewService;
    
    @PostMapping("/start")
    public ResponseEntity<InterviewSession> startSession(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Long> request) {
        
        Long questionId = request.get("questionId");
        return ResponseEntity.ok(interviewService.startSession(userId, questionId));
    }
    
    @PostMapping("/{sessionId}/submit")
    public ResponseEntity<InterviewSession> submitCode(
            @PathVariable Long sessionId,
            @RequestBody Map<String, String> request) {
        
        return ResponseEntity.ok(interviewService.submitCode(sessionId, request.get("code")));
    }
    
    @PostMapping("/{sessionId}/complete")
    public ResponseEntity<InterviewSession> completeSession(
            @PathVariable Long sessionId,
            @RequestBody Map<String, Object> request) {
        
        String code = (String) request.get("code");
        String feedback = (String) request.get("feedback");
        Integer score = (Integer) request.get("score");
        
        return ResponseEntity.ok(interviewService.completeSession(sessionId, code, feedback, score));
    }
    
    @GetMapping("/user")
    public ResponseEntity<List<InterviewSession>> getUserSessions(
            @RequestHeader("X-User-Id") Long userId) {
        
        return ResponseEntity.ok(interviewService.getUserSessions(userId));
    }
    
    @GetMapping("/{sessionId}")
    public ResponseEntity<InterviewSession> getSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(interviewService.getSessionById(sessionId));
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Interview Service is running!");
    }
}
