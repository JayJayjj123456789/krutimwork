import { requireSupabase } from '../../config/supabase';
import { generateReportSummary } from '../ai/summary.service';

function httpError(message: string, status: number): Error & { status: number } {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}

export async function getWeeklyReport(userId: string, weekStart?: string) {
  const supabase = requireSupabase();
  const start = weekStart ? new Date(weekStart) : new Date(Date.now() - 7 * 86400000);
  if (isNaN(start.getTime())) {
    throw httpError('Invalid weekStart date', 400);
  }
  const end = new Date(start.getTime() + 7 * 86400000);

  const { data: analyses, error: analysesErr } = await supabase
    .from('health_analysis')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

  if (analysesErr) {
    console.error('Fetch analyses error:', analysesErr);
    throw httpError('Failed to fetch analyses', 500);
  }

  if (!analyses || analyses.length === 0) {
    return {
      week_start: start.toISOString().split('T')[0],
      week_end: end.toISOString().split('T')[0],
      avg_health_score: 0,
      analyses_count: 0,
      ai_summary: '',
      data: [],
      message: 'No data for this week',
    };
  }

  const avgHealth =
    analyses.reduce((s, a) => s + (a.health_score ?? 0), 0) / analyses.length;
  const aiSummary = await generateReportSummary(
    Math.round(avgHealth),
    analyses.length
  );

  return {
    week_start: start.toISOString().split('T')[0],
    week_end: end.toISOString().split('T')[0],
    avg_health_score: Math.round(avgHealth),
    analyses_count: analyses.length,
    ai_summary: aiSummary,
    data: analyses,
  };
}
