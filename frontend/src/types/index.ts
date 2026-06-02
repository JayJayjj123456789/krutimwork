export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high'

export interface DailyForecast {
  date: string
  weather_code: number
  temperature_max: number
  temperature_min: number
  precipitation_sum: number
  uv_index_max: number
}

export interface WeatherData {
  city: string
  country: string | null
  latitude: number
  longitude: number
  temperature: number
  feels_like: number
  humidity: number
  wind_speed: number
  precipitation: number
  weather_code: number
  aqi: number | null
  pm25: number
  pm10: number
  uv: number
  timestamp: string
  daily: DailyForecast[]
  dataAvailability?: {
    aqi: boolean
    uv: boolean
  }
}

export interface HealthProfile {
  id: number
  user_id: number
  has_asthma: boolean
  has_allergy: boolean
  has_migraine: boolean
  activity_level: 'low' | 'moderate' | 'high'
}

export interface HealthAnalysis {
  id: number
  health_score: number
  respiratory_risk: RiskLevel
  migraine_risk: RiskLevel
  fatigue_risk: RiskLevel
  ai_summary: string
  recommendations: {
    activity: string
    clothing: string
    hydration: string
  }
}

export interface Recommendation {
  id: number
  analysis_id: number
  activity: string
  clothing: string
  hydration: string
  menu: string | null
  mood: string | null
  created_at: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: Date
}

export interface ReportData {
  id: number
  week_start: string
  week_end: string
  avg_aqi: number
  avg_health_score: number
  ai_report: string
}

export const RISK_LABELS_TH: Record<RiskLevel, string> = {
  low: 'ต่ำ',
  moderate: 'ปานกลาง',
  high: 'สูง',
  very_high: 'สูงมาก',
}

export const RISK_COLORS: Record<RiskLevel, string> = {
  low: '#22c55e',
  moderate: '#eab308',
  high: '#f97316',
  very_high: '#ef4444',
}
