import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

export const getWeather = (city: string = 'Bangkok') =>
  API.get(`/weather?city=${city}`).then(r => r.data)
