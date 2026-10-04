import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ah from '../utils/ah.js';
import err from '../utils/err.js';

const sign = id => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const out = u => ({ _id: u._id, name: u.name, email: u.email, role: u.role });

// First registered user becomes admin; everyone after is a member.
export const register = ah(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) throw err(400, 'Name, email and password are required');
  if (String(password).length < 6) throw err(400, 'Password must be at least 6 characters');
  if (await User.exists({ email: String(email).toLowerCase() })) throw err(409, 'Email already registered');
  const role = (await User.countDocuments()) ? 'member' : 'admin';
  const u = await User.create({ name, email, password, role });
  res.status(201).json({ user: out(u), token: sign(u._id) });
});

export const login = ah(async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email: String(email || '').toLowerCase() }).select('+password');
  if (!u || !(await u.match(String(password || '')))) throw err(401, 'Invalid email or password');
  res.json({ user: out(u), token: sign(u._id) });
});

export const me = (req, res) => res.json(out(req.user));

export const users = ah(async (req, res) => res.json(await User.find().select('name email role').sort('createdAt')));

export const setRole = ah(async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'member'].includes(role)) throw err(400, 'Invalid role');
  if (req.params.id === String(req.user._id)) throw err(400, 'You cannot change your own role');
  const u = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('name email role');
  if (!u) throw err(404, 'User not found');
  res.json(u);
});
