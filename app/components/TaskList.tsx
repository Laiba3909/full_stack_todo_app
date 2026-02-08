// app/components/TaskListLocal.tsx
'use client'

import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description?: string
  status: string
  due_date?: string
  priority: number
  created_at: string
  updated_at: string
}

interface TaskListLocalProps {
  filter?: 'all' | 'pending' | 'completed'
  refreshTrigger?: number
}

export default function TaskListLocal({ filter = 'all', refreshTrigger = 0 }: TaskListLocalProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>(filter)
  const [sortBy, setSortBy] = useState<'created' | 'due' | 'priority'>('created')

  const loadTasks = () => {
    setIsLoading(true)
    try {
      const savedTasks = localStorage.getItem('tasks')
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks)
        setTasks(parsedTasks)
      } else {
        setTasks([])
      }
      setError('')
    } catch (err: any) {
      setError(`Error loading tasks: ${err.message}`)
      setTasks([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteTask = (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return
    
    const updatedTasks = tasks.filter(task => task.id !== taskId)
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  const handleToggleComplete = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed',
          updated_at: new Date().toISOString()
        }
      }
      return task
    })
    
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
  }

  useEffect(() => {
    loadTasks()
  }, [refreshTrigger])

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true
    return task.status === activeFilter
  })

  // Sort tasks
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'due':
        if (!a.due_date) return 1
        if (!b.due_date) return -1
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
      case 'priority':
        return a.priority - b.priority
      default: // created
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1: return 'bg-red-100 text-red-800'
      case 2: return 'bg-orange-100 text-orange-800'
      case 3: return 'bg-yellow-100 text-yellow-800'
      case 4: return 'bg-blue-100 text-blue-800'
      case 5: return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No due date'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
        <p className="text-gray-600">Create your first task using the "New Task" button!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters and Sorting */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {(['all', 'pending', 'completed'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setActiveFilter(filterOption)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === filterOption
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm"
        >
          <option value="created">Sort by: Created Date</option>
          <option value="due">Sort by: Due Date</option>
          <option value="priority">Sort by: Priority</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {sortedTasks.map((task) => (
          <div
            key={task.id}
            className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6 ${
              task.status === 'completed' ? 'opacity-75' : ''
            }`}
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className={`mt-1 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      task.status === 'completed'
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 hover:border-green-500'
                    }`}
                  >
                    {task.status === 'completed' && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  
                  <div className="flex-1">
                    <h3 className={`font-medium text-gray-900 ${task.status === 'completed' ? 'line-through' : ''}`}>
                      {task.title}
                    </h3>
                    
                    {task.description && (
                      <p className="mt-1 text-gray-600 text-sm">{task.description}</p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        Priority {task.priority}
                      </span>
                      
                      {task.due_date && (
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(task.due_date)}
                        </span>
                      )}
                      
                      <span className="px-2 py-1 text-xs bg-blue-50 text-blue-800 rounded-full">
                        {task.status === 'completed' ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  title="Delete task"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}