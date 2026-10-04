import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { URL } from '../api';

const EVENTS = ['task:created', 'task:updated', 'task:moved', 'task:deleted', 'activity:new'];

// Joins the project room; handlers: connect, disconnect, resync (after reconnect), plus the event names above.
export default function useSocket(pid, handlers) {
  const h = useRef(handlers);
  h.current = handlers;

  useEffect(() => {
    const s = io(URL, { auth: { token: localStorage.getItem('tp_token') } });
    let first = true;
    s.on('connect', () => {
      s.emit('project:join', pid);
      h.current.connect?.();
      if (!first) h.current.resync?.();
      first = false;
    });
    s.on('disconnect', () => h.current.disconnect?.());
    EVENTS.forEach(ev => s.on(ev, d => h.current[ev]?.(d)));
    return () => {
      s.emit('project:leave', pid);
      s.disconnect();
    };
  }, [pid]);
}
