package com.interviewace.user.service;

import com.interviewace.user.model.UserProgress;
import com.interviewace.user.repository.UserProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserProgressRepository progressRepository;
    
    public UserProgress getUserProgress(Long userId) {
        return progressRepository.findByUserId(userId)
                .orElseGet(() -> createUserProgress(userId));
    }
    
    @Transactional
    public UserProgress createUserProgress(Long userId) {
        UserProgress progress = new UserProgress();
        progress.setUserId(userId);
        progress.setCreatedAt(LocalDateTime.now());
        return progressRepository.save(progress);
    }
    
    @Transactional
    public UserProgress updateProgress(Long userId, String difficulty, Integer score, Integer timeSpent) {
        UserProgress progress = getUserProgress(userId);
        
        progress.setTotalSessions(progress.getTotalSessions() + 1);
        progress.setCompletedSessions(progress.getCompletedSessions() + 1);
        
        // Update difficulty counters
        switch (difficulty.toUpperCase()) {
            case "EASY" -> progress.setEasyProblems(progress.getEasyProblems() + 1);
            case "MEDIUM" -> progress.setMediumProblems(progress.getMediumProblems() + 1);
            case "HARD" -> progress.setHardProblems(progress.getHardProblems() + 1);
        }
        
        // Update average score
        double totalScore = progress.getAverageScore() * (progress.getCompletedSessions() - 1) + score;
        progress.setAverageScore(totalScore / progress.getCompletedSessions());
        
        // Update time spent
        progress.setTotalTimeSpent(progress.getTotalTimeSpent() + timeSpent);
        
        // Update streak
        updateStreak(progress);
        
        progress.setLastSessionDate(LocalDateTime.now());
        progress.setUpdatedAt(LocalDateTime.now());
        
        return progressRepository.save(progress);
    }
    
    private void updateStreak(UserProgress progress) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime lastSession = progress.getLastSessionDate();
        
        if (lastSession == null) {
            progress.setCurrentStreak(1);
            progress.setLongestStreak(1);
        } else {
            long daysBetween = ChronoUnit.DAYS.between(lastSession.toLocalDate(), now.toLocalDate());
            
            if (daysBetween == 1) {
                // Consecutive day
                progress.setCurrentStreak(progress.getCurrentStreak() + 1);
                if (progress.getCurrentStreak() > progress.getLongestStreak()) {
                    progress.setLongestStreak(progress.getCurrentStreak());
                }
            } else if (daysBetween > 1) {
                // Streak broken
                progress.setCurrentStreak(1);
            }
            // daysBetween == 0 means same day, no change to streak
        }
    }
}
