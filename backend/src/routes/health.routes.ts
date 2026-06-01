import { Router } from 'express';
import { analyzeHealthHandler } from '../controllers/health.controller';

const router = Router();

router.post('/analyze', analyzeHealthHandler);

export default router;
