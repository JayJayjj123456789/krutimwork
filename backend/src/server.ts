import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import weatherRoutes from './routes/weather.routes';
import healthRoutes from './routes/health.routes';
import chatRoutes from './routes/chat.routes';
import recommendationRoutes from './routes/recommendation.routes';
import reportRoutes from './routes/report.routes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ status: 'ok', message: 'Aether AI Backend Running' });
});

app.use('/api/weather', weatherRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/reports', reportRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Aether AI Backend running on http://localhost:${PORT}`);
});
