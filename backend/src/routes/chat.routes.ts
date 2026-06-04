import { Router } from 'express';
import { chatHandler, _debugBuildWeatherContext, _debugExtractCity, _debugWeatherKeywords } from '../controllers/chat.controller';
import { requireJwtAuth } from '../middleware/jwt-auth';

const router = Router();

router.post('/', requireJwtAuth, chatHandler);

router.get('/debug/weather/:city', requireJwtAuth, async (req, res) => {
  const t0 = Date.now();
  try {
    const city = decodeURIComponent(req.params.city);
    console.log(`[debug] /api/chat/debug/weather/${city} starting...`);
    const result = await _debugBuildWeatherContext(city);
    console.log(`[debug] buildWeatherContext done in ${Date.now() - t0}ms, fetched=${result.fetched}`);
    res.json({
      success: true,
      timing: Date.now() - t0,
      city,
      fetched: result.fetched,
      contextPreview: result.context.slice(0, 200),
    });
  } catch (e) {
    console.error(`[debug] buildWeatherContext FAILED in ${Date.now() - t0}ms:`, (e as Error).message);
    res.status(500).json({
      success: false,
      timing: Date.now() - t0,
      error: (e as Error).message,
      stack: (e as Error).stack?.split('\n').slice(0, 3),
    });
  }
});

router.get('/debug/extract', requireJwtAuth, (req, res) => {
  const q = String(req.query.q || '');
  res.json({
    matchesKeyword: _debugWeatherKeywords.test(q),
    extractedCity: _debugExtractCity(q),
  });
});

export default router;
