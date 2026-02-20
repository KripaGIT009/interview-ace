package com.interviewlabpro.auth.controller;

import com.interviewlabpro.auth.dto.AuthResponse;
import com.interviewlabpro.auth.dto.LoginRequest;
import com.interviewlabpro.auth.dto.SignupRequest;
import com.interviewlabpro.auth.model.User;
import com.interviewlabpro.auth.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        AuthResponse response = authService.signup(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<AuthResponse.UserDTO> getCurrentUser(@RequestParam Long userId) {
        try {
            User user = authService.getUserById(userId);
            return ResponseEntity.ok(AuthResponse.UserDTO.fromUser(user));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth Service is running!");
    }
}
