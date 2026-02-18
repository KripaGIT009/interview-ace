package com.interviewace.question.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Question {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Category category;
    
    @Column(nullable = false)
    private String company;
    
    @Column(columnDefinition = "TEXT")
    private String hints;
    
    @Column(columnDefinition = "TEXT")
    private String sampleInput;
    
    @Column(columnDefinition = "TEXT")
    private String sampleOutput;
    
    @Column(columnDefinition = "TEXT")
    private String constraints;
    
    @Column(columnDefinition = "TEXT")
    private String starterCode;
    
    @Column(nullable = false)
    private Integer timeLimit = 30; // minutes
    
    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    private LocalDateTime updatedAt;
    
    public enum Difficulty {
        EASY, MEDIUM, HARD
    }
    
    public enum Category {
        ARRAYS, STRINGS, LINKED_LISTS, TREES, GRAPHS, 
        DYNAMIC_PROGRAMMING, SORTING, SEARCHING, HASH_TABLES,
        STACKS, QUEUES, RECURSION, GREEDY, BACKTRACKING,
        BIT_MANIPULATION, MATH, DESIGN, OTHER
    }
}
