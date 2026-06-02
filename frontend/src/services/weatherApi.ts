import API from './api'

export const getWeather = async (city: string = 'Bangkok', signal?: AbortSignal) => {
  const r = await API.get(`/weather?city=${encodeURIComponent(city)}`, { signal })
  if (!r.data.success) throw new Error(r.data.error || 'Failed to fetch weather')
  return r.data.data
}
