import axios, { AxiosInstance } from 'axios'

const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30_000,
})

API.interceptors.request.use((config) => {
  config.headers['x-user-id'] = localStorage.getItem('userId') || '1'
  return config
})

export default API
