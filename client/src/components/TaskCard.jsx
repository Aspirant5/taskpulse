export default function TaskCard({ t, canDel, onEdit, onDel, setDrag, onDrop }) {
  return (
    <article
      draggable
      onDragStart={e => { e.dataTransfer.setData('text/plain', t._id); e.dataTransfer.effectAllowed = 'move'; setDrag(t._id); }}
      onDragOver={e => e.preventDefault()}
      onDrop={e => { e.preventDefault(); onDrop(t.status, t._id); }}
      className="cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-400 active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="break-words text-sm font-semibold">{t.title}</h3>
        <div className="flex shrink-0 gap-2 text-xs font-semibold">
          <button onClick={() => onEdit(t)} className="text-slate-500 hover:text-ink">Edit</button>
          {canDel && (
            <button onClick={() => window.confirm(`Delete "${t.title}"?`) && onDel(t._id)} className="text-red-600 hover:underline">
              Delete
            </button>
          )}
        </div>
      </div>
      {t.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500">{t.description}</p>}
      <div className="mt-2 flex justify-between gap-2 text-[11px] text-slate-500">
        <span>{t.assignee?.name ? `Assigned to ${t.assignee.name}` : 'Unassigned'}</span>
        <span>by {t.createdBy?.name}</span>
      </div>
    </article>
  );
}
