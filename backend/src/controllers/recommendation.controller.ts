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
    const { data: analysis, error: analysisErr } = await supabase
      .from('health_analysis')
      .select('*, weather_records(*)')
      .eq('id', analysisId)
      .single();

    if (analysisErr || !analysis) {
      return res.status(404).json({ success: false, error: 'Analysis not found' });
    }

    const weather = (analysis as any).weather_records;
    if (!weather) {
      return res
        .status(404)
        .json({ success: false, error: 'Weather record not found for this analysis' });
    }

    const rec = await getRecommendations({
      temperature: weather.temperature,
      aqi: weather.aqi,
      uv: weather.uv,
      healthScore: (analysis as any).health_score,
    });

    const { data: saved, error: saveErr } = await supabase
      .from('recommendations')
      .insert({
        analysis_id: analysisId,
        activity: rec.activity,
        clothing: rec.clothing,
        hydration: rec.hydration,
      })
      .select()
      .single();

    if (saveErr) {
      console.error('Save recommendations error:', saveErr);
      return res
        .status(500)
        .json({ success: false, error: 'Failed to save recommendations' });
    }
    res.json({ success: true, data: saved });
  } catch (err) {
    next(err);
  }
}
