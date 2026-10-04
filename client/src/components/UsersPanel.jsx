import { useEffect, useState } from 'react';
import api, { msg } from '../api';
import { useAuth } from '../context/AuthContext';

export default function UsersPanel() {
  const { user } = useAuth();
  const [us, setUs] = useState([]);
  const [err, setErr] = useState('');

  useEffect(() => { api.get('/auth/users').then(r => setUs(r.data)).catch(e => setErr(msg(e))); }, []);

  const set = async (id, role) => {
    try {
      const r = await api.patch(`/auth/users/${id}/role`, { role });
      setUs(l => l.map(u => (u._id === id ? r.data : u)));
      setErr('');
    } catch (e) { setErr(msg(e)); }
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4">
      <h2 className="mb-3 font-bold">Team roles</h2>
      {err && <p role="alert" className="mb-2 text-sm text-red-600">{err}</p>}
      <ul className="divide-y divide-slate-100">
        {us.map(u => (
          <li key={u._id} className="flex items-center justify-between gap-2 py-2 text-sm">
            <span className="min-w-0">
              <span className="block truncate font-medium">{u.name}</span>
              <span className="block truncate text-xs text-slate-500">{u.email}</span>
            </span>
            <button
              className="btn-ghost shrink-0"
              disabled={u._id === user._id}
              onClick={() => set(u._id, u.role === 'admin' ? 'member' : 'admin')}
            >
              {u.role === 'admin' ? 'Admin · make member' : 'Member · make admin'}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
