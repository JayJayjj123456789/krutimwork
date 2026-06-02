import { requireSupabase } from '../../config/supabase';
import { calculateRisks } from './risk.service';
import { generateHealthSummary } from '../ai/summary.service';

function httpError(message: string, status: number): Error & { status: number } {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}

export async function analyzeHealth(userId: string, city: string) {
  const supabase = requireSupabase();
  const { data: weather, error: weatherErr } = await supabase
    .from('weather_records')
    .select('*')
    .eq('city', city)
    .order('timestamp', { ascending: false })
    .limit(1)
    .single();

  if (weatherErr || !weather) {
    throw httpError('No weather data for city', 404);
  }

  const { data: profile, error: profileErr } = await supabase
    .from('health_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (profileErr) {
    throw httpError('Failed to fetch health profile', 500);
  }

  const risks = calculateRisks({
    temperature: weather.temperature,
    humidity: weather.humidity,
    aqi: weather.aqi,
    uv: weather.uv,
    hasAsthma: profile?.has_asthma ?? false,
    hasAllergy: profile?.has_allergy ?? false,
    hasMigraine: profile?.has_migraine ?? false,
  });

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

  const { data: analysis, error: insertErr } = await supabase
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

  if (insertErr || !analysis) {
    console.error('Insert health_analysis error:', insertErr);
    throw httpError('Failed to save health analysis', 500);
  }

  return { ...analysis, ai_summary: aiSummary };
}
