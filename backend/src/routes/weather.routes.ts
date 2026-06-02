import { Router } from 'express';
import { getWeather } from '../controllers/weather.controller';
import { getGeocode } from '../controllers/geocode.controller';

const router = Router();

router.get('/', getWeather);
router.get('/geocode', getGeocode);

export default router;
