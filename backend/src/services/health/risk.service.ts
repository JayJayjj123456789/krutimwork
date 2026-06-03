import { RISK_THRESHOLDS } from '../../config/risk-thresholds';

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

  console.log(`[risk.service] calculating risks: temp=${input.temperature} humidity=${input.humidity} aqi=${input.aqi} uv=${input.uv} asthma=${input.hasAsthma} allergy=${input.hasAllergy} migraine=${input.hasMigraine}`);

  const A = RISK_THRESHOLDS;

  if (input.aqi > A.aqi.high) respiratory += 40;
  else if (input.aqi > A.aqi.moderate) respiratory += 25;
  else if (input.aqi > A.aqi.low) respiratory += 10;

  if (input.temperature > A.temperature.extreme) { fatigue += 30; migraine += 20; }
  else if (input.temperature > A.temperature.high) { fatigue += 20; migraine += 15; }
  else if (input.temperature > A.temperature.warm) { fatigue += 10; migraine += 5; }

  if (input.uv > A.uv.extreme) { fatigue += 20; migraine += 15; }
  else if (input.uv > A.uv.high) { fatigue += 10; migraine += 10; }
  else if (input.uv > A.uv.moderate) { fatigue += 5; migraine += 5; }

  if (input.humidity > A.humidity.veryHigh) { respiratory += 15; migraine += 10; fatigue += 10; }
  else if (input.humidity > A.humidity.high) { respiratory += 5; fatigue += 5; }

  if (input.hasAsthma) respiratory += 20;
  if (input.hasAllergy) respiratory += 15;
  if (input.hasMigraine) migraine += 20;

  respiratory = Math.min(respiratory, 100);
  migraine = Math.min(migraine, 100);
  fatigue = Math.min(fatigue, 100);

  const avgRisk = (respiratory + migraine + fatigue) / 3;
  const healthScore = Math.max(0, Math.round(100 - avgRisk));

  console.log(`[risk.service] result: respiratory=${respiratory}(${level(respiratory)}) migraine=${migraine}(${level(migraine)}) fatigue=${fatigue}(${level(fatigue)}) healthScore=${healthScore}`);

  return {
    healthScore,
    respiratoryRisk: level(respiratory),
    migraineRisk: level(migraine),
    fatigueRisk: level(fatigue),
  };
}
