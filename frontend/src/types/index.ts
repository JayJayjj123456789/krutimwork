export type RiskLevel = 'low' | 'moderate' | 'high' | 'very_high'

export interface WeatherData {
  city: string
  temperature: number
  humidity: number
  aqi: number
  uv: number
  wind_speed: number
  pm25: number
  timestamp: string
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
  category: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  icon: string
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
