import { Router } from 'express';
import { getMenuHandler, getMoodHandler } from '../controllers/insights.controller';
import { requireJwtAuth } from '../middleware/jwt-auth';

const router = Router();

router.get('/menu', requireJwtAuth, getMenuHandler);
router.get('/mood', requireJwtAuth, getMoodHandler);

export default router;
