package com.interviewace.user.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_progress")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private Long userId;
    
    @Column(nullable = false)
    private Integer totalSessions = 0;
    
    @Column(nullable = false)
    private Integer completedSessions = 0;
    
    @Column(nullable = false)
    private Integer easyProblems = 0;
    
    @Column(nullable = false)
    private Integer mediumProblems = 0;
    
    @Column(nullable = false)
    private Integer hardProblems = 0;
    
    @Column(nullable = false)
    private Double averageScore = 0.0;
    
    @Column(nullable = false)
    private Integer totalTimeSpent = 0; // in minutes
    
    @Column(nullable = false)
    private Integer currentStreak = 0;
    
    @Column(nullable = false)
    private Integer longestStreak = 0;
    
    private LocalDateTime lastSessionDate;
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
}
