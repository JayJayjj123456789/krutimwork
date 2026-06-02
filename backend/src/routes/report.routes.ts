import { Router } from 'express';
import { getReport } from '../controllers/report.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, getReport);

export default router;
