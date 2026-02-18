package com.interviewace.question.service;

import com.interviewace.question.model.Question;
import com.interviewace.question.repository.QuestionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestionService {
    
    private final QuestionRepository questionRepository;
    
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }
    
    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found with id: " + id));
    }
    
    public List<Question> getQuestionsByDifficulty(Question.Difficulty difficulty) {
        return questionRepository.findByDifficulty(difficulty);
    }
    
    public List<Question> getQuestionsByCategory(Question.Category category) {
        return questionRepository.findByCategory(category);
    }
    
    public List<Question> getQuestionsByCompany(String company) {
        return questionRepository.findByCompanyContainingIgnoreCase(company);
    }
    
    public List<Question> getQuestionsByDifficultyAndCategory(
            Question.Difficulty difficulty, 
            Question.Category category) {
        return questionRepository.findByDifficultyAndCategory(difficulty, category);
    }
    
    public Question getRandomQuestion() {
        return questionRepository.findRandomQuestion();
    }
    
    public Question getRandomQuestionByDifficulty(Question.Difficulty difficulty) {
        return questionRepository.findRandomQuestionByDifficulty(difficulty.name());
    }
    
    @Transactional
    public Question createQuestion(Question question) {
        question.setCreatedAt(LocalDateTime.now());
        return questionRepository.save(question);
    }
    
    @Transactional
    public Question updateQuestion(Long id, Question questionDetails) {
        Question question = getQuestionById(id);
        
        question.setTitle(questionDetails.getTitle());
        question.setDescription(questionDetails.getDescription());
        question.setDifficulty(questionDetails.getDifficulty());
        question.setCategory(questionDetails.getCategory());
        question.setCompany(questionDetails.getCompany());
        question.setHints(questionDetails.getHints());
        question.setSampleInput(questionDetails.getSampleInput());
        question.setSampleOutput(questionDetails.getSampleOutput());
        question.setConstraints(questionDetails.getConstraints());
        question.setStarterCode(questionDetails.getStarterCode());
        question.setTimeLimit(questionDetails.getTimeLimit());
        question.setUpdatedAt(LocalDateTime.now());
        
        return questionRepository.save(question);
    }
    
    @Transactional
    public void deleteQuestion(Long id) {
        questionRepository.deleteById(id);
    }
}
