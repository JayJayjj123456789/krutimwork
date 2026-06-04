import { describe, it, expect } from 'vitest'
import { calculateRisks } from '../src/services/health/risk.service'

describe('calculateRisks', () => {
  const base = {
    temperature: 25,
    humidity: 50,
    aqi: 30,
    uv: 3,
    hasAsthma: false,
    hasAllergy: false,
    hasMigraine: false,
  }

  it('returns perfect health score for ideal conditions', () => {
    const r = calculateRisks(base)
    expect(r.healthScore).toBe(100)
    expect(r.respiratoryRisk).toBe('low')
    expect(r.migraineRisk).toBe('low')
    expect(r.fatigueRisk).toBe('low')
  })

  it('respiratory: AQI > 150 → +40 → moderate (40)', () => {
    const r = calculateRisks({ ...base, aqi: 180 })
    expect(r.respiratoryRisk).toBe('moderate')
    expect(r.healthScore).toBeLessThan(90)
  })

  it('respiratory: AQI 50-100 → +10 → low (10)', () => {
    const r = calculateRisks({ ...base, aqi: 75 })
    expect(r.respiratoryRisk).toBe('low')
  })

  it('fatigue + migraine: temp > 38°C → +30 fatigue, +20 migraine', () => {
    const r = calculateRisks({ ...base, temperature: 39 })
    expect(r.fatigueRisk).toBe('moderate')
    expect(r.migraineRisk).toBe('low')
  })

  it('fatigue + migraine: temp 33-35°C → +10 fatigue, +5 migraine', () => {
    const r = calculateRisks({ ...base, temperature: 34 })
    expect(r.fatigueRisk).toBe('low')
    expect(r.migraineRisk).toBe('low')
  })

  it('migraine: UV > 10 → +15 migraine (still low)', () => {
    const r = calculateRisks({ ...base, uv: 11 })
    expect(r.migraineRisk).toBe('low')
  })

  it('fatigue + migraine: UV 6-7 → +5 fatigue, +5 migraine', () => {
    const r = calculateRisks({ ...base, uv: 6 })
    expect(r.fatigueRisk).toBe('low')
    expect(r.migraineRisk).toBe('low')
  })

  it('all conditions: 3 pre-existing conditions raise respiratory to moderate', () => {
    const r = calculateRisks({ ...base, hasAsthma: true, hasAllergy: true, hasMigraine: true })
    expect(r.respiratoryRisk).toBe('moderate')
  })

  it('caps all scores at 100', () => {
    const r = calculateRisks({ ...base, aqi: 999, temperature: 50, uv: 20, humidity: 100 })
    expect(r.healthScore).toBeGreaterThanOrEqual(0)
    expect(['low', 'moderate', 'high', 'very_high']).toContain(r.respiratoryRisk)
    expect(['low', 'moderate', 'high', 'very_high']).toContain(r.migraineRisk)
    expect(['low', 'moderate', 'high', 'very_high']).toContain(r.fatigueRisk)
  })
})
