import { useState } from 'react';
import { msg } from '../api';
import { LBL } from '../constants';

export default function TaskModal({ task, status, members, onSave, onClose }) {
  const [f, setF] = useState({
    title: task?.title || '',
    description: task?.description || '',
    assignee: task?.assignee?._id || '',
  });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setBusy(true);
    try { await onSave({ ...f, status }); onClose(); }
    catch (x) { setErr(msg(x)); setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-20 flex items-center justify-center bg-ink/50 p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
      <form onSubmit={submit} className="w-full max-w-md space-y-3 rounded-xl bg-white p-5 shadow-xl">
        <h2 className="text-lg font-extrabold">{task ? 'Edit task' : `New task in ${LBL[status]}`}</h2>
        <input className="inp" placeholder="Title" value={f.title} onChange={set('title')} maxLength={120} required autoFocus />
        <textarea className="inp" rows={3} placeholder="Description (optional)" value={f.description} onChange={set('description')} maxLength={1000} />
        <select className="inp" value={f.assignee} onChange={set('assignee')}>
          <option value="">Unassigned</option>
          {members.map(m => <option key={m._id} value={m._id}>{m.name}</option>)}
        </select>
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <div className="flex justify-end gap-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={busy}>{task ? 'Save changes' : 'Create task'}</button>
        </div>
      </form>
    </div>
  );
}
