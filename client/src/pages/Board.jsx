import { useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useBoard from '../hooks/useBoard';
import { COLS } from '../constants';
import Navbar from '../components/Navbar';
import Column from '../components/Column';
import ActivityLog from '../components/ActivityLog';
import TaskModal from '../components/TaskModal';
import MembersPanel from '../components/MembersPanel';

export default function Board() {
  const { id } = useParams();
  const { user } = useAuth();
  const adm = user.role === 'admin';
  const b = useBoard(id);
  const [modal, setModal] = useState(null); // { task?, status }
  const [mem, setMem] = useState(false);
  const drag = useRef(null);

  const drop = (status, before) => {
    const did = drag.current;
    drag.current = null;
    if (!did || before === did) return;
    const col = b.tasks.filter(t => t.status === status && t._id !== did).sort((x, y) => x.order - y.order);
    const i = before ? Math.max(col.findIndex(t => t._id === before), 0) : col.length;
    const lo = col[i - 1]?.order;
    const hi = col[i]?.order;
    const order = lo == null && hi == null ? 1000 : lo == null ? hi - 1000 : hi == null ? lo + 1000 : (lo + hi) / 2;
    b.move(did, status, order);
  };

  if (!b.project) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-7xl p-8 text-sm">
          {b.err ? <p role="alert" className="text-red-600">{b.err}</p> : <p className="text-slate-500">Loading board…</p>}
          <Link to="/" className="mt-3 inline-block font-semibold underline">Back to projects</Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <Link to="/" className="text-xs font-semibold text-slate-500 hover:underline">Projects</Link>
            <h1 className="text-2xl font-extrabold tracking-tight">{b.project.name}</h1>
            {b.project.description && <p className="text-sm text-slate-500">{b.project.description}</p>}
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className={`h-2 w-2 rounded-full ${b.live ? 'animate-pulse bg-pulse' : 'bg-slate-300'}`} />
              {b.live ? 'Live' : 'Reconnecting…'}
            </span>
            {adm && <button className="btn-ghost" onClick={() => setMem(true)}>Members ({b.project.members.length})</button>}
          </div>
        </div>
        {b.err && <p role="alert" className="mb-3 text-sm text-red-600">{b.err}</p>}
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4 md:grid-cols-3">
            {COLS.map(c => (
              <Column
                key={c.id}
                col={c}
                tasks={b.tasks.filter(t => t.status === c.id).sort((x, y) => x.order - y.order)}
                canDel={adm}
                onAdd={status => setModal({ status })}
                onEdit={task => setModal({ task, status: task.status })}
                onDel={b.del}
                setDrag={v => (drag.current = v)}
                onDrop={drop}
              />
            ))}
          </div>
          <ActivityLog acts={b.acts} />
        </div>
      </main>
      {modal && (
        <TaskModal
          task={modal.task}
          status={modal.status}
          members={b.project.members}
          onSave={d => (modal.task ? b.edit(modal.task._id, d) : b.add(d))}
          onClose={() => setModal(null)}
        />
      )}
      {mem && <MembersPanel project={b.project} onChange={b.setProject} onClose={() => setMem(false)} />}
    </>
  );
}
