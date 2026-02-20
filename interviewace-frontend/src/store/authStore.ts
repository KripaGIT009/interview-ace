import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: number
  email: string
  fullName: string
  subscriptionTier: 'FREE' | 'PRO' | 'ENTERPRISE'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  hasHydrated: boolean
  lastAuthErrorAt: number | null
  lastAuthErrorUrl: string | null
  setLastAuthErrorAt: (value: number | null) => void
  setLastAuthErrorUrl: (value: string | null) => void
  setHasHydrated: (state: boolean) => void
  login: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

const normalizeToken = (value: unknown): string | null => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.split('.').length === 3 ? trimmed : null
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      hasHydrated: false,
      lastAuthErrorAt: null,
      lastAuthErrorUrl: null,
      setLastAuthErrorAt: (value) => set({ lastAuthErrorAt: value }),
      setLastAuthErrorUrl: (value) => set({ lastAuthErrorUrl: value }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      login: (user, token) => {
        const normalized = normalizeToken(token)
        if (!normalized) {
          set({ user: null, token: null, isAuthenticated: false })
          return
        }
        set({ user, token: normalized, isAuthenticated: true })
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      version: 2,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      migrate: (persistedState: any) => {
        const token = normalizeToken(persistedState?.token)
        const user = persistedState?.user ?? null
        return {
          ...persistedState,
          token,
          user,
          isAuthenticated: Boolean(token && user),
          hasHydrated: false,
        }
      },
      onRehydrateStorage: () => (state) => {
        if (state && (!state.token || !state.user)) {
          state.logout()
        }
        state?.setHasHydrated(true)
      },
    }
  )
)
