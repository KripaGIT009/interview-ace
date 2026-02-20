import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token?.trim()
    if (token && token.split('.').length === 3) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ? String(error.config.url) : 'unknown'
      useAuthStore.getState().setLastAuthErrorUrl(url)
      console.warn('Auth 401 from', url)
      useAuthStore.getState().setLastAuthErrorAt(Date.now())
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default apiClient
