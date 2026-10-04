import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import ah from '../utils/ah.js';
import err from '../utils/err.js';
import { getProject } from '../utils/access.js';

const M = 'name email role';

export const list = ah(async (req, res) => {
  const f = req.user.role === 'admin' ? {} : { members: req.user._id };
  res.json(await Project.find(f).sort('-createdAt').populate('members', M));
});

export const create = ah(async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) throw err(400, 'Project name is required');
  const p = await Project.create({ name, description, owner: req.user._id, members: [req.user._id] });
  res.status(201).json(await p.populate('members', M));
});

export const get = ah(async (req, res) => {
  await getProject(req, req.params.id);
  res.json(await Project.findById(req.params.id).populate('members', M));
});

export const addMember = ah(async (req, res) => {
  const u = await User.findOne({ email: String(req.body.email || '').toLowerCase().trim() });
  if (!u) throw err(404, 'No user registered with that email');
  const p = await Project.findByIdAndUpdate(req.params.id, { $addToSet: { members: u._id } }, { new: true });
  if (!p) throw err(404, 'Project not found');
  res.json(await p.populate('members', M));
});

export const removeMember = ah(async (req, res) => {
  const p = await Project.findById(req.params.id);
  if (!p) throw err(404, 'Project not found');
  if (p.owner.equals(req.params.uid)) throw err(400, 'The project owner cannot be removed');
  p.members.pull(req.params.uid);
  await p.save();
  res.json(await p.populate('members', M));
});

export const remove = ah(async (req, res) => {
  const p = await Project.findByIdAndDelete(req.params.id);
  if (!p) throw err(404, 'Project not found');
  await Promise.all([Task.deleteMany({ project: p._id }), Activity.deleteMany({ project: p._id })]);
  res.json({ _id: p._id });
});
