import { Router } from 'express';
import { list } from '../controllers/activityController.js';
import { protect } from '../middleware/auth.js';

const r = Router();
r.get('/', protect, list);

export default r;
