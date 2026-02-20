import apiClient from '@/lib/api'

export interface LoginRequest {
  email: string
  password: string
}

export interface SignupRequest {
  email: string
  password: string
  fullName: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
    fullName: string
    subscriptionTier: 'FREE' | 'PRO' | 'ENTERPRISE'
  }
}

export const authService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data)
    return response.data
  },

  signup: async (data: SignupRequest): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/signup', data)
    return response.data
  },

  getCurrentUser: async (userId: number) => {
    const response = await apiClient.get('/auth/me', {
      params: { userId },
    })
    return response.data
  },

  logout: async () => {
    await apiClient.post('/auth/logout')
  },
}
