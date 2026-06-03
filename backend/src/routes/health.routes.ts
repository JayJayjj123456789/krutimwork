import { Router } from 'express';
import { analyzeHealthHandler } from '../controllers/health.controller';
import { requireJwtAuth } from '../middleware/jwt-auth';

const router = Router();

router.post('/analyze', requireJwtAuth, analyzeHealthHandler);

export default router;
