import { Router } from 'express';
import * as c from '../controllers/projectController.js';
import { protect, admin } from '../middleware/auth.js';

const r = Router();
r.use(protect);
r.route('/').get(c.list).post(admin, c.create);
r.route('/:id').get(c.get).delete(admin, c.remove);
r.post('/:id/members', admin, c.addMember);
r.delete('/:id/members/:uid', admin, c.removeMember);

export default r;
