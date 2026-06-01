import { requireSupabase } from '../../config/supabase';
import { calculateRisks } from './risk.service';
import { computeHealthScore } from './score.service';
import { generateHealthSummary } from '../ai/summary.service';

export async function analyzeHealth(userId: string, city: string) {
  const supabase = requireSupabase();
  const { data: weather } = await supabase
    .from('weather_records')
    .select('*')
    .eq('city', city)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  if (!weather) throw new Error('No weather data for city');

  const { data: profile } = await requireSupabase()
    .from('health_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  const risks = calculateRisks({
    temperature: weather.temperature,
    humidity: weather.humidity,
    aqi: weather.aqi,
    uv: weather.uv,
    hasAsthma: profile?.has_asthma || false,
    hasAllergy: profile?.has_allergy || false,
    hasMigraine: profile?.has_migraine || false,
  });

  computeHealthScore(risks);

  const aiSummary = await generateHealthSummary({
    temperature: weather.temperature,
    humidity: weather.humidity,
    aqi: weather.aqi,
    uv: weather.uv,
    healthScore: risks.healthScore,
    respiratoryRisk: risks.respiratoryRisk,
    migraineRisk: risks.migraineRisk,
    fatigueRisk: risks.fatigueRisk,
  });

  const { data: analysis } = await requireSupabase()
    .from('health_analysis')
    .insert({
      user_id: userId,
      weather_record_id: weather.id,
      health_score: risks.healthScore,
      respiratory_risk: risks.respiratoryRisk,
      migraine_risk: risks.migraineRisk,
      fatigue_risk: risks.fatigueRisk,
      ai_summary: aiSummary,
    })
    .select()
    .single();

  return { ...analysis, ai_summary: aiSummary };
}
