// app/components/ChatbotLocal.tsx
'use client'

import { useState, useRef, useEffect } from 'react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'completed'
  due_date?: string
  priority: number
  created_at: string
  updated_at: string
}

interface ChatbotLocalProps {
  defaultOpen?: boolean
  onTaskUpdate?: () => void
}

export default function ChatbotLocal({ defaultOpen = false, onTaskUpdate }: ChatbotLocalProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI task assistant. I can help you:\n• Add tasks (e.g., "add washing clothes tomorrow")\n• List tasks\n• Complete tasks (e.g., "complete task 1")\n• Delete tasks (e.g., "delete task 2")\n\nHow can I help you today?',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load tasks from localStorage
  const getTasks = (): Task[] => {
    try {
      const tasks = localStorage.getItem('tasks')
      return tasks ? JSON.parse(tasks) : []
    } catch {
      return []
    }
  }

  // Save tasks to localStorage
  const saveTasks = (tasks: Task[]) => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
    if (onTaskUpdate) onTaskUpdate()
  }

  // Process user commands
  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim()
    
    // Add task command
    if (lowerCommand.startsWith('add ') || lowerCommand.startsWith('create ') || lowerCommand.startsWith('new ')) {
      const taskTitle = command.substring(command.indexOf(' ') + 1).trim()
      if (!taskTitle) {
        return "Please provide a task title. Example: 'add washing clothes'"
      }
      
      const tasks = getTasks()
      const newTask: Task = {
        id: Date.now().toString(),
        title: taskTitle,
        description: '',
        status: 'pending',
        priority: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      
      tasks.push(newTask)
      saveTasks(tasks)
      return `✅ Task added successfully: "${taskTitle}"`
    }
    
    // List tasks command
    if (lowerCommand.includes('list') || lowerCommand.includes('show') || lowerCommand.includes('view')) {
      const tasks = getTasks()
      if (tasks.length === 0) {
        return "You don't have any tasks yet. Use 'add [task]' to create one!"
      }
      
      let response = "📋 Your Tasks:\n"
      tasks.forEach((task, index) => {
        response += `${index + 1}. ${task.title} [${task.status === 'completed' ? '✅' : '⏳'}]\n`
      })
      response += "\nTo complete a task: 'complete task [number]'\nTo delete a task: 'delete task [number]'"
      return response
    }
    
    // Complete task command
    if (lowerCommand.startsWith('complete ') || lowerCommand.startsWith('finish ') || lowerCommand.startsWith('done ')) {
      const match = lowerCommand.match(/\d+/)
      if (!match) {
        return "Please specify a task number. Example: 'complete task 1'"
      }
      
      const taskIndex = parseInt(match[0]) - 1
      const tasks = getTasks()
      
      if (taskIndex < 0 || taskIndex >= tasks.length) {
        return `Task ${taskIndex + 1} doesn't exist. You have ${tasks.length} tasks.`
      }
      
      tasks[taskIndex].status = 'completed'
      tasks[taskIndex].updated_at = new Date().toISOString()
      saveTasks(tasks)
      return `✅ Task ${taskIndex + 1} marked as completed: "${tasks[taskIndex].title}"`
    }
    
    // Delete task command
    if (lowerCommand.startsWith('delete ') || lowerCommand.startsWith('remove ')) {
      const match = lowerCommand.match(/\d+/)
      if (!match) {
        return "Please specify a task number. Example: 'delete task 1'"
      }
      
      const taskIndex = parseInt(match[0]) - 1
      const tasks = getTasks()
      
      if (taskIndex < 0 || taskIndex >= tasks.length) {
        return `Task ${taskIndex + 1} doesn't exist. You have ${tasks.length} tasks.`
      }
      
      const deletedTask = tasks.splice(taskIndex, 1)[0]
      saveTasks(tasks)
      return `🗑️ Task ${taskIndex + 1} deleted: "${deletedTask.title}"`
    }
    
    // Clear all tasks
    if (lowerCommand.includes('clear all') || lowerCommand.includes('delete all')) {
      if (confirm('Are you sure you want to delete all tasks?')) {
        saveTasks([])
        return "🗑️ All tasks have been deleted."
      }
      return "Task deletion cancelled."
    }
    
    // Help command
    if (lowerCommand.includes('help') || lowerCommand.includes('what can you do')) {
      return `🤖 **Available Commands:**

**Task Management:**
• "add [task]" - Add a new task
• "list tasks" - Show all tasks
• "complete task [number]" - Mark task as done
• "delete task [number]" - Remove a task
• "clear all" - Delete all tasks

**Examples:**
• "add washing clothes tomorrow"
• "complete task 1"
• "delete task 2"
• "what tasks do I have?"

Type your command and I'll help you!`
    }
    
    // Default response for unknown commands
    return `I understand you said: "${command}"\n\nI can help you with:\n• Adding tasks: "add washing clothes"\n• Listing tasks: "list tasks"\n• Completing tasks: "complete task 1"\n• Deleting tasks: "delete task 2"\n\nTry one of these commands or type "help" for more options!`
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    // Simulate AI thinking
    setTimeout(() => {
      const response = processCommand(input)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 500)
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    setTimeout(() => {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent
      handleSendMessage(fakeEvent)
    }, 100)
  }

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: 'Hello! I\'m your AI task assistant. I can help you:\n• Add tasks (e.g., "add washing clothes tomorrow")\n• List tasks\n• Complete tasks (e.g., "complete task 1")\n• Delete tasks (e.g., "delete task 2")\n\nHow can I help you today?',
        timestamp: new Date(),
      },
    ])
  }

  const quickActions = [
    { text: 'Add a task', emoji: '➕', prompt: 'add washing clothes' },
    { text: 'List tasks', emoji: '📋', prompt: 'list tasks' },
    { text: 'Complete task', emoji: '✅', prompt: 'complete task 1' },
    { text: 'Ask for help', emoji: '❓', prompt: 'help' },
  ]

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full p-5 shadow-2xl transition-all hover:scale-110 z-40 animate-bounce"
          aria-label="Open AI Assistant"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
            AI
          </span>
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Chat Container */}
          <div className="absolute bottom-0 right-0 w-full max-w-md h-3/4 md:h-5/6 flex flex-col bg-gradient-to-b from-gray-900 to-gray-800 rounded-t-xl md:rounded-xl shadow-2xl overflow-hidden md:bottom-6 md:right-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">AI Task Assistant</h3>
                    <p className="text-sm opacity-90">Powered by Local AI</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={clearChat}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                    title="Clear chat"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
              <p className="text-sm text-gray-300 mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <button
                    key={action.text}
                    onClick={() => handleQuickAction(action.prompt)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-gray-700 border border-gray-600 rounded-lg text-sm text-gray-200 hover:bg-gray-600 transition-colors hover:scale-105 active:scale-95"
                    disabled={isLoading}
                  >
                    <span>{action.emoji}</span>
                    <span>{action.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-none'
                        : 'bg-gray-700 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-gray-100 rounded-2xl rounded-bl-none px-4 py-3">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm text-gray-400">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your command here..."
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition disabled:bg-gray-800"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-4 py-3 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[44px] flex items-center justify-center hover:scale-105 active:scale-95"
                  aria-label="Send message"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}