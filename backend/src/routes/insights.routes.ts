import { Router } from 'express';
import { getMenuHandler, getMoodHandler } from '../controllers/insights.controller';

const router = Router();

router.get('/menu', getMenuHandler);
router.get('/mood', getMoodHandler);

export default router;
