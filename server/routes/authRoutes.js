import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as c from '../controllers/authController.js';
import { protect, admin } from '../middleware/auth.js';

const r = Router();
const lim = rateLimit({ windowMs: 15 * 60 * 1000, limit: 50, standardHeaders: true, legacyHeaders: false });

r.post('/register', lim, c.register);
r.post('/login', lim, c.login);
r.get('/me', protect, c.me);
r.get('/users', protect, admin, c.users);
r.patch('/users/:id/role', protect, admin, c.setRole);

export default r;
