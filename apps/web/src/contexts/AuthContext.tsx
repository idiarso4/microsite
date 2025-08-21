import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiService } from '../services/api'

interface User {
  id: number
  email: string
  name: string
  role: string
  company?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: RegisterData) => Promise<void>
  updateProfile: (userData: Partial<User>) => Promise<void>
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

  const isAuthenticated = !!user

  // Check if user is already logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          const userData = await apiService.getProfile()
          setUser(userData.user)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const response = await apiService.login(email, password)
      
      if (response.token && response.user) {
        localStorage.setItem('auth_token', response.token)
        setUser(response.user)
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

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    // Redirect to login page
    window.location.href = '/login'
  }

  const register = async (userData: RegisterData) => {
    try {
      setIsLoading(true)
      const response = await apiService.register(userData)
      
      if (response.token && response.user) {
        localStorage.setItem('auth_token', response.token)
        setUser(response.user)
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

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
