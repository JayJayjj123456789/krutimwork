import { requireSupabase } from '../../config/supabase';
import { generateReportSummary } from '../ai/summary.service';

export async function getWeeklyReport(userId: string, weekStart?: string) {
  const supabase = requireSupabase();
  const start = weekStart ? new Date(weekStart) : new Date(Date.now() - 7 * 86400000);
  const end = new Date(start.getTime() + 7 * 86400000);

  const { data: analyses } = await supabase
    .from('health_analysis')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', start.toISOString())
    .lte('created_at', end.toISOString());

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
    analyses.reduce((s: number, a: any) => s + a.health_score, 0) / analyses.length;
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
