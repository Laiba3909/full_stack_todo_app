
/**
 * Authentication utility functions.
 */

// Token management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}

export const setToken = (token: string): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('token', token)
}

export const removeToken = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('token')
}

// User data management
export const getUser = (): any => {
  if (typeof window === 'undefined') return null
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

export const setUser = (user: any): void => {
  if (typeof window === 'undefined') return
  localStorage.setItem('user', JSON.stringify(user))
}

export const removeUser = (): void => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('user')
}

// Session management
export const isAuthenticated = (): boolean => {
  const token = getToken()
  if (!token) return false

  try {
    // Decode JWT to check expiration
    const payload = JSON.parse(atob(token.split('.')[1]))
    const expiration = payload.exp * 1000 // Convert to milliseconds
    return Date.now() < expiration
  } catch (error) {
    return false
  }
}

// Logout function
export const logout = (): void => {
  removeToken()
  removeUser()
  // Clear any other auth-related storage
  if (typeof window !== 'undefined') {
    window.location.href = '/auth/login'
  }
}

// Password validation
export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

// Email validation
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}