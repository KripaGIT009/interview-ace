package com.interviewace.interview.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InterviewSession {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long userId;
    
    @Column(nullable = false)
    private Long questionId;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SessionStatus status = SessionStatus.IN_PROGRESS;
    
    @Column(columnDefinition = "TEXT")
    private String code;
    
    @Column(columnDefinition = "TEXT")
    private String feedback;
    
    private Integer score;
    
    @Column(nullable = false)
    private LocalDateTime startedAt = LocalDateTime.now();
    
    private LocalDateTime completedAt;
    
    private Integer timeSpent; // in minutes
    
    @Column(columnDefinition = "TEXT")
    private String notes;
    
    public enum SessionStatus {
        IN_PROGRESS, COMPLETED, ABANDONED
    }
}
