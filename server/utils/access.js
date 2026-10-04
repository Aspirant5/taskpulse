import Project from '../models/Project.js';
import err from './err.js';

export const getProject = async (req, id) => {
  const p = id && (await Project.findById(id));
  if (!p) throw err(404, 'Project not found');
  if (req.user.role !== 'admin' && !p.members.some(m => m.equals(req.user._id)))
    throw err(403, 'You are not a member of this project');
  return p;
};
