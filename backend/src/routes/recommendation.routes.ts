import { Router } from 'express';
import { getRecommendationsHandler } from '../controllers/recommendation.controller';

const router = Router();

router.get('/', getRecommendationsHandler);

export default router;
