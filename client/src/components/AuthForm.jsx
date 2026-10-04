import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { msg } from '../api';

export default function AuthForm({ mode }) {
  const reg = mode === 'register';
  const { user, login, register } = useAuth();
  const [f, setF] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  if (user) return <Navigate to="/" replace />;

  const set = k => e => setF({ ...f, [k]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    setBusy(true); setErr('');
    try { await (reg ? register : login)(f); }
    catch (x) { setErr(msg(x)); setBusy(false); }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form onSubmit={submit} className="w-full max-w-sm space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="flex items-center gap-2 text-2xl font-extrabold tracking-tight">
          <span className="h-3 w-3 animate-pulse rounded-full bg-pulse" />
          {reg ? 'Create your account' : 'Log in to TaskPulse'}
        </h1>
        {reg && <input className="inp" placeholder="Full name" value={f.name} onChange={set('name')} required />}
        <input className="inp" type="email" placeholder="Email" value={f.email} onChange={set('email')} required />
        <input className="inp" type="password" placeholder="Password (6+ characters)" minLength={6} value={f.password} onChange={set('password')} required />
        {err && <p role="alert" className="text-sm text-red-600">{err}</p>}
        <button className="btn w-full" disabled={busy}>{busy ? 'Please wait…' : reg ? 'Create account' : 'Log in'}</button>
        <p className="text-center text-sm text-slate-500">
          {reg ? 'Already have an account? ' : 'New here? '}
          <Link className="font-semibold text-ink underline" to={reg ? '/login' : '/register'}>{reg ? 'Log in' : 'Create an account'}</Link>
        </p>
      </form>
    </div>
  );
}
