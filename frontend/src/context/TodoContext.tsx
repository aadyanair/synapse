import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface TodoItem {
  id: string;
  text: string;
  done: boolean;
  intervalMinutes: number | null;
  nextAt: number | null;
}

interface TodoContextType {
  todos: TodoItem[];
  addTodo: (text: string) => void;
  toggleDone: (id: string) => void;
  removeTodo: (id: string) => void;
  setReminder: (id: string, minutes: number) => Promise<void>;
  stopReminder: (id: string) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

function readTodos(): TodoItem[] {
  try {
    const raw = localStorage.getItem('todos');
    if (!raw) return [];
    const parsed = JSON.parse(raw) as TodoItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTodos(todos: TodoItem[]) {
  try {
    localStorage.setItem('todos', JSON.stringify(todos));
  } catch {}
}

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>(() => readTodos());
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    writeTodos(todos);
  }, [todos]);

  const addTodo = (text: string) => {
    const item: TodoItem = {
      id: crypto.randomUUID(),
      text,
      done: false,
      intervalMinutes: null,
      nextAt: null,
    };
    setTodos((prev) => [item, ...prev]);
  };

  const toggleDone = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  const removeTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const ensurePermission = async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission !== 'denied') {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }
    return false;
  };

  const setReminder = async (id: string, minutes: number) => {
    const ok = await ensurePermission();
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              intervalMinutes: minutes > 0 ? minutes : null,
              nextAt: ok && minutes > 0 ? Date.now() + minutes * 60000 : null,
            }
          : t,
      ),
    );
  };

  const stopReminder = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, intervalMinutes: null, nextAt: null } : t)));
  };

  useEffect(() => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTodos((prev) => {
        const now = Date.now();
        let changed = false;
        const next = prev.map((t) => {
          if (t.intervalMinutes && t.nextAt && now >= t.nextAt) {
            try {
              if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Reminder', { body: t.text });
              }
            } catch {}
            changed = true;
            return { ...t, nextAt: now + t.intervalMinutes * 60000 };
          }
          return t;
        });
        return changed ? next : prev;
      });
    }, 30000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, []);

  const value = useMemo(
    () => ({ todos, addTodo, toggleDone, removeTodo, setReminder, stopReminder }),
    [todos],
  );

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
}

export function useTodos() {
  const ctx = useContext(TodoContext);
  if (!ctx) throw new Error('useTodos must be used within TodoProvider');
  return ctx;
}
