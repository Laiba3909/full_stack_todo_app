// app/components/BackendStatus.tsx
'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

export default function BackendStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  const [message, setMessage] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    checkBackend()
  }, [])

  const checkBackend = async () => {
    try {
      setStatus('checking')
      setMessage('Checking backend connection...')
      
      // Try multiple endpoints
      const endpoints = ['/health', '/docs', '/redoc', '/openapi.json']
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`http://localhost:8000${endpoint}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
          })
          
          if (response.ok) {
            setStatus('connected')
            setMessage(`✅ Backend connected at http://localhost:8000`)
            return
          }
        } catch (err) {
          // Continue to next endpoint
        }
      }
      
      // If all endpoints fail
      setStatus('error')
      setMessage('❌ Cannot connect to backend. Make sure it is running on http://localhost:8000')
      
    } catch (err: any) {
      setStatus('error')
      setMessage(`Error: ${err.message}`)
    }
  }

  if (status === 'connected' && !showDetails) {
    return null // Hide when connected and not showing details
  }

  return (
    <div className={`fixed bottom-4 left-4 p-4 rounded-lg shadow-lg z-50 max-w-md ${
      status === 'connected' ? 'bg-green-50 border border-green-200' :
      status === 'error' ? 'bg-red-50 border border-red-200' :
      'bg-yellow-50 border border-yellow-200'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className={`font-semibold ${
            status === 'connected' ? 'text-green-800' :
            status === 'error' ? 'text-red-800' :
            'text-yellow-800'
          }`}>
            {status === 'connected' ? 'Backend Connected' :
             status === 'error' ? 'Connection Error' :
             'Checking Connection...'}
          </h4>
          <p className={`text-sm mt-1 ${
            status === 'connected' ? 'text-green-700' :
            status === 'error' ? 'text-red-700' :
            'text-yellow-700'
          }`}>
            {message}
          </p>
        </div>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={checkBackend}
            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
          >
            Retry
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-4 pt-4 border-t">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Common Issues:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>1. Backend not running: <code className="bg-gray-100 px-1">python main.py</code></li>
            <li>2. Wrong port: Should be <code className="bg-gray-100 px-1">localhost:8000</code></li>
            <li>3. CORS issue: Check backend CORS configuration</li>
            <li>4. Check terminal for backend errors</li>
          </ul>
          <div className="mt-3 flex space-x-2">
            <a 
              href="http://localhost:8000/docs" 
              target="_blank"
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Open API Docs
            </a>
            <button
              onClick={() => window.open('http://localhost:8000/health', '_blank')}
              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Test Health
            </button>
          </div>
        </div>
      )}
    </div>
  )
}