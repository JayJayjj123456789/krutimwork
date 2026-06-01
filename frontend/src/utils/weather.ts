import { RiskLevel } from '../types'

export function formatTemperature(celsius: number): string {
  return `${Math.round(celsius)}°C`
}

export function aqiText(aqi: number): string {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

export function aqiLevel(aqi: number): RiskLevel {
  if (aqi <= 50) return 'low'
  if (aqi <= 100) return 'moderate'
  if (aqi <= 150) return 'high'
  return 'very_high'
}

export function uvText(uv: number): string {
  if (uv <= 2) return 'Low'
  if (uv <= 5) return 'Moderate'
  if (uv <= 7) return 'High'
  if (uv <= 10) return 'Very High'
  return 'Extreme'
}
