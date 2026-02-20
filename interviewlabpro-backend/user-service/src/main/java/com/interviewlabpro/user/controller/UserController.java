package com.interviewlabpro.user.controller;

import com.interviewlabpro.user.model.UserProgress;
import com.interviewlabpro.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping("/progress")
    public ResponseEntity<UserProgress> getUserProgress(
            @RequestHeader("X-User-Id") Long userId) {
        
        return ResponseEntity.ok(userService.getUserProgress(userId));
    }
    
    @PostMapping("/progress/update")
    public ResponseEntity<UserProgress> updateProgress(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody Map<String, Object> request) {
        
        String difficulty = (String) request.get("difficulty");
        Integer score = (Integer) request.get("score");
        Integer timeSpent = (Integer) request.get("timeSpent");
        
        return ResponseEntity.ok(userService.updateProgress(userId, difficulty, score, timeSpent));
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("User Service is running!");
    }
}
