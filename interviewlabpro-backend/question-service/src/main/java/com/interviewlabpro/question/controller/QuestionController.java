package com.interviewlabpro.question.controller;

import com.interviewlabpro.question.model.Question;
import com.interviewlabpro.question.service.QuestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
public class QuestionController {
    
    private final QuestionService questionService;
    
    @GetMapping
    public ResponseEntity<List<Question>> getAllQuestions(
            @RequestParam(required = false) Question.Difficulty difficulty,
            @RequestParam(required = false) Question.Category category,
            @RequestParam(required = false) String company) {
        
        if (difficulty != null && category != null) {
            return ResponseEntity.ok(questionService.getQuestionsByDifficultyAndCategory(difficulty, category));
        } else if (difficulty != null) {
            return ResponseEntity.ok(questionService.getQuestionsByDifficulty(difficulty));
        } else if (category != null) {
            return ResponseEntity.ok(questionService.getQuestionsByCategory(category));
        } else if (company != null) {
            return ResponseEntity.ok(questionService.getQuestionsByCompany(company));
        }
        
        return ResponseEntity.ok(questionService.getAllQuestions());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Question> getQuestionById(@PathVariable Long id) {
        return ResponseEntity.ok(questionService.getQuestionById(id));
    }
    
    @GetMapping("/random")
    public ResponseEntity<Question> getRandomQuestion(
            @RequestParam(required = false) Question.Difficulty difficulty) {
        
        if (difficulty != null) {
            return ResponseEntity.ok(questionService.getRandomQuestionByDifficulty(difficulty));
        }
        return ResponseEntity.ok(questionService.getRandomQuestion());
    }
    
    @PostMapping
    public ResponseEntity<Question> createQuestion(@RequestBody Question question) {
        return ResponseEntity.ok(questionService.createQuestion(question));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Question> updateQuestion(
            @PathVariable Long id, 
            @RequestBody Question question) {
        return ResponseEntity.ok(questionService.updateQuestion(id, question));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        questionService.deleteQuestion(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Question Service is running!");
    }
}
