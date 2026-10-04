import Activity from '../models/Activity.js';
import ah from '../utils/ah.js';
import { getProject } from '../utils/access.js';

export const list = ah(async (req, res) => {
  await getProject(req, req.query.project);
  res.json(await Activity.find({ project: req.query.project }).sort('-createdAt').limit(50).populate('user', 'name'));
});
