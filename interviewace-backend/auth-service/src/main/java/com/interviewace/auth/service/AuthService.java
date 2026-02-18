package com.interviewace.auth.service;

import com.interviewace.auth.dto.AuthResponse;
import com.interviewace.auth.dto.LoginRequest;
import com.interviewace.auth.dto.SignupRequest;
import com.interviewace.auth.model.User;
import com.interviewace.auth.repository.UserRepository;
import com.interviewace.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    
    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setSubscriptionTier(User.SubscriptionTier.FREE);
        user.setEnabled(true);
        user.setCreatedAt(LocalDateTime.now());
        
        User savedUser = userRepository.save(user);
        String token = jwtTokenProvider.generateToken(savedUser.getEmail(), savedUser.getId());
        
        return new AuthResponse(token, AuthResponse.UserDTO.fromUser(savedUser));
    }
    
    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }
        
        if (!user.getEnabled()) {
            throw new RuntimeException("Account is disabled");
        }
        
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);
        
        String token = jwtTokenProvider.generateToken(user.getEmail(), user.getId());
        
        return new AuthResponse(token, AuthResponse.UserDTO.fromUser(user));
    }
    
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
