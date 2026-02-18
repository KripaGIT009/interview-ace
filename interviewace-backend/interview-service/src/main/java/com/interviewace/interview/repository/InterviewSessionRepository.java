package com.interviewace.interview.repository;

import com.interviewace.interview.model.InterviewSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserId(Long userId);
    List<InterviewSession> findByUserIdAndStatus(Long userId, InterviewSession.SessionStatus status);
    List<InterviewSession> findByUserIdOrderByStartedAtDesc(Long userId);
}
