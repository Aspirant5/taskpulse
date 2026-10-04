import { Router } from 'express';
import * as c from '../controllers/taskController.js';
import { protect, admin } from '../middleware/auth.js';

const r = Router();
r.use(protect);
r.route('/').get(c.list).post(c.create);
r.patch('/:id', c.update);
r.patch('/:id/move', c.move);
r.delete('/:id', admin, c.remove);

export default r;
