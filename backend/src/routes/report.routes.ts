import { Router } from 'express';
import { getReport } from '../controllers/report.controller';
import { requireJwtAuth } from '../middleware/jwt-auth';

const router = Router();

router.get('/', requireJwtAuth, getReport);

export default router;
