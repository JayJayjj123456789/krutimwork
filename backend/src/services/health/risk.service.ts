interface RiskInput {
  temperature: number;
  humidity: number;
  aqi: number;
  uv: number;
  hasAsthma: boolean;
  hasAllergy: boolean;
  hasMigraine: boolean;
}

interface RiskOutput {
  healthScore: number;
  respiratoryRisk: string;
  migraineRisk: string;
  fatigueRisk: string;
}

function level(score: number): string {
  if (score <= 25) return 'low';
  if (score <= 50) return 'moderate';
  if (score <= 75) return 'high';
  return 'very_high';
}

export function calculateRisks(input: RiskInput): RiskOutput {
  let respiratory = 0;
  let migraine = 0;
  let fatigue = 0;

  // AQI impact
  if (input.aqi > 150) respiratory += 40;
  else if (input.aqi > 100) respiratory += 25;
  else if (input.aqi > 50) respiratory += 10;

  // Temperature impact
  if (input.temperature > 38) { fatigue += 30; migraine += 20; }
  else if (input.temperature > 35) { fatigue += 20; migraine += 15; }
  else if (input.temperature > 32) { fatigue += 10; migraine += 5; }

  // UV impact
  if (input.uv > 10) { fatigue += 20; migraine += 15; }
  else if (input.uv > 7) { fatigue += 10; migraine += 10; }
  else if (input.uv > 5) { fatigue += 5; migraine += 5; }

  // Humidity impact
  if (input.humidity > 85) { respiratory += 15; migraine += 10; fatigue += 10; }
  else if (input.humidity > 70) { respiratory += 5; fatigue += 5; }

  // Pre-existing conditions
  if (input.hasAsthma) respiratory += 20;
  if (input.hasAllergy) respiratory += 15;
  if (input.hasMigraine) migraine += 20;

  // Cap at 100
  respiratory = Math.min(respiratory, 100);
  migraine = Math.min(migraine, 100);
  fatigue = Math.min(fatigue, 100);

  // Health score is inverse of average risk
  const avgRisk = (respiratory + migraine + fatigue) / 3;
  const healthScore = Math.max(0, Math.round(100 - avgRisk));

  return {
    healthScore,
    respiratoryRisk: level(respiratory),
    migraineRisk: level(migraine),
    fatigueRisk: level(fatigue),
  };
}
