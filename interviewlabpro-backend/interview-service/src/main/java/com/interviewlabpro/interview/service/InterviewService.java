package com.interviewlabpro.interview.service;

import com.interviewlabpro.interview.model.InterviewSession;
import com.interviewlabpro.interview.repository.InterviewSessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InterviewService {
    
    private final InterviewSessionRepository sessionRepository;
    
    @Transactional
    public InterviewSession startSession(Long userId, Long questionId) {
        InterviewSession session = new InterviewSession();
        session.setUserId(userId);
        session.setQuestionId(questionId);
        session.setStatus(InterviewSession.SessionStatus.IN_PROGRESS);
        session.setStartedAt(LocalDateTime.now());
        
        return sessionRepository.save(session);
    }
    
    @Transactional
    public InterviewSession submitCode(Long sessionId, String code) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setCode(code);
        return sessionRepository.save(session);
    }
    
    @Transactional
    public InterviewSession completeSession(Long sessionId, String code, String feedback, Integer score) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        session.setCode(code);
        session.setFeedback(feedback);
        session.setScore(score);
        session.setStatus(InterviewSession.SessionStatus.COMPLETED);
        session.setCompletedAt(LocalDateTime.now());
        
        Duration duration = Duration.between(session.getStartedAt(), session.getCompletedAt());
        session.setTimeSpent((int) duration.toMinutes());
        
        return sessionRepository.save(session);
    }
    
    public List<InterviewSession> getUserSessions(Long userId) {
        return sessionRepository.findByUserIdOrderByStartedAtDesc(userId);
    }
    
    public InterviewSession getSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }
}
