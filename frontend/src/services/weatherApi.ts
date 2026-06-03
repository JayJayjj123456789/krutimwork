import API from './api'
import { ApiResponse, WeatherData } from '../types'

export const getWeather = async (city: string = 'Bangkok', signal?: AbortSignal): Promise<WeatherData> => {
  const r = await API.get<ApiResponse<WeatherData>>(`/weather?city=${encodeURIComponent(city)}`, { signal })
  if (!r.data.success) throw new Error(r.data.error || 'Failed to fetch weather')
  return r.data.data
}
