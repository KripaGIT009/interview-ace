import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '@/lib/api';
import Editor from '@monaco-editor/react';

interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
  company: string;
  hints: string[] | string | null;
  sampleInput: string;
  sampleOutput: string;
  constraints: string;
  starterCode: string;
  timeLimit: number;
}

export default function QuestionsPage() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    difficulty: '',
    category: '',
    search: ''
  });

  const categories = ['ARRAYS', 'STRINGS', 'LINKED_LISTS', 'TREES', 'GRAPHS', 
    'DYNAMIC_PROGRAMMING', 'SORTING', 'SEARCHING', 'HASH_TABLES', 'STACKS', 
    'QUEUES', 'HEAPS', 'RECURSION', 'BACKTRACKING', 'GREEDY', 'BIT_MANIPULATION', 'MATH'];

  useEffect(() => {
    fetchQuestions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [questions, filters]);

  const normalizeHints = (value: Question['hints']): string[] => {
    if (!value) {
      return [];
    }
    if (Array.isArray(value)) {
      return value.filter(Boolean);
    }
    return value
      .split(/\r?\n|;+/)
      .map((hint) => hint.trim())
      .filter(Boolean);
  };

  const fetchQuestions = async () => {
    try {
      const response = await axios.get('/questions');
      const normalized = response.data.map((question: Question) => ({
        ...question,
        hints: normalizeHints(question.hints),
      }));
      setQuestions(normalized);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = questions;

    if (filters.difficulty) {
      filtered = filtered.filter(q => q.difficulty === filters.difficulty);
    }

    if (filters.category) {
      filtered = filtered.filter(q => q.category === filters.category);
    }

    if (filters.search) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    setFilteredQuestions(filtered);
  };

  const startInterview = async (questionId: number) => {
    try {
      const response = await axios.post('/interviews/start', { questionId });
      navigate(`/interview/${response.data.id}`);
    } catch (error) {
      console.error('Failed to start interview:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'text-green-600 bg-green-100';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-100';
      case 'HARD': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Coding Questions</h1>
          <p className="mt-2 text-gray-600">Browse and practice {questions.length} coding interview questions</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => setFilters({ difficulty: '', category: '', search: '' })}
                className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <div
                key={question.id}
                className={`bg-white rounded-lg shadow p-6 cursor-pointer transition hover:shadow-lg ${
                  selectedQuestion?.id === question.id ? 'ring-2 ring-indigo-500' : ''
                }`}
                onClick={() => setSelectedQuestion(question)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{question.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 line-clamp-2">{question.description}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                    {question.category.replace(/_/g, ' ')}
                  </span>
                  {question.company && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-600">
                      {question.company}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-gray-500">{question.timeLimit} min</span>
                </div>
              </div>
            ))}
            {filteredQuestions.length === 0 && (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-500">No questions found matching your filters.</p>
              </div>
            )}
          </div>

          {selectedQuestion ? (
            <div className="bg-white rounded-lg shadow p-6 sticky top-8 h-fit max-h-[calc(100vh-4rem)] overflow-y-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedQuestion.title}</h2>
              <div className="flex items-center gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                  {selectedQuestion.difficulty}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                  {selectedQuestion.category.replace(/_/g, ' ')}
                </span>
                <span className="ml-auto text-sm text-gray-500">⏱️ {selectedQuestion.timeLimit} minutes</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedQuestion.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Constraints</h3>
                  <p className="text-sm text-gray-600">{selectedQuestion.constraints}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sample Input</h3>
                    <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700 overflow-x-auto">{selectedQuestion.sampleInput}</pre>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Sample Output</h3>
                    <pre className="bg-gray-50 p-3 rounded text-sm text-gray-700 overflow-x-auto">{selectedQuestion.sampleOutput}</pre>
                  </div>
                </div>

                {Array.isArray(selectedQuestion.hints) && selectedQuestion.hints.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Hints</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedQuestion.hints.map((hint, idx) => (
                        <li key={idx} className="text-sm text-gray-600">{hint}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Starter Code</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <Editor
                      height="200px"
                      defaultLanguage="java"
                      value={selectedQuestion.starterCode}
                      theme="vs-light"
                      options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13 }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => startInterview(selectedQuestion.id)}
                  className="w-full mt-6 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Start Interview
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-12 flex items-center justify-center sticky top-8">
              <p className="text-gray-500 text-center">Select a question to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
