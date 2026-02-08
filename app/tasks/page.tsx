// app/tasks/page.tsx - UPDATED
'use client'

import { useState, useEffect } from 'react'
import TaskListLocal from '@/app/components/TaskList'
import TaskFormLocal from '@/app/components/TaskForm'
import ChatbotLocal from '@/app/components/Chatbot'
import Link from 'next/link'

export default function TasksPage() {
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [taskCount, setTaskCount] = useState(0)

  const handleTaskCreated = () => {
    setShowTaskForm(false)
    setRefreshTrigger(prev => prev + 1)
    updateTaskCount()
  }

  const updateTaskCount = () => {
    try {
      const tasks = localStorage.getItem('tasks')
      const count = tasks ? JSON.parse(tasks).length : 0
      setTaskCount(count)
    } catch {
      setTaskCount(0)
    }
  }

  useEffect(() => {
    updateTaskCount()
  }, [])

  return (
    <>
      {/* Chatbot Floating Button */}
      <ChatbotLocal onTaskUpdate={updateTaskCount} />
      
      {/* Task Creation Modal */}
      {showTaskForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <TaskFormLocal
            onClose={() => setShowTaskForm(false)}
            onSuccess={handleTaskCreated}
          />
        </div>
      )}

      {/* Main Page Content */}
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Task Manager</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <p className="text-blue-100">Manage all your tasks in one place</p>
                  <div className="bg-white/20 px-3 py-1 rounded-full text-sm">
                    📊 {taskCount} tasks
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                <Link
                  href="/Chatbot"
                  className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white rounded-lg font-medium transition-all hover:scale-105"
                >
                  🤖 AI Assistant
                </Link>
                <Link
                  href="/"
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-colors border border-white/30"
                >
                  ← Dashboard
                </Link>
                <button
                  onClick={() => setShowTaskForm(true)}
                  className="px-4 py-2 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-medium transition-all hover:scale-105 shadow-lg"
                >
                  + New Task
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Tasks</p>
                  <p className="text-3xl font-bold text-gray-900">{taskCount}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <span className="text-2xl">📝</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Storage</p>
                  <p className="text-3xl font-bold text-gray-900">Local</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <span className="text-2xl">💾</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">AI Assistant</p>
                  <p className="text-3xl font-bold text-gray-900">Ready</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <span className="text-2xl">🤖</span>
                </div>
              </div>
            </div>
          </div>

          {/* Task List Section */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Your Tasks</h2>
                  <p className="text-gray-600 mt-1">Filter and manage your tasks</p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setRefreshTrigger(prev => prev + 1)}
                    className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    🔄 Refresh
                  </button>
                  {taskCount > 0 && (
                    <button
                      onClick={() => {
                        if (confirm('Delete all tasks?')) {
                          localStorage.removeItem('tasks')
                          setRefreshTrigger(prev => prev + 1)
                          updateTaskCount()
                        }
                      }}
                      className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      🗑️ Clear All
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="p-6">
              <TaskListLocal key={refreshTrigger} filter="all" refreshTrigger={refreshTrigger} />
            </div>
          </div>

          {/* Tip Box */}
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">💡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pro Tip: Use AI Assistant</h3>
                <p className="text-gray-700 mt-1">
                  Try the AI Assistant (floating button bottom-right) to manage tasks with voice-like commands:
                </p>
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-white/70 p-3 rounded-lg border border-blue-100">
                    <code className="text-sm text-blue-600">add washing clothes</code>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg border border-blue-100">
                    <code className="text-sm text-blue-600">list tasks</code>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg border border-blue-100">
                    <code className="text-sm text-blue-600">complete task 1</code>
                  </div>
                  <div className="bg-white/70 p-3 rounded-lg border border-blue-100">
                    <code className="text-sm text-blue-600">delete task 2</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}