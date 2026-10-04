import { LBL } from '../constants';

const text = a => ({
  created: `created "${a.title}" in ${LBL[a.to]}`,
  moved: `moved "${a.title}" from ${LBL[a.from]} to ${LBL[a.to]}`,
  updated: `edited "${a.title}"`,
  deleted: `deleted "${a.title}"`,
}[a.action]);

const ago = d => {
  const s = Math.floor((Date.now() - new Date(d)) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(d).toLocaleDateString();
};

export default function ActivityLog({ acts }) {
  return (
    <aside className="rounded-xl border border-slate-200 bg-white p-4 lg:max-h-[75vh] lg:overflow-y-auto">
      <h2 className="mb-3 font-bold">Activity</h2>
      {!acts.length && <p className="text-sm text-slate-500">Nothing yet. Create or move a task to see it here.</p>}
      <ul className="space-y-3">
        {acts.map(a => (
          <li key={a._id} className="border-l-2 border-pulse pl-3 text-sm">
            <span className="font-semibold">{a.user?.name || 'Someone'}</span> {text(a)}
            <div className="text-xs text-slate-500">{ago(a.createdAt)}</div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
