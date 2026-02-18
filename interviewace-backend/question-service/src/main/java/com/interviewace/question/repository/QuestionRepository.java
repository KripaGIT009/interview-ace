package com.interviewace.question.repository;

import com.interviewace.question.model.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByDifficulty(Question.Difficulty difficulty);
    List<Question> findByCategory(Question.Category category);
    List<Question> findByCompanyContainingIgnoreCase(String company);
    List<Question> findByDifficultyAndCategory(Question.Difficulty difficulty, Question.Category category);
    
    @Query(value = "SELECT * FROM questions ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Question findRandomQuestion();
    
    @Query(value = "SELECT * FROM questions WHERE difficulty = ?1 ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Question findRandomQuestionByDifficulty(String difficulty);
}
