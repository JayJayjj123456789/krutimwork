import { getFirestore } from '../../config/firebase';
import { generateReportSummary } from '../ai/summary.service';
import { getForecast } from '../weather/forecast.service';
import { calculateRisks } from '../health/risk.service';

function httpError(message: string, status: number): Error & { status: number } {
  const err = new Error(message) as Error & { status: number };
  err.status = status;
  return err;
}

export async function getWeeklyReport(userId: string, weekStart?: string) {
  const db = getFirestore();
  const today = new Date();

  // Get user's city from their latest weather record or default to Bangkok
  const weatherSnap = await db.collection('weatherRecords')
    .orderBy('timestamp', 'desc')
    .limit(1)
    .get();

  let lat = 13.75398; // Bangkok default
  let lon = 100.50144;
  let timezone = 'Asia/Bangkok';

  if (!weatherSnap.empty) {
    const latestWeather = weatherSnap.docs[0].data();
    lat = latestWeather.latitude ?? lat;
    lon = latestWeather.longitude ?? lon;
    timezone = latestWeather.timezone ?? timezone;
  }

  // Get 7-day weather forecast
  console.log(`[report.service] fetching forecast for lat=${lat} lon=${lon}`);
  const forecast = await getForecast(lat, lon, timezone);
  const dailyForecasts = forecast.daily ?? [];

  // Generate predicted health scores for next 7 days
  const forecastData = dailyForecasts.slice(0, 7).map((day: any) => {
    // Calculate predicted risk based on forecast weather
    const risks = calculateRisks({
      temperature: day.temperature_max,
      humidity: 70, // Default humidity (not in daily forecast)
      aqi: 50, // Default AQI (not in forecast)
      uv: day.uv_index_max ?? 5,
      hasAsthma: false,
      hasAllergy: false,
      hasMigraine: false,
    });

    return {
      date: day.date,
      health_score: risks.healthScore,
      respiratory_risk: risks.respiratoryRisk,
      migraine_risk: risks.migraineRisk,
      fatigue_risk: risks.fatigueRisk,
      temperature_max: day.temperature_max,
      temperature_min: day.temperature_min,
      uv_index_max: day.uv_index_max,
      precipitation_sum: day.precipitation_sum,
      weather_code: day.weather_code,
    };
  });

  const avgHealth = forecastData.length > 0
    ? Math.round(forecastData.reduce((s: number, d: any) => s + d.health_score, 0) / forecastData.length)
    : 0;

  console.log(`[report.service] forecast generated for ${forecastData.length} days, avgHealth=${avgHealth}`);

  const aiSummary = await generateReportSummary(avgHealth, forecastData.length);

  const startDate = dailyForecasts[0]?.date ?? today.toISOString().split('T')[0];
  const endDate = dailyForecasts[6]?.date ?? today.toISOString().split('T')[0];

  return {
    week_start: startDate,
    week_end: endDate,
    avg_health_score: avgHealth,
    analyses_count: forecastData.length,
    ai_summary: aiSummary ?? '',
    data: forecastData,
  };
}
