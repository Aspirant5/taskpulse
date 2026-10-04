import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-pulse" />
          TaskPulse
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span className="hidden font-medium sm:inline">{user.name}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${user.role === 'admin' ? 'bg-ink text-white' : 'bg-slate-100 text-slate-600'}`}>
            {user.role}
          </span>
          <button onClick={logout} className="btn-ghost">Log out</button>
        </div>
      </div>
    </header>
  );
}
