import Task from '../models/Task.js';
import ah from '../utils/ah.js';
import err from '../utils/err.js';
import emit from '../utils/emit.js';
import log from '../utils/log.js';
import { getProject } from '../utils/access.js';

const POP = [{ path: 'assignee', select: 'name' }, { path: 'createdBy', select: 'name' }];
const STATUS = ['todo', 'inprogress', 'done'];

const load = async req => {
  const t = await Task.findById(req.params.id);
  if (!t) throw err(404, 'Task not found');
  return [t, await getProject(req, t.project)];
};
const chk = (p, a) => {
  if (a && !p.members.some(m => m.equals(a))) throw err(400, 'Assignee must be a project member');
};

export const list = ah(async (req, res) => {
  await getProject(req, req.query.project);
  res.json(await Task.find({ project: req.query.project }).sort('order').populate(POP));
});

export const create = ah(async (req, res) => {
  const { project, title, description, status = 'todo', assignee } = req.body;
  const p = await getProject(req, project);
  if (!title?.trim()) throw err(400, 'Title is required');
  if (!STATUS.includes(status)) throw err(400, 'Invalid status');
  chk(p, assignee);
  const last = await Task.findOne({ project, status }).sort('-order');
  const t = await Task.create({
    project, title, description, status,
    assignee: assignee || null,
    createdBy: req.user._id,
    order: (last?.order ?? 0) + 1000,
  });
  await t.populate(POP);
  emit(req, project, 'task:created', t);
  await log(req, t, 'created', { to: status });
  res.status(201).json(t);
});

export const update = ah(async (req, res) => {
  const [t, p] = await load(req);
  const { title, description, assignee } = req.body;
  if (title !== undefined) {
    if (!String(title).trim()) throw err(400, 'Title is required');
    t.title = title;
  }
  if (description !== undefined) t.description = description;
  if (assignee !== undefined) { chk(p, assignee); t.assignee = assignee || null; }
  await t.save();
  await t.populate(POP);
  emit(req, t.project, 'task:updated', t);
  await log(req, t, 'updated');
  res.json(t);
});

export const move = ah(async (req, res) => {
  const [t] = await load(req);
  const { status, order } = req.body;
  if (!STATUS.includes(status) || !Number.isFinite(order)) throw err(400, 'Valid status and numeric order are required');
  const from = t.status;
  t.status = status;
  t.order = order;
  await t.save();
  await t.populate(POP);
  emit(req, t.project, 'task:moved', t);
  if (from !== status) await log(req, t, 'moved', { from, to: status });
  res.json(t);
});

export const remove = ah(async (req, res) => {
  const [t] = await load(req);
  await t.deleteOne();
  emit(req, t.project, 'task:deleted', { _id: t._id });
  await log(req, t, 'deleted');
  res.json({ _id: t._id });
});
