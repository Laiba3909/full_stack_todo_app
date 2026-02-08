'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name?: string
  created_at: string
  is_active: boolean
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const checkAuth = async (): Promise<boolean> => {
    const token = localStorage.getItem('token')
    if (!token) {
      console.log('No token found')
      return false
    }

    try {
      console.log('Checking auth with token...')
      
      // CORRECT ENDPOINT: /api/auth/me (not /auth/me)
      const response = await fetch('http://localhost:8000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      console.log('Auth check status:', response.status, response.statusText)
      
      if (response.ok) {
        const userData = await response.json()
        console.log('✅ User authenticated:', userData.email)
        setUser(userData)
        return true
      } else {
        console.log('❌ Token invalid, status:', response.status)
        const errorText = await response.text()
        console.log('Error response:', errorText)
        localStorage.removeItem('token')
        setUser(null)
        return false
      }
    } catch (error: any) {
      console.error('Auth check failed:', error.message)
      localStorage.removeItem('token')
      setUser(null)
      return false
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('Logging in with:', email)
      
      const response = await fetch('http://localhost:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      console.log('Login response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Login failed (${response.status})`)
      }

      const data = await response.json()
      console.log('Login successful, token received')
      
      if (!data.access_token) {
        throw new Error('No access token in response')
      }
      
      // Save token
      localStorage.setItem('token', data.access_token)
      console.log('Token saved to localStorage')
      
      // Set user
      setUser(data.user)
      
    } catch (error: any) {
      console.error('Login error:', error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `Registration failed (${response.status})`)
      }

      const data = await response.json()
      
      // Save token
      localStorage.setItem('token', data.access_token)
      
      // Set user
      setUser(data.user)
      
    } catch (error: any) {
      console.error('Registration error:', error.message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    console.log('Logged out')
  }

  // Check auth on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    checkAuth,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}