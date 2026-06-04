import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { auth } from '../config/firebase'

const API: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30_000,
})

API.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const user = auth.currentUser
  if (user) {
    try {
      const token = await user.getIdToken()
      config.headers.set('Authorization', `Bearer ${token}`)
    } catch (e) {
      console.warn('[API] failed to get ID token:', e)
    }
  }
  return config
})

API.interceptors.response.use(
  (res) => {
    console.log(`[API] ${res.status} ${res.config.url} OK`)
    return res
  },
  async (err) => {
    const status = err.response?.status
    const original = err.config as (InternalAxiosRequestConfig & { __isRetry?: boolean }) | undefined

    if (status === 401 && original && !original.__isRetry) {
      const user = auth.currentUser
      if (user) {
        try {
          const freshToken = await user.getIdToken(true)
          original.headers.set('Authorization', `Bearer ${freshToken}`)
          original.__isRetry = true
          return API.request(original)
        } catch (refreshErr) {
          console.warn('[API] token refresh failed:', refreshErr)
        }
      }
      window.dispatchEvent(new CustomEvent('auth:unauthorized'))
    }

    console.error(`[API] ERROR ${status || 'NO_RESPONSE'} ${original?.url}:`, err.response?.data || err.message)
    return Promise.reject(err)
  }
)

export default API
