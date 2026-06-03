export const RISK_THRESHOLDS = {
  aqi: {
    high: 150,
    moderate: 100,
    low: 50,
  },
  temperature: {
    extreme: 38,
    high: 35,
    warm: 32,
  },
  uv: {
    extreme: 10,
    high: 7,
    moderate: 5,
  },
  humidity: {
    veryHigh: 85,
    high: 70,
  },
} as const;
