package com.interviewace.auth.dto;

import com.interviewace.auth.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDTO user;
    
    @Data
    @AllArgsConstructor
    public static class UserDTO {
        private Long id;
        private String email;
        private String fullName;
        private String subscriptionTier;
        
        public static UserDTO fromUser(User user) {
            return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getSubscriptionTier().name()
            );
        }
    }
}
