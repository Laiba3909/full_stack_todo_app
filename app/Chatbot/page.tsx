// app/chatbot/page.tsx - Full page chatbot
'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

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

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '✨ **Welcome to AI Task Assistant!** ✨\n\nI can help you manage your tasks directly from here!\n\n**💡 Available Commands:**\n• `add [task]` - Add a new task\n• `list tasks` - Show all tasks\n• `complete task [number]` - Mark task as done\n• `delete task [number]` - Remove a task\n• `clear all` - Delete all tasks\n• `help` - Show all commands\n\n**📝 Examples:**\n• `add washing clothes tomorrow`\n• `complete task 1`\n• `what tasks do I have?`\n\nTry a command below!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
    inputRef.current?.focus()
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
  }

  // Process user commands
  const processCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim()
    
    // Add task command
    if (lowerCommand.startsWith('add ') || lowerCommand.startsWith('create ') || lowerCommand.startsWith('new ')) {
      const taskTitle = command.substring(command.indexOf(' ') + 1).trim()
      if (!taskTitle) {
        return "❌ Please provide a task title. Example: 'add washing clothes'"
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
      return `✅ **Task Added Successfully!**\n\n📝 **Task:** ${taskTitle}\n⏰ **Created:** ${new Date().toLocaleTimeString()}\n📊 **Status:** Pending\n\nView all tasks in the Tasks page or type 'list tasks'`
    }
    
    // List tasks command
    if (lowerCommand.includes('list') || lowerCommand.includes('show') || lowerCommand.includes('view') || lowerCommand.includes('what tasks')) {
      const tasks = getTasks()
      if (tasks.length === 0) {
        return "📭 **No Tasks Found**\n\nYou don't have any tasks yet. Use `add [task]` to create your first task!\n\nExample: `add washing clothes`"
      }
      
      let response = "📋 **Your Tasks:**\n\n"
      tasks.forEach((task, index) => {
        const emoji = task.status === 'completed' ? '✅' : '⏳'
        response += `${index + 1}. **${task.title}** ${emoji}\n`
        if (task.description) {
          response += `   📝 ${task.description}\n`
        }
        response += `   📅 Created: ${new Date(task.created_at).toLocaleDateString()}\n`
        if (task.due_date) {
          response += `   ⏰ Due: ${new Date(task.due_date).toLocaleDateString()}\n`
        }
        response += `   🎯 Priority: ${task.priority}/5\n\n`
      })
      
      response += "**💡 Quick Actions:**\n• Complete a task: `complete task [number]`\n• Delete a task: `delete task [number]`\n• Add new task: `add [task description]`"
      return response
    }
    
    // Complete task command
    if (lowerCommand.startsWith('complete ') || lowerCommand.startsWith('finish ') || lowerCommand.startsWith('done ')) {
      const match = lowerCommand.match(/\d+/)
      if (!match) {
        return "❌ Please specify a task number. Example: 'complete task 1'"
      }
      
      const taskIndex = parseInt(match[0]) - 1
      const tasks = getTasks()
      
      if (taskIndex < 0 || taskIndex >= tasks.length) {
        return `❌ **Task Not Found**\n\nTask ${taskIndex + 1} doesn't exist. You have ${tasks.length} tasks.\nType 'list tasks' to see all your tasks.`
      }
      
      if (tasks[taskIndex].status === 'completed') {
        return `ℹ️ **Task Already Completed**\n\nTask ${taskIndex + 1} "${tasks[taskIndex].title}" is already marked as completed.`
      }
      
      tasks[taskIndex].status = 'completed'
      tasks[taskIndex].updated_at = new Date().toISOString()
      saveTasks(tasks)
      return `🎉 **Task Completed!**\n\n✅ Task ${taskIndex + 1} marked as completed:\n**"${tasks[taskIndex].title}"**\n\nGreat job! 🎊`
    }
    
    // Delete task command
    if (lowerCommand.startsWith('delete ') || lowerCommand.startsWith('remove ')) {
      const match = lowerCommand.match(/\d+/)
      if (!match) {
        return "❌ Please specify a task number. Example: 'delete task 1'"
      }
      
      const taskIndex = parseInt(match[0]) - 1
      const tasks = getTasks()
      
      if (taskIndex < 0 || taskIndex >= tasks.length) {
        return `❌ **Task Not Found**\n\nTask ${taskIndex + 1} doesn't exist. You have ${tasks.length} tasks.`
      }
      
      const deletedTask = tasks.splice(taskIndex, 1)[0]
      saveTasks(tasks)
      return `🗑️ **Task Deleted**\n\nTask ${taskIndex + 1} has been removed:\n**"${deletedTask.title}"**\n\nYou now have ${tasks.length} tasks remaining.`
    }
    
    // Clear all tasks
    if (lowerCommand.includes('clear all') || lowerCommand.includes('delete all')) {
      if (confirm('⚠️ **Warning:** Are you sure you want to delete ALL tasks?')) {
        saveTasks([])
        return "🧹 **All Tasks Cleared**\n\nAll your tasks have been deleted. Start fresh with `add [new task]`!"
      }
      return "❌ **Operation Cancelled**\n\nYour tasks are safe. No changes were made."
    }
    
    // Help command
    if (lowerCommand.includes('help')) {
      return `🤖 **AI Task Assistant - Help Guide**\n\n**📌 TASK MANAGEMENT:**\n• \`add [task]\` - Add new task\n• \`list tasks\` - Show all tasks\n• \`complete task [number]\` - Mark as done\n• \`delete task [number]\` - Remove task\n• \`clear all\` - Delete all tasks\n\n**🎯 EXAMPLES:**\n• \`add grocery shopping tomorrow\`\n• \`complete task 1\`\n• \`what tasks do I have?\`\n• \`delete task 3\`\n\n**🔗 OTHER PAGES:**\n• **Tasks Page** - Full task management\n• **Dashboard** - Overview\n\nType a command to get started! 👇`
    }
    
    // Greetings
    if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('hey')) {
      return `👋 **Hello there!**\n\nI'm your AI Task Assistant. I can help you manage your tasks.\n\nTry:\n• \`add washing clothes\`\n• \`list tasks\`\n• \`help\` for all commands\n\nHow can I assist you today? 😊`
    }
    
    // Default response
    return `🤔 **I understand:** "${command}"\n\n💡 **I can help you with:**\n• Adding tasks: \`add [your task]\`\n• Viewing tasks: \`list tasks\`\n• Completing tasks: \`complete task 1\`\n• Deleting tasks: \`delete task 2\`\n\n🔍 **Need help?** Type \`help\` for all commands.\n\nTry one of these examples! ✨`
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
    }, 600)
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
        content: '✨ **Welcome to AI Task Assistant!** ✨\n\nI can help you manage your tasks directly from here!\n\n**💡 Available Commands:**\n• `add [task]` - Add a new task\n• `list tasks` - Show all tasks\n• `complete task [number]` - Mark task as done\n• `delete task [number]` - Remove a task\n• `clear all` - Delete all tasks\n• `help` - Show all commands\n\n**📝 Examples:**\n• `add washing clothes tomorrow`\n• `complete task 1`\n• `what tasks do I have?`\n\nTry a command below!',
        timestamp: new Date(),
      },
    ])
  }

  const quickActions = [
    { text: 'Add Task', emoji: '➕', prompt: 'add washing clothes tomorrow' },
    { text: 'View Tasks', emoji: '📋', prompt: 'list tasks' },
    { text: 'Complete Task', emoji: '✅', prompt: 'complete task 1' },
    { text: 'Get Help', emoji: '❓', prompt: 'help' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800/80 to-pink-700/80 backdrop-blur-sm border-b border-purple-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">AI Task Assistant</h1>
                <p className="text-purple-200">Manage your tasks with AI power</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/tasks"
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors border border-white/30"
              >
                📋 Tasks Page
              </Link>
              <Link
                href="/"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                🏠 Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Chat Container */}
        <div className="bg-gradient-to-b from-gray-800/90 to-gray-900/90 rounded-2xl shadow-2xl overflow-hidden border border-purple-700/30">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-purple-700/80 to-pink-600/80 p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Chat with AI Assistant</h2>
                <p className="text-purple-200">Type commands to manage your tasks</p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={clearChat}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
                  title="Clear chat"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="px-6 py-4 bg-gray-800/50 border-b border-gray-700">
            <p className="text-sm text-gray-300 mb-3">💡 Quick Actions:</p>
            <div className="flex flex-wrap gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.text}
                  onClick={() => handleQuickAction(action.prompt)}
                  className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600 rounded-xl text-gray-200 hover:from-gray-600 hover:to-gray-700 hover:border-purple-500 transition-all hover:scale-105 active:scale-95"
                  disabled={isLoading}
                >
                  <span className="text-lg">{action.emoji}</span>
                  <span className="font-medium">{action.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Container */}
          <div className="h-[60vh] overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-4 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none shadow-lg'
                      : 'bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-bl-none border border-gray-700 shadow-lg'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                  <div className={`text-xs mt-3 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-gray-100 rounded-2xl rounded-bl-none px-5 py-4 border border-gray-700">
                  <div className="flex items-center space-x-3">
                    <div className="flex space-x-1">
                      <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce"></div>
                      <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2.5 h-2.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                    <span className="text-sm text-purple-300">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-700 p-6 bg-gray-900/50">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your command here... (e.g., 'add washing clothes')"
                  className="w-full px-5 py-4 bg-gray-800 border-2 border-gray-700 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all text-base"
                  disabled={isLoading}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                />
                <div className="absolute right-3 top-3.5 text-gray-500 text-sm">
                  Press Enter to send
                </div>
              </div>
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>Send</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <p className="text-gray-400 text-sm">
                💡 Try: <span className="text-purple-300 cursor-pointer hover:underline" onClick={() => handleQuickAction('add grocery shopping')}>add grocery shopping</span> • 
                <span className="text-purple-300 cursor-pointer hover:underline ml-3" onClick={() => handleQuickAction('list tasks')}>list tasks</span> • 
                <span className="text-purple-300 cursor-pointer hover:underline ml-3" onClick={() => handleQuickAction('help')}>help</span>
              </p>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="text-xl font-bold text-white">Add Tasks</h3>
            </div>
            <p className="text-gray-300">Simply type "add [your task]" and it will be saved to your task list automatically.</p>
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <code className="text-purple-300 text-sm">add washing clothes tomorrow</code>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-xl font-bold text-white">Complete Tasks</h3>
            </div>
            <p className="text-gray-300">Mark tasks as completed by typing "complete task [number]". View tasks with "list tasks".</p>
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <code className="text-blue-300 text-sm">complete task 1</code>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-2xl border border-gray-700">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-pink-500/20 rounded-lg">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-xl font-bold text-white">Sync Everywhere</h3>
            </div>
            <p className="text-gray-300">Tasks are saved in your browser and sync with the Tasks page. No account needed!</p>
            <div className="mt-4">
              <Link href="/tasks" className="inline-flex items-center text-pink-400 hover:text-pink-300">
                <span>Go to Tasks Page</span>
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}