// /**
//  * API client configuration - FIXED error handling
//  */

// import axios from 'axios'

// // Use the exact URL that works
// const API_URL = 'http://localhost:8000'

// console.log('🎯 API URL configured:', API_URL)

// // Create axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//     'Accept': 'application/json',
//   },
//   timeout: 10000,
// })

// // Request interceptor
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token')
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
//     return config
//   },
//   (error) => {
//     console.error('❌ Request setup error:', error)
//     return Promise.reject(error)
//   }
// )

// // Response interceptor - FIXED
// api.interceptors.response.use(
//   (response) => {
//     console.log(`✅ ${response.status} ${response.config.url}`)
//     return response.data
//   },
//   (error) => {
//     // Extract error details safely
//     const errorDetails = {
//       message: error.message || 'Unknown error',
//       code: error.code,
//       status: error.response?.status,
//       statusText: error.response?.statusText,
//       url: error.config?.url,
//       baseURL: error.config?.baseURL,
//       requestData: error.config?.data,
//       responseData: error.response?.data,
//       isNetworkError: !error.response,
//       isTimeout: error.code === 'ECONNABORTED',
//     }
    
//     // Stringify for console to avoid serialization issues
//     console.error('❌ API Error:', JSON.stringify(errorDetails, null, 2))
    
//     // For network errors
//     if (!error.response) {
//       return Promise.reject({
//         message: `Cannot connect to server at ${API_URL}. Please make sure backend is running.`,
//         status: 0,
//         isNetworkError: true,
//       })
//     }
    
//     // Return a clean error for the UI
//     return Promise.reject({
//       message: error.response.data?.error?.message || error.message || 'Request failed',
//       status: error.response.status,
//       data: error.response.data,
//     })
//   }
// )

// export default api

// lib/api.ts - FIXED
import axios from 'axios'

// Use the exact URL that works
const API_URL = 'http://localhost:8000'

console.log('🎯 API URL configured:', API_URL)

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ Request setup error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - FIXED: Return only data
api.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.status} ${response.config.url}`)
    return response.data // Return only the data, not the full response
  },
  (error) => {
    // Extract error details safely
    const errorDetails = {
      message: error.message || 'Unknown error',
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      requestData: error.config?.data,
      responseData: error.response?.data,
      isNetworkError: !error.response,
      isTimeout: error.code === 'ECONNABORTED',
    }
    
    // Stringify for console to avoid serialization issues
    console.error('❌ API Error:', JSON.stringify(errorDetails, null, 2))
    
    // For network errors
    if (!error.response) {
      return Promise.reject({
        message: `Cannot connect to server at ${API_URL}. Please make sure backend is running.`,
        status: 0,
        isNetworkError: true,
      })
    }
    
    // Return a clean error for the UI
    return Promise.reject({
      message: error.response.data?.detail || error.response.data?.message || error.message || 'Request failed',
      status: error.response.status,
      data: error.response.data,
    })
  }
)

export default api