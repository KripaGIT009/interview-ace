import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { authService } from '@/services/authService'
import ToastProvider from '@/components/ToastProvider'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import QuestionsPage from './pages/QuestionsPage'
import InterviewPage from './pages/InterviewPage'
import SubscriptionPage from './pages/SubscriptionPage'

function App() {
  const { isAuthenticated, hasHydrated, token, user, updateUser, logout, lastAuthErrorAt, lastAuthErrorUrl } = useAuthStore()
  const [isAuthChecking, setIsAuthChecking] = useState(true)
  const location = useLocation()

  useEffect(() => {
    const verifyAuth = async () => {
      if (!hasHydrated) {
        return
      }

      if (!token) {
        setIsAuthChecking(false)
        return
      }

      if (token.split('.').length !== 3) {
        logout()
        setIsAuthChecking(false)
        return
      }

      if (!user?.id) {
        logout()
        setIsAuthChecking(false)
        return
      }

      try {
        const currentUser = await authService.getCurrentUser(user.id)
        updateUser(currentUser)
      } catch {
        logout()
      } finally {
        setIsAuthChecking(false)
      }
    }

    verifyAuth()
  }, [hasHydrated, token, user?.id, updateUser, logout])

  const isAuthed = Boolean(token) && isAuthenticated

  if (!hasHydrated || isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-3 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <ToastProvider>
      {import.meta.env.DEV && (
        <div className="fixed bottom-3 right-3 z-50 rounded-md bg-black/80 px-3 py-2 text-xs text-white">
          <div>path: {location.pathname}</div>
          <div>hydrated: {String(hasHydrated)}</div>
          <div>checking: {String(isAuthChecking)}</div>
          <div>token: {token ? 'yes' : 'no'}</div>
          <div>isAuth: {String(isAuthenticated)}</div>
          <div>userId: {user?.id ?? 'none'}</div>
          <div>last401: {lastAuthErrorAt ? new Date(lastAuthErrorAt).toLocaleTimeString() : 'none'}</div>
          <div>last401Url: {lastAuthErrorUrl ?? 'none'}</div>
        </div>
      )}
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route 
          path="/login" 
          element={isAuthed ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
        />
        <Route 
          path="/signup" 
          element={isAuthed ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
        />
        
        {/* Protected routes */}
        <Route 
          path="/dashboard" 
          element={isAuthed ? <DashboardPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/questions" 
          element={isAuthed ? <QuestionsPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/interview/:sessionId?" 
          element={isAuthed ? <InterviewPage /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/subscription" 
          element={isAuthed ? <SubscriptionPage /> : <Navigate to="/login" replace />} 
        />
      </Routes>
    </ToastProvider>
  )
}

export default App
