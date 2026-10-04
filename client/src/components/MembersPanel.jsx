import { useState } from 'react';
import api, { msg } from '../api';

export default function MembersPanel({ project, onChange, onClose }) {
  const [email, setEmail] = useState('');
  const [err, setErr] = useState('');

  const add = async e => {
    e.preventDefault();
    try {
      const r = await api.post(`/projects/${project._id}/members`, { email });
      onChange(r.data); setEmail(''); setErr('');
    } catch (x) { setErr(msg(x)); }
  };
  const rm = async uid => {
    try { onChange((await api.delete(`/projects/${project._id}/members/${uid}`)).data); setErr(''); }
    catch (x) { setErr(msg(x)); }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/50 p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md space-y-3 rounded-xl bg-white p-5 shadow-xl">
        <h2 className="text-lg font-extrabold">Project members</h2>
        <form onSubmit={add} className="flex gap-2">
          <input className="inp" type="email" placeholder="Add by email" value={email} onChange={e => setEmail(e.target.value)} required />
          <button className="btn shrink-0">Add</button>
        </form>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <ul className="divide-y divide-slate-100">
          {project.members.map(m => (
            <li key={m._id} className="flex items-center justify-between py-2 text-sm">
              <span>{m.name} <span className="text-xs text-slate-500">{m.email}</span></span>
              {project.owner !== m._id && <button onClick={() => rm(m._id)} className="text-xs font-semibold text-red-600 hover:underline">Remove</button>}
            </li>
          ))}
        </ul>
        <div className="flex justify-end"><button className="btn-ghost" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}
