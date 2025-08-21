import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../services/api'
import { UserRole } from '../types/auth'
import { TokenService, SessionService } from '../services/tokenService'

interface User {
  id: number
  email: string
  name: string
  role: UserRole
  company?: string
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
  loginDemo: () => void
  isDemoMode: boolean
}

interface RegisterData {
  email: string
  password: string
  name: string
  company?: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDemoMode, setIsDemoMode] = useState(false)

  const isAuthenticated = !!user

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Check for demo mode first
        const demoMode = localStorage.getItem('demo_mode')
        const demoUser = localStorage.getItem('demo_user')

        if (demoMode === 'true' && demoUser) {
          setUser(JSON.parse(demoUser))
          setIsDemoMode(true)
          return
        }

        // Check for regular auth token using TokenService
        const hasValidToken = await SessionService.ensureValidToken()
        if (hasValidToken) {
          const userData = await apiService.getProfile()
          setUser(userData.user)
          setIsDemoMode(false)

          // Start session monitoring
          SessionService.startSessionMonitoring()
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        TokenService.clearTokens()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()

    // Add logout callback for session management
    const handleSessionLogout = () => {
      setUser(null)
      setIsDemoMode(false)
    }

    SessionService.addLogoutCallback(handleSessionLogout)

    // Cleanup
    return () => {
      SessionService.removeLogoutCallback(handleSessionLogout)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiService.login(email, password)

      if (response.token && response.user) {
        // Store tokens using TokenService
        TokenService.setTokens(
          response.token,
          response.refreshToken,
          response.expiresIn,
          response.user
        )
        setUser(response.user)
        setIsDemoMode(false)

        // Start session monitoring
        SessionService.startSessionMonitoring()
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error: any) {
      console.error('Login failed:', error)
      throw new Error(error.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      setIsLoading(true)
      await apiService.logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // Use SessionService for proper logout
      SessionService.logout()
      setUser(null)
      setIsDemoMode(false)
      setIsLoading(false)
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await apiService.register(userData)

      if (response.token && response.user) {
        // Store tokens using TokenService
        TokenService.setTokens(
          response.token,
          response.refreshToken,
          response.expiresIn,
          response.user
        )
        setUser(response.user)
        setIsDemoMode(false)

        // Start session monitoring
        SessionService.startSessionMonitoring()
      } else {
        throw new Error('Invalid response from server')
      }
    } catch (error: any) {
      console.error('Registration failed:', error)
      throw new Error(error.message || 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const updateProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true)
      const response = await apiService.updateProfile(userData)

      if (response.user) {
        setUser(response.user)
      }
    } catch (error: any) {
      console.error('Profile update failed:', error)
      throw new Error(error.message || 'Profile update failed')
    } finally {
      setIsLoading(false)
    }
  }

  const loginDemo = () => {
    const demoUser: User = {
      id: 999,
      email: 'demo@hashmicro.com',
      name: 'Demo User',
      role: UserRole.ADMIN,
      company: 'HashMicro Demo Company',
      permissions: []
    }

    setUser(demoUser)
    setIsDemoMode(true)
    localStorage.setItem('demo_mode', 'true')
    localStorage.setItem('demo_user', JSON.stringify(demoUser))
  }

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile,
    loginDemo,
    isDemoMode
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
