import { Request, Response, NextFunction } from 'express';
import { getFirestore } from '../config/firebase';
import { getRecommendations } from '../services/ai/recommendation.service';
import type { DocumentSnapshot } from 'firebase-admin/firestore';

function getDocData<T>(snap: DocumentSnapshot): T | null {
  if (!snap.exists) return null;
  return { id: snap.id, ...snap.data() } as T;
}

export async function getRecommendationsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const analysisId = req.query.analysisId as string;
    if (!analysisId) {
      console.warn('[recommendation.controller] missing analysisId');
      return res.status(400).json({ success: false, error: 'analysisId required' });
    }
    console.log(`[recommendation.controller] getRecommendations analysisId=${analysisId}`);

    const db = getFirestore();
    const analysisSnap = await db.collection('healthAnalysis').doc(analysisId).get();
    if (!analysisSnap.exists) {
      console.warn(`[recommendation.controller] analysis ${analysisId} not found`);
      return res.status(404).json({ success: false, error: 'Analysis not found' });
    }
    const analysisData = analysisSnap.data()!;
    console.log(`[recommendation.controller] found analysis id=${analysisId}`);

    const weatherRecordId = analysisData.weather_record_id as string | undefined;
    if (!weatherRecordId) {
      console.warn(`[recommendation.controller] no weather_record_id for analysis ${analysisId}`);
      return res.status(404).json({ success: false, error: 'Weather record not found for this analysis' });
    }

    const weatherSnap = await db.collection('weatherRecords').doc(weatherRecordId).get();
    if (!weatherSnap.exists) {
      console.warn(`[recommendation.controller] weather record ${weatherRecordId} not found`);
      return res.status(404).json({ success: false, error: 'Weather record not found' });
    }
    const weather = weatherSnap.data()!;
    console.log(`[recommendation.controller] weather temp=${weather.temperature} aqi=${weather.aqi}`);

    if (typeof weather.temperature !== 'number' || typeof weather.aqi !== 'number') {
      console.warn(`[recommendation.controller] invalid weather data: temp=${typeof weather.temperature} aqi=${typeof weather.aqi}`);
      return res.status(422).json({ success: false, error: 'Weather record contains invalid data' });
    }

    const rec = await getRecommendations({
      temperature: weather.temperature,
      aqi: weather.aqi,
      uv: weather.uv ?? 0,
      healthScore: (analysisData.health_score as number) ?? 50,
      humidity: weather.humidity ?? 60,
      weatherCode: weather.weather_code ?? 0,
      isDay: weather.is_day ?? 1,
    });

    const menuStr = rec.menu && rec.menu.length > 0 ? JSON.stringify(rec.menu) : null;
    const moodStr = rec.mood || null;

    console.log(`[recommendation.controller] got AI recs: activity="${rec.activity.slice(0, 60)}..."`);

    const recDocRef = await db.collection('recommendations').add({
      analysis_id: analysisId,
      activity: rec.activity,
      clothing: rec.clothing,
      hydration: rec.hydration,
      menu: menuStr,
      mood: moodStr,
      created_at: new Date().toISOString(),
    });

    const savedSnap = await recDocRef.get();
    if (!savedSnap.exists) {
      console.error('[recommendation.controller] Failed to save recommendations');
      return res.status(500).json({ success: false, error: 'Failed to save recommendations' });
    }
    const saved = getDocData<Record<string, unknown>>(savedSnap);
    console.log(`[recommendation.controller] recommendations saved id=${savedSnap.id}`);
    res.json({ success: true, data: saved });
  } catch (err) {
    console.error(`[recommendation.controller] error:`, (err as Error).message);
    next(err);
  }
}
