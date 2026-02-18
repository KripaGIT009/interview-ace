import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from '../lib/api';
import { useAuthStore } from '../store/authStore';

interface UserProgress {
  totalSessions: number;
  completedSessions: number;
  easyProblems: number;
  mediumProblems: number;
  hardProblems: number;
  averageScore: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
}

interface Session {
  id: number;
  questionId: number;
  status: string;
  score: number;
  timeSpent: number;
  completedAt: string;
}

export default function DashboardPage() {
  const { user, logout } = useAuthStore();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, sessionsRes] = await Promise.all([
        axios.get('/users/progress'),
        axios.get('/interviews/user')
      ]);
      setProgress(progressRes.data);
      setRecentSessions(sessionsRes.data.slice(0, 5));
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">InterviewAce</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.username}!</span>
            <Link to="/questions" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Questions
            </Link>
            <Link to="/subscription" className="text-indigo-600 hover:text-indigo-700 font-medium">
              Subscription
            </Link>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Your Dashboard</h2>
          <p className="text-gray-600 mt-2">Track your progress and keep improving</p>
        </div>
        
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Total Sessions</h3>
                <p className="text-3xl font-bold text-indigo-600">{progress?.totalSessions || 0}</p>
              </div>
              <div className="text-4xl">📊</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Completed</h3>
                <p className="text-3xl font-bold text-green-600">{progress?.completedSessions || 0}</p>
              </div>
              <div className="text-4xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Average Score</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {progress?.averageScore ? Math.round(progress.averageScore) : '-'}
                </p>
              </div>
              <div className="text-4xl">🎯</div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">Current Streak</h3>
                <p className="text-3xl font-bold text-orange-600">{progress?.currentStreak || 0} days</p>
              </div>
              <div className="text-4xl">🔥</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Problems Solved</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Easy</span>
                  <span className="text-sm font-bold text-green-600">{progress?.easyProblems || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (progress?.easyProblems || 0) * 10)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Medium</span>
                  <span className="text-sm font-bold text-yellow-600">{progress?.mediumProblems || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (progress?.mediumProblems || 0) * 10)}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Hard</span>
                  <span className="text-sm font-bold text-red-600">{progress?.hardProblems || 0}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full" 
                    style={{ width: `${Math.min(100, (progress?.hardProblems || 0) * 10)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Total Time Spent</span>
                <span className="text-lg font-bold text-indigo-600">
                  {Math.floor((progress?.totalTimeSpent || 0) / 60)}h {(progress?.totalTimeSpent || 0) % 60}m
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Longest Streak</span>
                <span className="text-lg font-bold text-orange-600">{progress?.longestStreak || 0} days 🏆</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Completion Rate</span>
                <span className="text-lg font-bold text-green-600">
                  {progress?.totalSessions ? 
                    Math.round((progress.completedSessions / progress.totalSessions) * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Sessions</h3>
          {recentSessions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentSessions.map((session) => (
                    <tr key={session.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{session.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          session.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.score !== null ? `${session.score}/100` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.timeSpent ? `${session.timeSpent} min` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(session.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No sessions yet. Start your first interview!</p>
          )}
        </div>
        
        <div className="text-center">
          <Link 
            to="/questions" 
            className="inline-block bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition text-lg shadow-lg"
          >
            🚀 Start New Interview
          </Link>
        </div>
      </main>
    </div>
  );
}
