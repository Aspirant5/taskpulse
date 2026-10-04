import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import Project from './models/Project.js';

export default (srv, origin) => {
  const io = new Server(srv, { cors: { origin } });

  io.use(async (s, next) => {
    try {
      const { id } = jwt.verify(s.handshake.auth?.token, process.env.JWT_SECRET);
      s.user = await User.findById(id);
      if (!s.user) throw new Error();
      next();
    } catch {
      next(new Error('Unauthorized'));
    }
  });

  io.on('connection', s => {
    s.on('project:join', async (pid, ack) => {
      try {
        const p = await Project.findById(pid);
        const ok = p && (s.user.role === 'admin' || p.members.some(m => m.equals(s.user._id)));
        if (ok) s.join('p:' + pid);
        ack?.({ ok: !!ok });
      } catch {
        ack?.({ ok: false });
      }
    });
    s.on('project:leave', pid => s.leave('p:' + pid));
  });

  return io;
};
