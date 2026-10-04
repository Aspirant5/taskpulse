import { useCallback, useEffect, useState } from 'react';
import api, { msg } from '../api';
import useSocket from './useSocket';

const up = (l, t) => (l.some(x => x._id === t._id) ? l.map(x => (x._id === t._id ? t : x)) : [...l, t]);

export default function useBoard(pid) {
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [acts, setActs] = useState([]);
  const [live, setLive] = useState(false);
  const [err, setErr] = useState('');

  const load = useCallback(async () => {
    try {
      const [p, t, a] = await Promise.all([
        api.get('/projects/' + pid),
        api.get('/tasks', { params: { project: pid } }),
        api.get('/activity', { params: { project: pid } }),
      ]);
      setProject(p.data); setTasks(t.data); setActs(a.data); setErr('');
    } catch (e) {
      setErr(msg(e));
    }
  }, [pid]);

  useEffect(() => { load(); }, [load]);

  useSocket(pid, {
    resync: load,
    connect: () => setLive(true),
    disconnect: () => setLive(false),
    'task:created': t => setTasks(l => up(l, t)),
    'task:updated': t => setTasks(l => up(l, t)),
    'task:moved': t => setTasks(l => up(l, t)),
    'task:deleted': ({ _id }) => setTasks(l => l.filter(x => x._id !== _id)),
    'activity:new': a => setActs(l => [a, ...l.filter(x => x._id !== a._id)].slice(0, 50)),
  });

  const add = async d => { const r = await api.post('/tasks', { ...d, project: pid }); setTasks(l => up(l, r.data)); };
  const edit = async (id, d) => { const r = await api.patch('/tasks/' + id, d); setTasks(l => up(l, r.data)); };
  const del = async id => { await api.delete('/tasks/' + id); setTasks(l => l.filter(x => x._id !== id)); };
  const move = async (id, status, order) => {
    const prev = tasks;
    setTasks(l => l.map(x => (x._id === id ? { ...x, status, order } : x)));
    try { await api.patch(`/tasks/${id}/move`, { status, order }); }
    catch (e) { setTasks(prev); setErr(msg(e)); }
  };

  return { project, setProject, tasks, acts, live, err, add, edit, del, move };
}
