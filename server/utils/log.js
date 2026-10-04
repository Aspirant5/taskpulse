import Activity from '../models/Activity.js';
import emit from './emit.js';

export default async (req, t, action, extra = {}) => {
  const a = await Activity.create({ project: t.project, user: req.user._id, task: t._id, action, title: t.title, ...extra });
  await a.populate('user', 'name');
  emit(req, t.project, 'activity:new', a);
};
