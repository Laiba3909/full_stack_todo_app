// lib/api-wrapper.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios'

const API_URL = 'http://localhost:8000'

// Create base axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    return Promise.reject(error)
  }
)

// API wrapper that always returns data
export const api = {
  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await axiosInstance.get(url, config)
    return response.data
  },
  
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await axiosInstance.post(url, data, config)
    return response.data
  },
  
  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await axiosInstance.put(url, data, config)
    return response.data
  },
  
  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    const response = await axiosInstance.patch(url, data, config)
    return response.data
  },
  
  async delete<T = any>(url: string, config?: any): Promise<T> {
    const response = await axiosInstance.delete(url, config)
    return response.data
  }
}

export default api