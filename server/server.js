import 'dotenv/config';
import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './config/db.js';
import initSocket from './socket.js';
import auth from './routes/authRoutes.js';
import projects from './routes/projectRoutes.js';
import tasks from './routes/taskRoutes.js';
import activity from './routes/activityRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error('MONGO_URI and JWT_SECRET are required');
  process.exit(1);
}

const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(s => s.trim());
const app = express();
const srv = http.createServer(app);

app.set('trust proxy', 1);
app.set('io', initSocket(srv, origins));
app.use(helmet());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '100kb' }));

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', auth);
app.use('/api/projects', projects);
app.use('/api/tasks', tasks);
app.use('/api/activity', activity);
app.use(notFound);
app.use(errorHandler);

await connectDB();
const port = process.env.PORT || 5000;
srv.listen(port, () => console.log(`TaskPulse API on :${port}`));
