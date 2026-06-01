import { Request, Response, NextFunction } from 'express';
import { requireSupabase } from '../config/supabase';
import { getRecommendations } from '../services/ai/recommendation.service';

export async function getRecommendationsHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const analysisId = req.query.analysisId as string;
    if (!analysisId) {
      return res.status(400).json({ success: false, error: 'analysisId required' });
    }

    const supabase = requireSupabase();
    const { data: analysis } = await supabase
      .from('health_analysis')
      .select('*, weather_records(*)')
      .eq('id', analysisId)
      .single();

    if (!analysis) {
      return res.status(404).json({ success: false, error: 'Analysis not found' });
    }

    const rec = await getRecommendations({
      temperature: analysis.weather_records.temperature,
      aqi: analysis.weather_records.aqi,
      uv: analysis.weather_records.uv,
      healthScore: analysis.health_score,
    });

    const { data: saved } = await requireSupabase()
      .from('recommendations')
      .insert({
        analysis_id: analysisId,
        activity: rec.activity,
        clothing: rec.clothing,
        hydration: rec.hydration,
      })
      .select()
      .single();

    res.json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
}
