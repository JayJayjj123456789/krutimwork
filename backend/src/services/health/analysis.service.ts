import { getFirestore } from '../../config/firebase';
import { calculateRisks } from './risk.service';
import { generateHealthSummary } from '../ai/summary.service';
import { getWeatherByCity } from '../weather/weather.service';

function httpError(message: string, status: number): Error & { status: number } {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}

export async function analyzeHealth(userId: string, city: string) {
  const db = getFirestore();
  console.log(`[analysis.service] analyzeHealth userId=${userId} city="${city}"`);

  const weather = await getWeatherByCity(city);
  const weatherRecordId = weather.id ?? null;
  console.log(`[analysis.service] live weather temp=${weather.temperature} aqi=${weather.aqi} humidity=${weather.humidity} weatherRecordId=${weatherRecordId}`);

  const profileSnap = await db.collection('healthProfiles').where('user_id', '==', userId).get();
  const profile = profileSnap.empty ? null : profileSnap.docs[0].data() as Record<string, unknown>;

  console.log(`[analysis.service] healthProfile: ${profile ? 'found' : 'not found (using defaults)'}`);

  const risks = calculateRisks({
    temperature: weather.temperature,
    humidity: weather.humidity,
    aqi: weather.aqi ?? 0,
    uv: weather.uv ?? 0,
    hasAsthma: (profile?.has_asthma as boolean) ?? false,
    hasAllergy: (profile?.has_allergy as boolean) ?? false,
    hasMigraine: (profile?.has_migraine as boolean) ?? false,
  });

  console.log(`[analysis.service] risks: score=${risks.healthScore} respiratory=${risks.respiratoryRisk} migraine=${risks.migraineRisk} fatigue=${risks.fatigueRisk}`);

  const aiSummary = await generateHealthSummary({
    temperature: weather.temperature,
    humidity: weather.humidity,
    aqi: weather.aqi ?? 0,
    uv: weather.uv ?? 0,
    healthScore: risks.healthScore,
    respiratoryRisk: risks.respiratoryRisk,
    migraineRisk: risks.migraineRisk,
    fatigueRisk: risks.fatigueRisk,
  });

  console.log(`[analysis.service] AI summary: ${aiSummary ? `length=${aiSummary.length}` : 'UNAVAILABLE'}`);

  const docRef = await db.collection('healthAnalysis').add({
    user_id: userId,
    weather_record_id: weatherRecordId,
    health_score: risks.healthScore,
    respiratory_risk: risks.respiratoryRisk,
    migraine_risk: risks.migraineRisk,
    fatigue_risk: risks.fatigueRisk,
    ai_summary: aiSummary,
    created_at: new Date().toISOString(),
  });

  const saved = await docRef.get();
  if (!saved.exists) {
    console.error('[analysis.service] Failed to save health analysis');
    throw httpError('Failed to save health analysis', 500);
  }

  console.log(`[analysis.service] health_analysis saved id=${docRef.id}`);
  return { id: docRef.id, ...(saved.data() as Record<string, unknown>), ai_summary: aiSummary } as Record<string, unknown>;
}
