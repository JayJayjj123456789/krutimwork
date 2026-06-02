import { Router } from 'express';
import { analyzeHealthHandler } from '../controllers/health.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.post('/analyze', requireAuth, analyzeHealthHandler);

export default router;
