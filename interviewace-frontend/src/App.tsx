import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import QuestionsPage from './pages/QuestionsPage'
import InterviewPage from './pages/InterviewPage'
import SubscriptionPage from './pages/SubscriptionPage'

function App() {
  const { isAuthenticated } = useAuthStore()

  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <SignupPage />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/questions" 
          element={isAuthenticated ? <QuestionsPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/interview/:sessionId?" 
          element={isAuthenticated ? <InterviewPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/subscription" 
          element={isAuthenticated ? <SubscriptionPage /> : <Navigate to="/login" />} 
        />
      </Routes>
    </>
  )
}

export default App
