import { useState } from 'react';
import TaskCard from './TaskCard';

export default function Column({ col, tasks, canDel, onAdd, onEdit, onDel, setDrag, onDrop }) {
  const [over, setOver] = useState(false);
  return (
    <section
      onDragOver={e => { e.preventDefault(); setOver(true); }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(false); }}
      onDrop={e => {
        const handled = e.defaultPrevented; // a card already handled this drop
        e.preventDefault();
        setOver(false);
        if (!handled) onDrop(col.id, null);
      }}
      className={`rounded-xl border-t-4 bg-slate-100 p-3 transition ${col.bar.replace('bg-', 'border-')} ${over ? 'ring-2 ring-ink' : ''}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-bold">
          {col.label} <span className="font-medium text-slate-500">{tasks.length}</span>
        </h2>
        <button onClick={() => onAdd(col.id)} aria-label={`Add task to ${col.label}`} className="rounded px-2 text-lg leading-none text-slate-500 hover:bg-white hover:text-ink">
          +
        </button>
      </div>
      <div className="flex min-h-[8rem] flex-col gap-2">
        {tasks.map(t => (
          <TaskCard key={t._id} t={t} canDel={canDel} onEdit={onEdit} onDel={onDel} setDrag={setDrag} onDrop={onDrop} />
        ))}
      </div>
    </section>
  );
}
