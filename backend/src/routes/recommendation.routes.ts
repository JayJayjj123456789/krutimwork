import { Router } from 'express';
import { getRecommendationsHandler } from '../controllers/recommendation.controller';
import { requireJwtAuth } from '../middleware/jwt-auth';

const router = Router();

router.get('/', requireJwtAuth, getRecommendationsHandler);

export default router;
