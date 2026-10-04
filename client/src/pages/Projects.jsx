import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { msg } from '../api';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import UsersPanel from '../components/UsersPanel';

export default function Projects() {
  const { user } = useAuth();
  const adm = user.role === 'admin';
  const [ps, setPs] = useState([]);
  const [n, setN] = useState('');
  const [d, setD] = useState('');
  const [err, setErr] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.get('/projects').then(r => setPs(r.data)).catch(e => setErr(msg(e))).finally(() => setReady(true));
  }, []);

  const create = async e => {
    e.preventDefault();
    try {
      const r = await api.post('/projects', { name: n, description: d });
      setPs(l => [r.data, ...l]); setN(''); setD(''); setErr('');
    } catch (x) { setErr(msg(x)); }
  };

  const remove = async p => {
    if (!window.confirm(`Delete "${p.name}" and all its tasks?`)) return;
    try { await api.delete('/projects/' + p._id); setPs(l => l.filter(x => x._id !== p._id)); }
    catch (x) { setErr(msg(x)); }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="mb-4 text-2xl font-extrabold tracking-tight">Projects</h1>
          {err && <p role="alert" className="mb-3 text-sm text-red-600">{err}</p>}
          {adm && (
            <form onSubmit={create} className="mb-6 flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row">
              <input className="inp sm:w-56" placeholder="Project name" value={n} onChange={e => setN(e.target.value)} required />
              <input className="inp" placeholder="Short description (optional)" value={d} onChange={e => setD(e.target.value)} />
              <button className="btn shrink-0">Create project</button>
            </form>
          )}
          {ready && !ps.length && (
            <p className="text-sm text-slate-500">
              {adm ? 'No projects yet. Create one above to start a board.' : 'You have not been added to any project yet. Ask an admin to add you.'}
            </p>
          )}
          <ul className="grid gap-3 sm:grid-cols-2">
            {ps.map(p => (
              <li key={p._id} className="rounded-xl border border-slate-200 bg-white p-4">
                <Link to={`/projects/${p._id}`} className="block">
                  <h2 className="font-bold hover:underline">{p.name}</h2>
                  {p.description && <p className="mt-1 text-sm text-slate-500">{p.description}</p>}
                </Link>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{p.members.length} member{p.members.length === 1 ? '' : 's'}</span>
                  {adm && <button onClick={() => remove(p)} className="font-semibold text-red-600 hover:underline">Delete</button>}
                </div>
              </li>
            ))}
          </ul>
        </div>
        {adm && <UsersPanel />}
      </main>
    </>
  );
}
