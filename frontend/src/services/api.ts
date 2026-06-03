import axios, { AxiosInstance } from 'axios'

const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30_000,
})

API.interceptors.response.use(
  (res) => {
    console.log(`[API] ${res.status} ${res.config.url} OK`)
    return res
  },
  (err) => {
    if (err.response?.status === 401) {
      window.location.href = '/login'
    }
    console.error(`[API] ERROR ${err.response?.status || 'NO_RESPONSE'} ${err.config?.url}:`, err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export default API
