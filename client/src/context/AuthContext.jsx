import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';

const Ctx = createContext(null);
export const useAuth = () => useContext(Ctx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('tp_token'));

  useEffect(() => {
    if (!localStorage.getItem('tp_token')) return;
    api.get('/auth/me')
      .then(r => setUser(r.data))
      .catch(() => localStorage.removeItem('tp_token'))
      .finally(() => setLoading(false));
  }, []);

  const authed = async (path, body) => {
    const { data } = await api.post('/auth/' + path, body);
    localStorage.setItem('tp_token', data.token);
    setUser(data.user);
  };
  const logout = () => {
    localStorage.removeItem('tp_token');
    setUser(null);
  };

  return (
    <Ctx.Provider value={{ user, loading, login: b => authed('login', b), register: b => authed('register', b), logout }}>
      {children}
    </Ctx.Provider>
  );
}
