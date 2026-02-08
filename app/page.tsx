'use client'  // Add this at the very top

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// For Hugging Face Spaces, use relative path for backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''

interface User {
  id: string
  email: string
  name?: string
}

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [backendError, setBackendError] = useState<string | null>(null)
  const [isBackendOnline, setIsBackendOnline] = useState<boolean | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'personal' | 'work' | 'important'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      checkBackendStatus()
      checkAuth()
    } else {
      setIsLoading(false)
    }
  }, [])

  const checkBackendStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        credentials: 'omit',
      })
      
      if (response.ok) {
        setIsBackendOnline(true)
        setBackendError(null)
      } else {
        setIsBackendOnline(false)
        setBackendError(`Backend returned status: ${response.status}`)
      }
    } catch (error) {
      setIsBackendOnline(false)
      setBackendError('Cannot connect to backend server. Please check if the backend is running.')
      console.error('Backend connection error:', error)
    }
  }

  const checkAuth = async () => {
    if (typeof window === 'undefined') return
    
    const token = localStorage.getItem('token')
    
    if (!token) {
      console.log('No token found, redirecting to login')
      router.push('/auth/login')
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      })

      if (response.ok) {
        const userData = await response.json()
        console.log('User authenticated:', userData.email)
        setUser(userData)
      } else {
        console.log('Token invalid, clearing and redirecting')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        router.push('/auth/login')
      }
    } catch (error: any) {
      console.error('Auth check failed:', error)
      setBackendError(`Network error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/auth/login')
  }

  const handleRetry = () => {
    setBackendError(null)
    setIsBackendOnline(null)
    setIsLoading(true)
    checkBackendStatus()
    checkAuth()
  }

  // Mock tasks data
  const tasks = [
    { id: 1, title: 'Meeting with team', category: 'work', date: '04', attachments: 4, completed: false },
    { id: 2, title: 'Update project roadmap', category: 'work', date: '07', attachments: 7, completed: false },
    { id: 3, title: 'Gym session', category: 'personal', date: 'Today', attachments: 0, completed: true },
    { id: 4, title: 'Research new technologies', category: 'study', date: '10', attachments: 3, completed: false },
    { id: 5, title: 'Client presentation prep', category: 'important', date: 'Tomorrow', attachments: 5, completed: false },
    { id: 6, title: 'Review quarterly reports', category: 'work', date: '15', attachments: 2, completed: false },
  ]

  // Filter tasks based on active tab
  const filteredTasks = activeTab === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === activeTab)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (backendError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
              <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
            <p className="text-gray-600 mb-4">{backendError}</p>
            
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium"
              >
                Retry Connection
              </button>
              
              <button
                onClick={() => router.push('/auth/login')}
                className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50"
              >
                Go to Login Page
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top Navigation */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Time */}
            <div className="flex items-center space-x-6">
              <div className="text-2xl font-bold text-gray-900">
                TaskFlow
              </div>
              <div className="hidden md:block text-sm text-gray-600 font-medium">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>

            {/* Right side - User and Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div className="relative group">
                <button className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.name?.[0] || user.email[0].toUpperCase()}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{user.name || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <div className="p-2">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>Edit Profile</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>Settings</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md flex items-center space-x-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Welcome Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="mb-6">
                <h1 className="text-2xl font-bold mb-2">Perfect for you</h1>
                <p className="text-blue-100 opacity-90">
                  A design that makes it easier to complete your projects
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">Kristin Watson</p>
                    <p className="text-sm opacity-80">{user.email}</p>
                  </div>
                  <button className="ml-auto p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>

                <Link
                  href="/tasks"
                  className="block w-full bg-white text-gray-900 font-semibold py-3 rounded-xl text-center hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Go to Tasks
                </Link>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === 'all' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-50'}`}
                >
                  <span className="font-medium">All Tasks</span>
                  <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {tasks.length}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === 'personal' ? 'bg-purple-50 text-purple-600 border border-purple-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Personal</span>
                  </div>
                  <span className="text-sm bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                    {tasks.filter(t => t.category === 'personal').length}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('work')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === 'work' ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Work</span>
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                    {tasks.filter(t => t.category === 'work').length}
                  </span>
                </button>
                
                <button
                  onClick={() => setActiveTab('important')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${activeTab === 'important' ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="font-medium">Important</span>
                  </div>
                  <span className="text-sm bg-amber-100 text-amber-600 px-2 py-1 rounded-full">
                    {tasks.filter(t => t.category === 'important').length}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="lg:col-span-2 space-y-8">
            {/* Search and Greeting */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Hello, {user.name?.split(' ')[0] || 'there'}! 👋
                </h2>
                <p className="text-gray-600 mb-6">
                  Here's what's happening with your tasks today
                </p>

                {/* Notification */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Camp Buddy</p>
                      <p className="text-sm text-gray-600">Has sent you a message</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-500">2 min ago</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <span>{task.date}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>{task.attachments} files</span>
                        </span>
                      </div>
                    </div>
                    <button className={`p-2 rounded-lg ${task.completed ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:bg-gray-100'}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={task.completed ? "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" : "M9 12l2 2 4-4"} />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.category === 'personal' ? 'bg-purple-100 text-purple-800' :
                      task.category === 'work' ? 'bg-blue-100 text-blue-800' :
                      task.category === 'important' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                    </span>
                    
                    <button className="text-gray-500 hover:text-gray-700 p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* All Activity Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">All Activity</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center space-x-1">
                  <span>See More</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Created new task</p>
                    <p className="text-xs text-gray-500">Meeting with design team</p>
                  </div>
                  <span className="text-xs text-gray-500">10 min ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Completed task</p>
                    <p className="text-xs text-gray-500">Review client feedback</p>
                  </div>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>

                <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Updated profile</p>
                    <p className="text-xs text-gray-500">Changed profile picture</p>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}