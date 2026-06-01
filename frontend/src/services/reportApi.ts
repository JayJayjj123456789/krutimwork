import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

export const getReports = (userId: number, week?: string) =>
  API.get(`/reports?userId=${userId}${week ? '&week=' + week : ''}`).then(r => r.data)
