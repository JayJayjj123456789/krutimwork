import { getFirestore } from '../../config/firebase';
import { generateReportSummary } from '../ai/summary.service';

function httpError(message: string, status: number): Error & { status: number } {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}

export async function getWeeklyReport(userId: string, weekStart?: string) {
  const db = getFirestore();
  const start = weekStart ? new Date(weekStart) : new Date(Date.now() - 7 * 86400000);
  if (isNaN(start.getTime())) {
    console.error(`[report.service] invalid weekStart date: "${weekStart}"`);
    throw httpError('Invalid weekStart date', 400);
  }
  const end = new Date(start.getTime() + 7 * 86400000);
  console.log(`[report.service] getWeeklyReport userId=${userId} range=${start.toISOString().split('T')[0]} → ${end.toISOString().split('T')[0]}`);

  const snapshot = await db.collection('healthAnalysis')
    .where('user_id', '==', userId)
    .where('created_at', '>=', start.toISOString())
    .where('created_at', '<=', end.toISOString())
    .get();

  const analyses = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

  if (analyses.length === 0) {
    console.warn(`[report.service] no analyses found for userId=${userId} in range`);
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
    analyses.reduce((s: number, a: any) => s + (a.health_score ?? 0), 0) / analyses.length;
  console.log(`[report.service] ${analyses.length} analyses found, avgHealth=${avgHealth}`);

  const aiSummary = await generateReportSummary(
    Math.round(avgHealth),
    analyses.length
  );

  return {
    week_start: start.toISOString().split('T')[0],
    week_end: end.toISOString().split('T')[0],
    avg_health_score: Math.round(avgHealth),
    analyses_count: analyses.length,
    ai_summary: aiSummary ?? '',
    data: analyses,
  };
}
