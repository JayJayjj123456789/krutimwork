// ============================================
// Aether AI — Shared API Contract
// Both frontend and backend import these types
// ============================================

// ---------- Weather ----------
export interface WeatherData {
  city: string;
  temperature: number;   // °C
  humidity: number;      // %
  aqi: number;
  uv: number;
  wind_speed: number;    // km/h
  pm25: number;          // µg/m³
  timestamp: string;
}

// ---------- Health Profile ----------
export interface HealthProfile {
  id: number;
  user_id: number;
  has_asthma: boolean;
  has_allergy: boolean;
  has_migraine: boolean;
  activity_level: 'low' | 'moderate' | 'high';
}

// ---------- Health Analysis ----------
export interface HealthAnalysisRequest {
  userId: number;
  city: string;
}

export interface HealthAnalysisResponse {
  id: number;
  health_score: number;       // 0-100
  respiratory_risk: 'low' | 'moderate' | 'high' | 'very_high';
  migraine_risk: 'low' | 'moderate' | 'high' | 'very_high';
  fatigue_risk: 'low' | 'moderate' | 'high' | 'very_high';
  ai_summary: string;         // Thai language
  recommendations: {
    activity: string;
    clothing: string;
    hydration: string;
  };
}

// ---------- Chat ----------
export interface ChatRequest {
  userId: number;
  question: string;
}

export interface ChatResponse {
  answer: string;
}

// ---------- Report ----------
export interface ReportData {
  id: number;
  week_start: string;
  week_end: string;
  avg_aqi: number;
  avg_health_score: number;
  ai_report: string;          // Thai language weekly summary
}

// ---------- Risk Level Helpers ----------
export const RISK_LABELS_TH = {
  low:       'ต่ำ',
  moderate:  'ปานกลาง',
  high:      'สูง',
  very_high: 'สูงมาก',
};

export const RISK_COLORS = {
  low:       '#22c55e',   // green
  moderate:  '#eab308',   // yellow
  high:      '#f97316',   // orange
  very_high: '#ef4444',   // red
};
