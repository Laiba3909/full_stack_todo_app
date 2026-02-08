// app/components/ApiDebug.tsx
'use client'

import { useState } from 'react'
import api from '@/lib/api'

export default function ApiDebug() {
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const testApi = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)
    
    try {
      const result = await api.get('/tasks')
      setResponse(result)
      console.log('API Response:', result)
    } catch (err: any) {
      setError(err)
      console.error('API Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const testHealth = async () => {
    setIsLoading(true)
    setError(null)
    setResponse(null)
    
    try {
      const result = await api.get('/health')
      setResponse(result)
      console.log('Health Response:', result)
    } catch (err: any) {
      setError(err)
      console.error('Health Error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 max-w-md border">
      <h3 className="font-bold text-lg mb-2">API Debugger</h3>
      
      <div className="flex space-x-2 mb-4">
        <button
          onClick={testApi}
          disabled={isLoading}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test /tasks
        </button>
        <button
          onClick={testHealth}
          disabled={isLoading}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test /health
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 p-3 rounded mb-3">
          <h4 className="font-semibold text-red-700">Error</h4>
          <pre className="text-sm text-red-600 mt-1 overflow-auto max-h-40">
            {JSON.stringify(error, null, 2)}
          </pre>
        </div>
      )}

      {response && (
        <div className="bg-green-50 border border-green-200 p-3 rounded">
          <h4 className="font-semibold text-green-700">Response</h4>
          <div className="text-sm text-gray-700 mt-1">
            <p><strong>Type:</strong> {typeof response}</p>
            <p><strong>Is Array:</strong> {Array.isArray(response).toString()}</p>
            <p><strong>Keys:</strong> {typeof response === 'object' ? Object.keys(response).join(', ') : 'N/A'}</p>
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer text-sm text-blue-600">View Raw Response</summary>
            <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto max-h-60">
              {JSON.stringify(response, null, 2)}
            </pre>
          </details>
        </div>
      )}

      <div className="mt-4 pt-4 border-t text-xs text-gray-600">
        <p>This debugger helps you see what your API is returning.</p>
        <p className="mt-1">Check browser console for detailed logs.</p>
      </div>
    </div>
  )
}