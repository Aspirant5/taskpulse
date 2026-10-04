import axios from 'axios';

export const URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const api = axios.create({ baseURL: URL + '/api' });

api.interceptors.request.use(c => {
  const t = localStorage.getItem('tp_token');
  if (t) c.headers.Authorization = 'Bearer ' + t;
  return c;
});
api.interceptors.response.use(
  r => r,
  e => {
    if (e.response?.status === 401 && !e.config.url.startsWith('/auth/login')) {
      localStorage.removeItem('tp_token');
      window.location.href = '/login';
    }
    return Promise.reject(e);
  }
);

export const msg = e => e.response?.data?.message || e.message || 'Something went wrong';
export default api;
