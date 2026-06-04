import { Router } from 'express';
import { chatHandler } from '../controllers/chat.controller';
import { requireJwtAuth } from '../middleware/jwt-auth';

const router = Router();

router.post('/', requireJwtAuth, chatHandler);

export default router;
