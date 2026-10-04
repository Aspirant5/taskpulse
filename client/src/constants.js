export const COLS = [
  { id: 'todo', label: 'To do', bar: 'bg-slate-400' },
  { id: 'inprogress', label: 'In progress', bar: 'bg-amber-400' },
  { id: 'done', label: 'Done', bar: 'bg-emerald-500' },
];
export const LBL = Object.fromEntries(COLS.map(c => [c.id, c.label]));
