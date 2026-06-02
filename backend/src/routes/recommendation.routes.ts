import { Router } from 'express';
import { getRecommendationsHandler } from '../controllers/recommendation.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getRecommendationsHandler);

export default router;
