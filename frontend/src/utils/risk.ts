import { RiskLevel, RISK_LABELS_TH, RISK_COLORS } from '../types'

export function riskLabel(level: RiskLevel): string {
  return RISK_LABELS_TH[level]
}

export function riskColor(level: RiskLevel): string {
  return RISK_COLORS[level]
}

// Inverts health score (0-100, higher=better) → risk level (low=best)
export function riskSeverity(score: number): RiskLevel {
  if (score >= 80) return 'low'
  if (score >= 60) return 'moderate'
  if (score >= 40) return 'high'
  return 'very_high'
}
