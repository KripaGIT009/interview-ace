import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../lib/api';
import Editor from '@monaco-editor/react';
import RecordRTC from 'recordrtc';

interface Session {
  id: number;
  questionId: number;
  status: string;
  startedAt: string;
}

interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  category: string;
  sampleInput: string;
  sampleOutput: string;
  starterCode: string;
  timeLimit: number;
}

export default function InterviewPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [code, setCode] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [recording, setRecording] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const recorderRef = useRef<RecordRTC | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (sessionId) {
      fetchSession();
    }
  }, [sessionId]);

  useEffect(() => {
    if (session && question) {
      const startTime = new Date(session.startedAt).getTime();
      const endTime = startTime + question.timeLimit * 60 * 1000;

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const remaining = Math.max(0, endTime - now);
        setTimeLeft(Math.floor(remaining / 1000));

        if (remaining === 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session, question]);

  const fetchSession = async () => {
    try {
      const sessionRes = await axios.get(`/interviews/${sessionId}`);
      setSession(sessionRes.data);

      const questionRes = await axios.get(`/questions/${sessionRes.data.questionId}`);
      setQuestion(questionRes.data);
      setCode(questionRes.data.starterCode);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {
    try {
      await axios.post(`/interviews/${sessionId}/submit`, { code });
      alert('Code submitted successfully!');
    } catch (error) {
      console.error('Failed to submit code:', error);
    }
  };

  const handleComplete = async () => {
    setSubmitting(true);
    try {
      // Get AI feedback and score
      const feedbackRes = await axios.post('/ai/feedback', {
        code,
        question: question?.description,
        language: 'java'
      });

      const scoreRes = await axios.post('/ai/score', {
        code,
        question: question?.description
      });

      const aiFeedback = feedbackRes.data.feedback;
      const aiScore = scoreRes.data.score;

      // Complete interview
      await axios.post(`/interviews/${sessionId}/complete`, {
        feedback: aiFeedback,
        score: aiScore
      });

      // Update user progress
      await axios.post('/users/progress/update', {
        difficulty: question?.difficulty,
        score: aiScore,
        timeSpent: Math.floor((new Date().getTime() - new Date(session!.startedAt).getTime()) / 60000)
      });

      setFeedback(aiFeedback);
      setScore(aiScore);
      setShowFeedback(true);
    } catch (error) {
      console.error('Failed to complete interview:', error);
      alert('Failed to get AI feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm'
      });

      recorder.startRecording();
      recorderRef.current = recorder;
      setRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Microphone permission denied');
    }
  };

  const stopRecording = () => {
    if (recorderRef.current) {
      recorderRef.current.stopRecording(() => {
        const blob = recorderRef.current!.getBlob();
        // Could send to /api/ai/transcribe for speech-to-text
        console.log('Recording stopped, blob size:', blob.size);
        
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }
        setRecording(false);
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (showFeedback) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Complete!</h1>
              <div className="text-6xl font-bold text-indigo-600 my-6">{score}/100</div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Feedback</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p className="text-gray-700 whitespace-pre-wrap">{feedback}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => navigate('/questions')}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Try Another Question
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{question?.title}</h1>
            <div className="flex items-center gap-4">
              <div className={`text-2xl font-mono font-bold ${
                timeLeft < 300 ? 'text-red-600' : 'text-gray-700'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </div>
              <button
                onClick={recording ? stopRecording : startRecording}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  recording 
                    ? 'bg-red-600 text-white hover:bg-red-700' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {recording ? '⏹️ Stop Recording' : '🎤 Start Recording'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Problem Description</h2>
            <div className="space-y-4">
              <p className="text-gray-700 whitespace-pre-wrap">{question?.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sample Input</h3>
                  <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700">{question?.sampleInput}</pre>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sample Output</h3>
                  <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700">{question?.sampleOutput}</pre>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Code Editor</h2>
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4" style={{ height: '500px' }}>
              <Editor
                height="100%"
                defaultLanguage="java"
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true
                }}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmitCode}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Save Progress
              </button>
              <button
                onClick={handleComplete}
                disabled={submitting}
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50"
              >
                {submitting ? 'Getting Feedback...' : 'Submit & Complete'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
